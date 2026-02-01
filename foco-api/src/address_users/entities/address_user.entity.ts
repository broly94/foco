import { UsersEntity } from '@app/users/entities/users.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('adress_user')
export class AddressUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lon: string;

  @Column({ nullable: true, default: 'Argentina' })
  country: string;

  @Column({ nullable: false })
  state: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: false })
  post_code: number;

  @OneToOne(() => UsersEntity, (users) => users.address_user)
  @JoinColumn()
  user: UsersEntity | number;
}
