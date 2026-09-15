import AsyncStorage from '@react-native-async-storage/async-storage';

import { Page } from '../../../domain/models/Page';
import { PokemonDetail } from '../../../domain/models/PokemonDetail';
import { PokemonSummary } from '../../../domain/models/PokemonSummary';

const LIST_CACHE_KEY = '@pokedex/pokemon_list';
const DETAIL_CACHE_KEY_PREFIX = '@pokedex/pokemon_detail/';

export class PokemonLocalDataSource {
  async getCachedList(): Promise<Page<PokemonSummary> | null> {
    const raw = await AsyncStorage.getItem(LIST_CACHE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as Page<PokemonSummary>;
  }

  async mergeAndSaveList(page: Page<PokemonSummary>): Promise<void> {
    const existing = await this.getCachedList();
    const mergedById = new Map<number, PokemonSummary>();

    for (const item of existing?.items ?? []) {
      mergedById.set(item.id, item);
    }
    for (const item of page.items) {
      mergedById.set(item.id, item);
    }

    const merged: Page<PokemonSummary> = {
      items: Array.from(mergedById.values()).sort((a, b) => a.id - b.id),
      nextOffset: page.nextOffset,
      total: page.total,
    };

    await AsyncStorage.setItem(LIST_CACHE_KEY, JSON.stringify(merged));
  }

  async getCachedDetail(idOrName: string | number): Promise<PokemonDetail | null> {
    const raw = await AsyncStorage.getItem(this.detailKey(idOrName));
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as PokemonDetail;
  }

  async saveDetail(detail: PokemonDetail): Promise<void> {
    const serialized = JSON.stringify(detail);
    await Promise.all([
      AsyncStorage.setItem(this.detailKey(detail.id), serialized),
      AsyncStorage.setItem(this.detailKey(detail.name), serialized),
    ]);
  }

  private detailKey(idOrName: string | number): string {
    return `${DETAIL_CACHE_KEY_PREFIX}${String(idOrName).toLowerCase()}`;
  }
}
