import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateProductOptionDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  values: string[];
}
