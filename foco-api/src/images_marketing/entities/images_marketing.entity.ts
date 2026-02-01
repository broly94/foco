import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';
import { Types } from '@app/images_marketing/interfaces';

@Entity('images_marketing')
export class ImagesMarketingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  public_id: string;

  @Column({ nullable: false })
  type: Types;

  @ManyToOne(() => MarketingStrategyEntity, (marketing_strategy) => marketing_strategy.images_marketing)
  @JoinColumn({ name: 'marketing_strategy_id' })
  marketing_strategy_id: MarketingStrategyEntity;
}
