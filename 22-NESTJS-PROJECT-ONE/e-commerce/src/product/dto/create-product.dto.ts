import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(3, 200)
  @IsNotEmpty()
  name: string;


  @IsString()
  @MaxLength(5000)
  @IsNotEmpty()
  description: string;


  @IsString()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  @IsNotEmpty()
  sku: string


  @IsString()
  @IsOptional()
  slug?: string;


  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;


  @IsNumber()
  @Min(0)
  @IsOptional()
  compareAtPrice?: number;

  @IsBoolean()
  @IsOptional()
  trackInventory?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}