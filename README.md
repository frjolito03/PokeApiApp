# Pokédex — React Native + Expo + TypeScript

Este es mi challenge técnico: una Pokédex hecha con React Native, Expo y TypeScript, consumiendo [PokéAPI](https://pokeapi.co/). Lista los primeros Pokémon, deja entrar al detalle de cada uno, y guarda algo de información en el dispositivo para que funcione parcialmente sin conexión.

Abajo va cómo correrlo, y después por qué quedó armado así.

## Correrlo

Necesitás Node 20+, npm 10+ y algo donde probar la app: la app Expo Go en tu celular (lo más rápido), o un emulador/simulador si preferís.

```bash
npm install
npm start
```

Con el Metro Bundler abierto podés escanear el QR desde Expo Go, o apretar `a` (Android) / `i` (iOS, necesita macOS) directamente en la terminal. También están los atajos de siempre:

```bash
npm run android
npm run ios
```

Para revisar que todo esté sano:

```bash
npm test          # Jest
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

Estos tres corren también en GitHub Actions en cada push (`.github/workflows/ci.yml`), así que si algo se rompe se ve ahí antes que en la revisión manual.

## Qué hace la app

- Lista los primeros 20 Pokémon (nombre + imagen) y sigue trayendo más a medida que scrolleás, de 20 en 20.
- Al tocar uno, muestra tipos, habilidades (marca las ocultas), estadísticas base con una barrita animada, altura, peso y experiencia base.
- Tiene sus estados de carga (skeletons), error con botón de reintentar, vacío, y un aviso de "sin conexión, mostrando datos guardados" cuando lo que ves viene de la caché local.
- Sigue el tema del sistema (claro/oscuro) automáticamente, sin switch manual.
- Los elementos interactivos tienen labels de accesibilidad razonables.
- La lista usa `FlatList` con las virtualización de siempre (no renderiza 900 Pokémon de una).

## La restricción de "sin librerías externas" — cómo la resolví

Este es el punto más discutible de todo el challenge, así que prefiero explicarlo en vez de dejarlo implícito. El enunciado pide usar solo lo que trae React Native/JS puro. El problema es que React Native, tal como está hoy, no trae navegación ni persistencia local en su core: `AsyncStorage` se sacó del core hace un montón de versiones y ahora vive en un paquete aparte que mantiene la comunidad. Tomado al pie de la letra, no se podían cumplir dos requisitos explícitos del mismo challenge (navegación a detalle y persistencia).

La decisión que tomé, para que quede documentada:

- **Navegación**: la armé con `useState` + `Context` (está en `src/presentation/navigation`). Son dos pantallas, lista y detalle, así que instalar `react-navigation` para eso no se justificaba.
- **Persistencia**: acá sí instalé algo, `@react-native-async-storage/async-storage`. Es prácticamente el único camino soportado hoy para guardar datos entre sesiones en RN/Expo, no hay alternativa "nativa" real. Es la única dependencia de runtime que agregué fuera de `expo`, `react` y `react-native`.
- **Red**: `fetch`, que ya viene con RN. Nada de `axios`.
- **Estado**: hooks de siempre (`useState`/`useEffect`). Nada de Redux, Zustand ni React Query.
- **UI**: `StyleSheet` y componentes core. Ningún kit de componentes.

`eslint` y `jest` (con sus plugins de Expo) son dependencias de desarrollo, no viajan en la app, así que no compiten con esta restricción.

## Cómo está armado por dentro

```
src/
  domain/            # Reglas de negocio puras, no sabe que existe React Native
    models/          # PokemonSummary, PokemonDetail, Page, CacheResult
    errors/          # AppError + AppErrorType
    repositories/     # IPokemonRepository (la abstracción que consume el dominio)
    usecases/         # GetPokemonListUseCase, GetPokemonDetailUseCase

  data/               # Acá vive todo lo que sabe de la infraestructura real
    datasources/
      remote/          # PokeApiRemoteDataSource (fetch) + DTOs tal cual los devuelve PokéAPI
      local/           # PokemonLocalDataSource (AsyncStorage)
    mappers/           # DTO -> modelo de dominio
    repositories/      # PokemonRepository, implementa IPokemonRepository

  core/               # utilidades sin nada de UI
    constants/, utils/, di/   # composition root acá (container.ts)

  presentation/        # todo lo que es pantalla
    navigation/, dependencies/, theme/, hooks/, components/, screens/
```

La idea detrás de separar en capas no fue "porque Clean Architecture lo dice", sino resolver un problema concreto: quería poder probar la lógica de negocio (los casos de uso, el mapeo de datos) sin levantar React Native ni mockear medio mundo. Por eso `domain/` no importa nada de RN, fetch ni AsyncStorage — son clases y funciones de TypeScript puro, y los tests de `src/domain/usecases/__tests__` corren sin ningún mock de plataforma.

`IPokemonRepository` es la pieza que hace que esto funcione: el dominio depende de esa interfaz, no de la clase concreta que habla con PokéAPI y AsyncStorage. Quien conecta ambos lados es `core/di/container.ts` (un composition root bien simple, nada de un framework de DI) y `DependenciesContext` lo inyecta hacia los componentes. Si algún día quisiera cambiar la fuente de datos — otra API, GraphQL, lo que sea — tocaría una implementación nueva de esa interfaz y nada más.

También separé bastante fino adentro de `data/`: `PokeApiRemoteDataSource` solo sabe pegarle a PokéAPI y devolver los DTOs tal cual vienen, `PokemonLocalDataSource` solo sabe leer y escribir en AsyncStorage, `PokemonMapper` solo transforma esos DTOs al modelo de dominio, y `PokemonRepository` es el único que decide la estrategia (cuándo usar red, cuándo caer a caché). Cada uno cambia por una sola razón, que es más o menos el punto de tener responsabilidad única.

### Caché y modo sin conexión

La estrategia que usa `PokemonRepository` es bastante directa: intenta la red primero, y si falla, recurre a lo último que guardó localmente.

1. Pide los datos a PokéAPI.
2. Si responde bien, los mapea y los guarda en AsyncStorage (así la próxima vez ya están ahí), y los devuelve marcados como que vienen de red.
3. Si la red falla — sin conexión, timeout, lo que sea — busca en la caché. Si hay algo guardado, lo devuelve marcado como "viene de caché" y la pantalla muestra el aviso correspondiente. Si no hay nada guardado, ahí sí deja que el error suba.

No le puse expiración a la caché (nada de TTL). Lo pensé y no tiene mucho sentido para este caso: los datos de un Pokémon (nombre, tipos, stats base) no cambian de un día para el otro, así que guardar una copia vieja no genera un problema real de consistencia, y sí gana en velocidad de carga en visitas repetidas. El listado además se guarda acumulado — cada página nueva se combina con lo que ya había, sin duplicar — para que si te quedás sin señal a mitad del scroll, no pierdas lo que ya habías cargado.

### La navegación casera

`NavigationContext.tsx` guarda un stack simple (`useState<NavigationEntry[]>`) y lo expone por Context, con `navigateToDetail` y `goBack`. También engancha el botón físico de "atrás" en Android con `BackHandler`. No tiene animaciones de transición ni deep linking; para dos pantallas no hacía falta.

### Un par de cosas sueltas que vale la pena mencionar

`SafeAreaView` ya no existe en el core de React Native (lo sacaron; el reemplazo oficial es una librería aparte que quedaba fuera del alcance acá). Así que en `App.tsx` calculo el espacio de la barra de estado a mano: en Android uso `StatusBar.currentHeight`, que sí está disponible en runtime, y en iOS dejo un valor fijo razonable para el notch. No es tan preciso como la librería oficial, pero cumple sin agregar dependencias.

Los colores por tipo de Pokémon y la paleta clara/oscura están en un solo lugar (`presentation/theme/`) para no repetir códigos de color pegados en cada componente.

## Testing

No agregué una librería de testing de componentes (React Testing Library y compañía) para no sumar otra dependencia a algo que ya estaba cumpliendo su función sin ella. En cambio me enfoqué en probar donde realmente vive la lógica:

- `core/utils`: formateo de números y unidades, extracción de ids desde las URLs que devuelve PokéAPI.
- `data/mappers`: que el mapeo DTO → dominio ordene bien tipos y habilidades, y que resuelva el fallback de imagen si no hay artwork oficial.
- `data/repositories`: los tres caminos de la estrategia de caché (éxito de red, fallback offline, y el caso feo de que no haya ni red ni caché).
- `domain/usecases`: que deleguen correctamente en el repositorio.

```bash
npm test
```

## Librerías

| Paquete | Runtime/dev | Por qué está |
|---|---|---|
| `expo` | runtime | Base del proyecto — simplifica muchísimo el build y el correr en Android/iOS desde el mismo código. |
| `react`, `react-native` | runtime | Las pide Expo. |
| `expo-status-bar` | runtime | Viene con el template de Expo, controla el estilo de la barra de estado. |
| `@react-native-async-storage/async-storage` | runtime | La única que sumé a propósito — persistencia local, explicado arriba. |
| `typescript` | dev | `strict: true`, sin excepciones. |
| `eslint`, `eslint-config-expo` | dev | Linting con las reglas oficiales de Expo, incluye las de React Hooks. |
| `jest`, `jest-expo`, `@types/jest` | dev | Testing. |
