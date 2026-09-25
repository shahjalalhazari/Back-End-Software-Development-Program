import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { UserSubscriptionResponseDto } from './dto/user-subscription-response.dto';
import { UserSubscriptionService } from './user_subscription.service';

@Controller('user-subscription')
export class UserSubscriptionController {
  constructor(
    private readonly userSubscriptionService: UserSubscriptionService,
  ) {}

  // ADD NEW SUBSCRIPTION
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async subscribe(
    @Body() createUserSubscriptionDto: CreateUserSubscriptionDto,
  ): Promise<UserSubscriptionResponseDto> {
    return this.userSubscriptionService.subscribe(createUserSubscriptionDto);
  }

  // GET ALL SUBSCRIPTIONS
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserSubscriptionResponseDto[]> {
    return this.userSubscriptionService.findAll();
  }

  // GET SUBSCRIPTION BY SUBSCRIPTION ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id') id: string,
  ): Promise<UserSubscriptionResponseDto> {
    return this.userSubscriptionService.findById(id);
  }

  // GET SUBSCRIPTION BY USER ID
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUserId(
    @Param('userId') userId: string,
  ): Promise<UserSubscriptionResponseDto[]> {
    return this.userSubscriptionService.findByUserId(userId);
  }

  // GET SUBSCRIPTION BY SUBSCRIPTION ID
  @Get('subscription/:subscriptionId')
  @HttpCode(HttpStatus.OK)
  async findBySubscriptionId(
    @Param('subscriptionId') subscriptionId: string,
  ): Promise<UserSubscriptionResponseDto[]> {
    return this.userSubscriptionService.findBySubscriptionId(subscriptionId);
  }

  // GET ALL EXPIRED SUBSCRIPTIONS
  @Get('expired')
  @HttpCode(HttpStatus.OK)
  async findExpiredSubscriptions(): Promise<UserSubscriptionResponseDto[]> {
    return this.userSubscriptionService.findExpiredSubscriptions();
  }

  // UPDATE OR RENEW SUBSCRIPTION
  @Patch(':id/renew')
  @HttpCode(HttpStatus.OK)
  async renew(
    @Param('id') id: string,
    @Body('endDate') endDate: string,
  ): Promise<UserSubscriptionResponseDto> {
    return this.userSubscriptionService.renew(id, endDate);
  }

  // SINGLE EXPIRED SUBSCRIPTION BY ID
  @Patch(':id/expire')
  @HttpCode(HttpStatus.OK)
  async expire(@Param('id') id: string): Promise<UserSubscriptionResponseDto> {
    return this.userSubscriptionService.expire(id);
  }

  // SINGLE CANCELED SUBSCRIPTION BY ID
  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string): Promise<UserSubscriptionResponseDto> {
    return this.userSubscriptionService.cancel(id);
  }

  // UPDATE USER SUBSCRIPTION
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateUserSubscriptionDto: UpdateUserSubscriptionDto,
  ): Promise<UserSubscriptionResponseDto> {
    return this.userSubscriptionService.update(id, updateUserSubscriptionDto);
  }

  // DELETE / REMOVE USER SUBSCRIPTION
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.userSubscriptionService.remove(id);
  }
}
