import {
  capitalize,
  decimetersToMeters,
  formatDisplayName,
  formatKilograms,
  formatMeters,
  formatPokedexNumber,
  hectogramsToKilograms,
} from '../formatters';

describe('capitalize', () => {
  it('pone en mayúscula la primera letra', () => {
    expect(capitalize('bulbasaur')).toBe('Bulbasaur');
  });

  it('no falla con una cadena vacía', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('formatPokedexNumber', () => {
  it('rellena con ceros a la izquierda hasta 3 dígitos', () => {
    expect(formatPokedexNumber(1)).toBe('#001');
    expect(formatPokedexNumber(25)).toBe('#025');
    expect(formatPokedexNumber(150)).toBe('#150');
  });

  it('no trunca números de más de 3 dígitos', () => {
    expect(formatPokedexNumber(1010)).toBe('#1010');
  });
});

describe('formatDisplayName', () => {
  it('reemplaza guiones por espacios y capitaliza', () => {
    expect(formatDisplayName('mr-mime')).toBe('Mr mime');
  });
});

describe('conversiones de unidades', () => {
  it('convierte decímetros a metros', () => {
    expect(decimetersToMeters(7)).toBe(0.7);
  });

  it('convierte hectogramos a kilogramos', () => {
    expect(hectogramsToKilograms(69)).toBe(6.9);
  });

  it('formatea metros y kilogramos con una unidad legible', () => {
    expect(formatMeters(0.7)).toBe('0.7 m');
    expect(formatKilograms(6.9)).toBe('6.9 kg');
  });
});
