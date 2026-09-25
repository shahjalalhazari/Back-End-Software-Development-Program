import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsEmail,
  Length,
} from 'class-validator';
import { StoreStatus } from '../entity/store.entity';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsEnum(StoreStatus)
  status?: StoreStatus;

  @IsNotEmpty()
  @IsEmail()
  storeEmail: string;

  @IsOptional()
  @IsString()
  @Length(0, 15)
  storePhoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
