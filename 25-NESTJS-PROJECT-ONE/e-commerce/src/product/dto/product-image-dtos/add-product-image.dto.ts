import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class AddProductImageDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(2048)
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  altText?: string;
}
