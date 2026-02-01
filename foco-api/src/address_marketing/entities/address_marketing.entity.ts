import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';

@Entity('address_marketing')
export class AddressMarketingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: false })
  address_of_user: boolean;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lon: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  town: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  post_code: number;

  @OneToOne(() => MarketingStrategyEntity, (marketing_strategy) => marketing_strategy.address_marketing)
  @JoinColumn()
  marketing_strategy: MarketingStrategyEntity | number;
}
