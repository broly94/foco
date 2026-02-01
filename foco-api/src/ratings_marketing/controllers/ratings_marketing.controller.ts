import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { RatingsMarketingService } from '@app/ratings_marketing/services/ratings_marketing.service';
import { CreateOrUpdateRatingsMarketingDto } from '@app/ratings_marketing/dto/CreateRatingsMarketingDto';
import { ErrorManager } from '@app/common/utils/error-manager';
import { AccessLoginGuard } from '@app/auth/guards/access-login.guard';
import { AccessPublicDecorator } from '@app/common/decorators/access-public.decorator';

@ApiTags('Ratings Marketing Strategy')
@Controller('ratings-marketing-strategy')
@UseGuards(AccessLoginGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsMarketingService) {}

  @Post('create')
  public async createStartsMarketing(@Body() body: CreateOrUpdateRatingsMarketingDto) {
    try {
      const response = await this.ratingsService.createRatingsMarketing(body);
      console.log(response);
      return response;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Post('update')
  public async updateStartsMarketing(@Body() body: CreateOrUpdateRatingsMarketingDto) {
    try {
      const response = await this.ratingsService.updateRatingsMarketing(body);
      console.log(response);
      return response;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // @Get('get')
  // public async getAllRatingsMarketingStrategy() {
  //   try {
  //     return await this.ratingsService.getAllRatingsMarketingStrategy();
  //   } catch (error) {
  //     throw ErrorManager.createSignatureError(error.message);
  //   }
  // }

  @AccessPublicDecorator()
  @Get('average-starts/:id')
  public async getAverageStart(@Param('id', ParseIntPipe) id: any) {
    try {
      return await this.ratingsService.averageRatingStarts(id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
