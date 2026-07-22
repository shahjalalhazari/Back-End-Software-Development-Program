import { Test, TestingModule } from '@nestjs/testing';
import { UserSubscriptionController } from './user_subscription.controller';
import { UserSubscriptionService } from './user_subscription.service';

describe('UserSubscriptionController', () => {
  let controller: UserSubscriptionController;

  const mockUserSubscriptionService = {
    subscribe: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findBySubscriptionId: jest.fn(),
    findExpiredSubscriptions: jest.fn(),
    renew: jest.fn(),
    expire: jest.fn(),
    cancel: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSubscriptionController],
      providers: [
        {
          provide: UserSubscriptionService,
          useValue: mockUserSubscriptionService,
        },
      ],
    }).compile();

    controller = module.get<UserSubscriptionController>(UserSubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
