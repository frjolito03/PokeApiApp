export interface Page<TItem> {
  items: TItem[];
  nextOffset: number | null;
  total: number;
}
