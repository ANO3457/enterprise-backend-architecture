export interface InventoryItem {
  id: string;
  sku: string;
  stock: number;
}

export interface LockResult {
  acquired: boolean;
  token?: string;
  key?: string;
}
