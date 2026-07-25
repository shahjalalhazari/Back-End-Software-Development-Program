import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsEmail,
  Length,
} from 'class-validator';
import { StoreStatus } from '../entity/store.entity';

export class UpdateStoreDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsEnum(StoreStatus)
  status?: StoreStatus;

  @IsOptional()
  @IsEmail()
  storeEmail?: string;

  @IsOptional()
  @IsString()
  @Length(0, 15)
  storePhoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
