import { POKE_SPRITE_BASE_URL } from '../constants/api';

export function extractIdFromResourceUrl(resourceUrl: string): number {
  const segments = resourceUrl.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  const id = Number(lastSegment);

  if (Number.isNaN(id)) {
    throw new Error(`No se pudo extraer el id del recurso: ${resourceUrl}`);
  }

  return id;
}

export function buildSpriteUrl(id: number): string {
  return `${POKE_SPRITE_BASE_URL}/${id}.png`;
}
