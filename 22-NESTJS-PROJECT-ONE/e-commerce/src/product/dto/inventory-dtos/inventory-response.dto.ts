export class InventoryResponseDto {
  productId: string;
  quantity: number;
  trackInventory: boolean;
  allowBackorders: boolean;
  lowStockThreshold: number;
  inStock: boolean;
  lowStock: boolean;
}
