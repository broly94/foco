import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { MunicipalitiesEntity } from '@app/locations/entities/municipalities.entity';
import { BaseEntity } from '@app/config/base.entity';

enum Countries {
  ARGENTINA = 'Argentina',
}

@Entity('provinces')
@Unique(['province_id'])
export class ProvincesEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  province_id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ nullable: true, type: 'enum', enum: Countries, default: Countries.ARGENTINA })
  country: Countries;

  @OneToMany(() => MunicipalitiesEntity, (municipality) => municipality.province)
  municipalities: MunicipalitiesEntity[];
}
