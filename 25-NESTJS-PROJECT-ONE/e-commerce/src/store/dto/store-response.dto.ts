import { StoreStatus, Store } from '../entity/store.entity';

export class StoreResponseDto {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status: StoreStatus;
  storeEmail: string;
  storePhoneNumber?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<StoreResponseDto>) {
    Object.assign(this, partial);
  }
}
