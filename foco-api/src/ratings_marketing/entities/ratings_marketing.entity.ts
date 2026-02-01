import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';
import { BaseEntity } from '@app/config/base.entity';
import { UsersEntity } from '@app/users/entities/users.entity';

@Entity('ratings_marketing')
export class RatingsMarketingEntity extends BaseEntity {
  @Column({ nullable: true, default: null })
  starts: number;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => MarketingStrategyEntity, (marketing_strategy) => marketing_strategy.ratings_marketing)
  @JoinColumn({ name: 'marketing_strategy' })
  marketing_strategy: number;

  @ManyToOne(() => UsersEntity, (users) => users.ratings_marketing)
  user: UsersEntity;
}
