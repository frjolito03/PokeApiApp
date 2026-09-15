import { buildSpriteUrl, extractIdFromResourceUrl } from '../pokemonResource';

describe('extractIdFromResourceUrl', () => {
  it('extrae el id del último segmento de la URL', () => {
    expect(extractIdFromResourceUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('funciona sin barra final', () => {
    expect(extractIdFromResourceUrl('https://pokeapi.co/api/v2/pokemon/1')).toBe(1);
  });

  it('lanza un error si la URL no termina en un número', () => {
    expect(() => extractIdFromResourceUrl('https://pokeapi.co/api/v2/pokemon/abc/')).toThrow();
  });
});

describe('buildSpriteUrl', () => {
  it('construye la URL del sprite a partir del id', () => {
    expect(buildSpriteUrl(25)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
    );
  });
});
