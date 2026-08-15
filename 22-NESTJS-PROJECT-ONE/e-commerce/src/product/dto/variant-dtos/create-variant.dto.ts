import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';

export class CreateVariantDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  compareAtPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  costPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsString()
  @IsNotEmpty()
  option1: string;

  @IsString()
  @IsOptional()
  option2?: string;

  @IsString()
  @IsOptional()
  option3?: string;

  @IsUUID()
  @IsOptional()
  imageId?: string;
}
