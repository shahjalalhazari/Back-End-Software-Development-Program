import {
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<SubscriptionResponseDto[]> {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: Partial<CreateSubscriptionDto>,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.subscriptionService.delete(id);
  }
}
