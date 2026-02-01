import { Request, Response } from 'express';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MarketingStrategyService } from '@app/marketing_strategy/services/marketing_strategy.service';
import { CreateMarketingStrategyDto } from '@app/marketing_strategy/dto/create_marketing_strategy.dto';
import { ErrorManager } from '@app/common/utils/error-manager';
import { AccessLoginGuard } from '@app/auth/guards/access-login.guard';
import { MarketingStrategyInterceptor } from '@app/marketing_strategy/interceptors/marketing_strategy.interceptor';
import { AccessPublicDecorator } from '@app/common/decorators/access-public.decorator';

@ApiTags('Marketing Strategy')
@Controller('marketing-strategy')
@UseGuards(AccessLoginGuard)
export class MarketingStrategyController {
  constructor(private readonly marketingStrategyService: MarketingStrategyService) { }

  @UseInterceptors(MarketingStrategyInterceptor)
  @Post('create')
  public async createStrategy(@Body() body: CreateMarketingStrategyDto) {
    try {
      return await this.marketingStrategyService.createStrategy(body);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @AccessPublicDecorator()
  @Get('search')
  public async searchStrategies(@Query('keyword') keyword?: string, @Query('location') location?: string) {
    try {
      return await this.marketingStrategyService.searchStrategies(keyword, location);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Get('my-strategy')
  public async getMyStrategy() {
    try {
      return await this.marketingStrategyService.getStrategyByUserId(this.marketingStrategyService.userLogged.id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @AccessPublicDecorator()
  @Get('get-all')
  public async getAllStrategies() {
    try {
      return await this.marketingStrategyService.getAllStrategies();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Get(':id')
  public async getMarketingStrategyById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.marketingStrategyService.getStrategyById(id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Delete('delete')
  public async softDeleteMarketingStrategy(@Res() res: Response) {
    try {
      const response = await this.marketingStrategyService.softDeleteMarketingStrategy();
      if (response.affected) return res.json({ message: 'Estrategia de marketing eliminada' });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Post('restore')
  public async restoreSoftDeleteMarketingStrategy(@Res() res: Response) {
    try {
      const response = await this.marketingStrategyService.restoreSoftDeleteMarketingStrategy();
      if (response.affected) return res.json({ message: 'Estrategia de marketing restaurada' });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
