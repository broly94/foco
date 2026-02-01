import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingsMarketingEntity } from '@app/ratings_marketing/entities/ratings_marketing.entity';
import { ErrorManager } from '@app/common/utils/error-manager';
import { CreateOrUpdateRatingsMarketingDto } from '@app/ratings_marketing/dto/CreateRatingsMarketingDto';
import { MarketingStrategyService } from '@app/marketing_strategy/services/marketing_strategy.service';
import { UsersService } from '@app/users/services/users.service';
import { UsersEntity } from '@app/users/entities/users.entity';
import { RequestContextUserService } from '@app/common/providers/request_context_user.service';

@Injectable()
export class RatingsMarketingService {
  public userLoggin: UsersEntity;

  constructor(
    @InjectRepository(RatingsMarketingEntity)
    private readonly ratingsMarketingRepository: Repository<RatingsMarketingEntity>,
    private readonly marketingStrategyService: MarketingStrategyService,
    private readonly usersService: UsersService,
    private readonly requestContextUser: RequestContextUserService,
  ) {
    this.userLoggin = this.requestContextUser.getUser();
  }

  public async createRatingsMarketing(body: CreateOrUpdateRatingsMarketingDto) {
    const { marketing_strategy, starts, comment } = body;
    try {
      const marketingStrategyFound = await this.marketingStrategyService.getStrategyById(marketing_strategy);
      console.log(this.userLoggin);
      if (marketingStrategyFound.user.id === this.userLoggin.id)
        throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error, el usuario no puede auto evaluase' });

      const createRatings = this.ratingsMarketingRepository.create({ marketing_strategy, starts, user: this.userLoggin, comment });
      console.log(createRatings);
      return await this.ratingsMarketingRepository.save(createRatings);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateRatingsMarketing(body: CreateOrUpdateRatingsMarketingDto) {
    const { marketing_strategy, starts, comment } = body;
    try {
      const marketingStrategyFound = await this.marketingStrategyService.getStrategyById(marketing_strategy);

      if (marketingStrategyFound.user.id === this.userLoggin.id)
        throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error, el usuario no puede auto evaluase' });

      // SE obtiene los ratings de la estrategia de marketing siempre y cuando la estategia pasada exista y ademas que el usuario sea el mismo que dejo el rating
      const ratingsMarketingFound = await this.ratingsMarketingRepository.findOne({
        where: { marketing_strategy: marketingStrategyFound.id, user: { id: this.userLoggin.id } },
      });

      return await this.ratingsMarketingRepository.update(ratingsMarketingFound.id, { starts, comment });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  /*public async getAllRatingsMarketingStrategy() {
    try {
      return await this.ratingsMarketingRepository
        .createQueryBuilder('ratings_strategy')
        .leftJoinAndSelect('ratings_strategy.user', 'user')
        .leftJoinAndSelect('ratings_strategy.marketing_strategy', 'marketing_strategy')
        .select(['user.id', 'user.name', 'user.avatar', 'ratings_strategy.starts', 'ratings_strategy.comment', 'marketing_strategy.id'])
        .getMany();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }*/

  /*public async findRatingsByUser(idUser: number) {
    try {
      const user = await this.usersService.findUserById(idUser, false);
      return await this.ratingsMarketingRepository.find({ where: { user } });
    } catch (error) {
      throw ErrorManager.createSignatureError(error);
    }
  }*/

  public async averageRatingStarts(strategyId: number) {
    try {
      const strategy = await this.marketingStrategyService.getStrategyById(strategyId);
      const totalStartsArray = strategy.ratings_marketing.map((ratings) => ratings.starts);
      const average = totalStartsArray.reduce((back, next) => back + next, 0);
      return {
        average: average / totalStartsArray.length,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
