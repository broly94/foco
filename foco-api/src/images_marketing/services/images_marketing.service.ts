import { ErrorManager } from '@app/common/utils/error-manager';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiResponse, v2 } from 'cloudinary';
import { ImagesMarketingEntity } from '@app/images_marketing/entities/images_marketing.entity';
import { Repository } from 'typeorm';
import { FoldersCloudinary, Types } from '@app/images_marketing/interfaces/index';
import { UsersEntity } from '@app/users/entities/users.entity';
import { RequestContextUserService } from '@app/common/providers/request_context_user.service';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';

@Injectable()
export class ImagesMarketingService {
  private totalQuantityImagesGeneral: number = 6;
  private newFileName: string;
  private imagesMarketingStrategy: Array<ImagesMarketingEntity> = [];
  private imagesMarketingStrategyFilterForType: Array<ImagesMarketingEntity> = [];
  private uploadResult: UploadApiResponse;
  private type: Types;
  private strategy: any;
  private userLogged: UsersEntity;

  constructor(
    @InjectRepository(ImagesMarketingEntity)
    private readonly imagesMarketingRepository: Repository<ImagesMarketingEntity>,
    @InjectRepository(MarketingStrategyEntity)
    private readonly marketingStrategyRepository: Repository<MarketingStrategyEntity>,
    private readonly requestContextUserService: RequestContextUserService,
  ) {
    this.userLogged = this.requestContextUserService.getUser();
  }

  async uploadImagesStrategy(file: Express.Multer.File, type: Types) {
    try {
      //Se busca si el usuario logueado tiene una estrategia de marketing
      this.strategy = await this.marketingStrategyRepository.findOne({ where: { user: { id: this.userLogged.id } } });

      if (!this.strategy)
        throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'El usuario no cuenta con estrategia de marketing' });

      //Se guarda en una variable todas las imagenes que tiene una estrategia de marketing
      this.imagesMarketingStrategy = await this.imagesMarketingRepository
        .createQueryBuilder('images_marketing')
        .where('images_marketing.marketing_strategy_id = :marketing_strategy_id', { marketing_strategy_id: this.strategy.id })
        .getMany();

      //Se filtran las imagenes de la estrategia de marketing por el tipo; General, Banner o Profile
      //Esta variable se va a usar en cada metodo de cada tipo para hacer sus validaciones
      this.imagesMarketingStrategyFilterForType = this.imagesMarketingStrategy.filter((strategy) => strategy.type === type);

      //Se crea el nombre de la imagen para posteriormente ser guardada
      this.newFileName = `user_${this.userLogged.id}_f_${Date.now()}_${type}_strategy_${this.strategy.id}`;

      //Aqui dentro hay funciones anidadas adyacentes
      switch (type) {
        case Types.GENERAL:
          await this.uploadImageGeneral(file, type);
          break;

        case Types.PROFILE:
          await this.uploadImageProfile(file, type);
          break;

        case Types.BANNER:
          await this.uploadImageBanner(file, type);
          break;

        default:
          throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Hubo un error al cargar la imagen.' });
      }

      if (!this.uploadResult) throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error al subir la imagen.' });
      return await this.imagesMarketingRepository.save({
        marketing_strategy_id: this.strategy.id,
        url: this.uploadResult.url,
        public_id: this.uploadResult.public_id,
        type: this.type,
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async uploadImageGeneral(file: Express.Multer.File, type: Types) {
    try {
      if (this.imagesMarketingStrategyFilterForType.length >= this.totalQuantityImagesGeneral)
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'El usuario supera la cantidad de imagenes que puede obtener',
        });
      this.uploadResult = await new Promise((resolve, reject) => {
        v2.uploader
          .upload_stream(
            { folder: FoldersCloudinary.IMAGES_MARKETING_GENERAL_STRATEGY, public_id: this.newFileName },
            (error, uploadResult) => {
              if (error) reject(error);
              return resolve(uploadResult);
            },
          )
          .end(file.buffer);
      });
      this.type = type;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async uploadImageProfile(file: Express.Multer.File, type: Types) {
    if (this.imagesMarketingStrategyFilterForType.length >= 1)
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'El usuario supera la cantidad de imagenes que puede obtener',
      });
    this.uploadResult = await new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          {
            folder: FoldersCloudinary.IMAGES_MARKETING_PROFILE_STRATEGY,
            public_id: this.newFileName,
            transformation: [
              {
                width: 100,
                height: 100,
                crop: 'fill',
              },
            ],
          },
          (error, uploadResult) => {
            if (error) reject(error);
            return resolve(uploadResult);
          },
        )
        .end(file.buffer);
    });
    this.type = type;
  }

  public async uploadImageBanner(file: Express.Multer.File, type: Types) {
    console.log(file);
    try {
      if (this.imagesMarketingStrategyFilterForType.length >= 1)
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'El usuario supera la cantidad de imagenes que puede obtener',
        });
      this.uploadResult = await new Promise((resolve, reject) => {
        v2.uploader
          .upload_stream(
            { folder: FoldersCloudinary.IMAGES_MARKETING_BANNER_STRATEGY, public_id: this.newFileName },
            (error, uploadResult) => {
              if (error) reject(error);
              return resolve(uploadResult);
            },
          )
          .end(file.buffer);
      });
      this.type = type;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async deleteImage(imageId: number) {
    try {
      this.strategy = await this.marketingStrategyRepository.findOne({ where: { user: { id: this.userLogged.id } } });

      const image = await this.imagesMarketingRepository
        .createQueryBuilder('images_marketing')
        .where('images_marketing.marketing_strategy_id = :marketing_strategy_id', { marketing_strategy_id: this.strategy.id })
        .where('images_marketing.id = :id', { id: imageId })
        .getOne();

      if (!image) throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'No exista la imagen.' });

      const { result } = await v2.uploader.destroy(image.public_id);

      if (result === 'ok') {
        await this.imagesMarketingRepository.delete({ id: imageId });
      } else {
        throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error al eliminar la imagen.' });
      }
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
