import { Module } from '@nestjs/common';
import { SuscriptionsController } from './controllers/suscriptions.controller';
import { SuscriptionsService } from './services/suscriptions.service';

@Module({
  controllers: [SuscriptionsController],
  providers: [SuscriptionsService]
})
export class SuscriptionsModule {}
