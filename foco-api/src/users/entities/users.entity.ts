import { UserType } from '@app/interfaces';
import { BaseEntity } from '@app/config/base.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { AddressUserEntity } from '@app/address_users/entities/address_user.entity';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';
import { RatingsMarketingEntity } from '@app/ratings_marketing/entities/ratings_marketing.entity';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  token_access_google: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserType,
    default: UserType.CONSUMER,
  })
  userType: UserType;

  @Column({ nullable: false, default: 1 })
  numberOfStrategy: number;

  @Column({ nullable: true, default: null })
  tokenForgotPassword: string;

  @Column({ nullable: true, default: null })
  tokenActiveAccount: string;

  @Column({ nullable: true, default: false })
  active: boolean;

  @OneToOne(() => AddressUserEntity, (address_user) => address_user.user, { cascade: true })
  address_user: AddressUserEntity;

  @OneToMany(() => RatingsMarketingEntity, (ratings) => ratings.user, { cascade: true })
  ratings_marketing: RatingsMarketingEntity[];

  @OneToOne(() => MarketingStrategyEntity, (marketing_strategy) => marketing_strategy.user, { cascade: true })
  marketing_strategy: MarketingStrategyEntity;

  @OneToMany(() => RatingsMarketingEntity, (ratings) => ratings.user)
  ratings: RatingsMarketingEntity[];
}
