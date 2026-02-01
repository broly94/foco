import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpeningDaysHoursController } from '@app/opening_days_hours/controllers/opening_days_hours.controller';
import { OpeningDaysHoursService } from '@app/opening_days_hours/services/opening_days_hours.service';
import { OpeningDaysHoursEntity } from '@app/opening_days_hours/entities/opening_days_hours.entity';
import { MarketingStrategyModule } from '@app/marketing_strategy/marketing_strategy.module';
import { AddressMarketingModule } from '@app/address_marketing/address_marketing.module';
import { RequestContextUserMiddleware } from '@app/common/middlewares/request_context_user.middleware';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';
import { RequestContextUserService } from '@app/common/providers/request_context_user.service';

@Module({
  imports: [MarketingStrategyModule, AddressMarketingModule, TypeOrmModule.forFeature([OpeningDaysHoursEntity, MarketingStrategyEntity])],
  controllers: [OpeningDaysHoursController],
  providers: [OpeningDaysHoursService, RequestContextUserService],
})
export class OpeningDaysHoursModule implements NestModule {
  configure(configure: MiddlewareConsumer) {
    configure.apply(RequestContextUserMiddleware).forRoutes(OpeningDaysHoursController);
  }
}
