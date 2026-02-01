import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OpeningDaysHoursEntity } from '@app/opening_days_hours/entities/opening_days_hours.entity';
import { MarketingStrategyService } from '@app/marketing_strategy/services/marketing_strategy.service';
import { ErrorManager } from '@app/common/utils/error-manager';
import { CreateOrUpdateOpeningDaysHoursDto } from '@app/opening_days_hours/dto/CreateOpeningDaysHoursDto';
import { UsersEntity } from '@app/users/entities/users.entity';
import { RequestContextUserService } from '@app/common/providers/request_context_user.service';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';

@Injectable()
export class OpeningDaysHoursService {
  private hoursMarketingStrategy: OpeningDaysHoursEntity;
  private userLogged: UsersEntity;
  constructor(
    @InjectRepository(OpeningDaysHoursEntity)
    private readonly openingDaysHoursRepository: Repository<OpeningDaysHoursEntity>,
    @InjectRepository(MarketingStrategyEntity)
    private readonly marketingStrategyRepository: Repository<MarketingStrategyEntity>,
    private readonly requestContextUserService: RequestContextUserService,
  ) {
    this.userLogged = this.requestContextUserService.getUser();
  }

  public async createOrUpdateOpeningDaysHours(body: CreateOrUpdateOpeningDaysHoursDto, idUser: number) {
    const { day, closes_at_noon, closing_evening, closing_morning, open_24_hours, opening_afternoon, opening_morning } = body;
    try {
      const marketingStrategy = await this.marketingStrategyRepository.findOne({ where: { user: { id: this.userLogged.id } } });
      // Antes de validar si el dia esta registrado, validamos que hayan ingresado algun dia.
      if (marketingStrategy.opening_days_hours != null) {
        const hoursFound = marketingStrategy.opening_days_hours.find((opening) => opening.day === day);

        if (hoursFound) {
          return await this.openingDaysHoursRepository.update(hoursFound.id, {
            day,
            closes_at_noon,
            closing_evening,
            closing_morning,
            open_24_hours,
            opening_afternoon,
            opening_morning,
          });
        }
      }

      if (open_24_hours) {
        this.hoursMarketingStrategy = this.openingDaysHoursRepository.create({
          day,
          open_24_hours,
          marketing_strategy: marketingStrategy,
        });
      }

      if (closes_at_noon) {
        this.hoursMarketingStrategy = this.openingDaysHoursRepository.create({
          day,
          closes_at_noon,
          open_24_hours,
          opening_morning,
          closing_evening,
          opening_afternoon,
          closing_morning,
          marketing_strategy: marketingStrategy,
        });
      } else {
        this.hoursMarketingStrategy = this.openingDaysHoursRepository.create({
          day,
          closes_at_noon,
          open_24_hours,
          opening_morning,
          closing_evening,
          marketing_strategy: marketingStrategy,
        });
      }

      return await this.openingDaysHoursRepository.save(this.hoursMarketingStrategy);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteOpeningDaysHours(idMarketingStrategyHours: number, idUser: number) {
    try {
      return await this.openingDaysHoursRepository.delete({ id: idMarketingStrategyHours });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
