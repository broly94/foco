import { Column, Entity, Geometry, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProvincesEntity } from '@app/locations/entities/provinces.entity';
import { BaseEntity } from '@app/config/base.entity';
import { CabaCommunesEntity } from '@app/locations/entities/caba_communes.entity';

@Entity('municipalities')
export class MunicipalitiesEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  municipality_id: string;

  @Column()
  name: string;

  @Column()
  full_name: string;

  @Column()
  category: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordinates: Geometry;

  @ManyToOne(() => ProvincesEntity, (province) => province.municipalities)
  @JoinColumn({ name: 'province_id', referencedColumnName: 'province_id' })
  province: ProvincesEntity | string;

  @OneToMany(() => CabaCommunesEntity, (commune) => commune.municipality)
  commune: CabaCommunesEntity[];

  @Column({ type: 'boolean', default: false })
  isCommune: boolean;
}
