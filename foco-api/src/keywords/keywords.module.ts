import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordsEntity } from './entities/keywords.entity';
import { KeywordsService } from './services/keywords.service';
import { KeywordsController } from './controllers/keywords.controller';

@Module({
    imports: [TypeOrmModule.forFeature([KeywordsEntity])],
    providers: [KeywordsService],
    controllers: [KeywordsController],
    exports: [KeywordsService, TypeOrmModule],
})
export class KeywordsModule { }
