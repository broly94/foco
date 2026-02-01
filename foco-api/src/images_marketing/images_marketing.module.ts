import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ImagesMarketingController } from '@app/images_marketing/controllers/images_marketing.controller';
import { ImagesMarketingService } from '@app/images_marketing/services/images_marketing.service';
import { CloudinaryProvider } from '@app/images_marketing/providers/cloudinary.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesMarketingEntity } from '@app/images_marketing/entities/images_marketing.entity';
import { UsersEntity } from '@app/users/entities/users.entity';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';
import { RequestContextUserService } from '@app/common/providers/request_context_user.service';
import { RequestContextUserMiddleware } from '@app/common/middlewares/request_context_user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([ImagesMarketingEntity, UsersEntity, MarketingStrategyEntity])],
  controllers: [ImagesMarketingController],
  providers: [ImagesMarketingService, CloudinaryProvider, RequestContextUserService],
})
export class ImagesMarketingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextUserMiddleware).forRoutes(ImagesMarketingController);
  }
}
