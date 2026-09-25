import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreResponseDto } from './dto/store-response.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStoreDto: CreateStoreDto): Promise<StoreResponseDto> {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<StoreResponseDto[]> {
    return this.storeService.findAll();
  }

  @Get('slug/:slug')
  @HttpCode(HttpStatus.OK)
  findBySlug(@Param('slug') slug: string): Promise<StoreResponseDto> {
    return this.storeService.findBySlug(slug);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  findByUserId(@Param('userId') userId: string): Promise<StoreResponseDto[]> {
    return this.storeService.findByUserId(userId);
  }

  @Get('user/:userId/status/:status')
  @HttpCode(HttpStatus.OK)
  findByUserStatus(
    @Param('userId') userId: string,
    @Param('status') status: string,
  ): Promise<StoreResponseDto[]> {
    return this.storeService.findByUserStatus(userId, status as any);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: string): Promise<StoreResponseDto> {
    return this.storeService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    return this.storeService.update(id, updateStoreDto);
  }
}
