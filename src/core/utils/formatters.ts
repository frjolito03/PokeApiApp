export function capitalize(value: string): string {
  if (value.length === 0) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatPokedexNumber(id: number): string {
  return `#${id.toString().padStart(3, '0')}`;
}

export function formatDisplayName(name: string): string {
  return capitalize(name.replace(/-/g, ' '));
}

export function decimetersToMeters(decimeters: number): number {
  return decimeters / 10;
}

export function hectogramsToKilograms(hectograms: number): number {
  return hectograms / 10;
}

export function formatMeters(meters: number): string {
  return `${meters.toFixed(1)} m`;
}

export function formatKilograms(kilograms: number): string {
  return `${kilograms.toFixed(1)} kg`;
}
