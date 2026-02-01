import { In, Repository } from 'typeorm';
import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';
import { ErrorManager } from '@app/common/utils/error-manager';
import { CreateMarketingStrategyDto } from '@app/marketing_strategy/dto/create_marketing_strategy.dto';
import { AddressMarketingService } from '@app/address_marketing/services/address_marketing.service';
import { UsersEntity } from '@app/users/entities/users.entity';
import { UserType } from '@app/interfaces';
import { AddressMarketingEntity } from '@app/address_marketing/entities/address_marketing.entity';
import { transformObject } from '@app/marketing_strategy/utils';
import { RequestContextUserService } from '@app/common/providers/request_context_user.service';
import { SubCategories02Entity } from '@app/categories/sub-categories-02/entities/sub-categories-02.entity';
import { CategoriesEntity } from '@app/categories/entities/categories.entity';
import { SubCategories01Entity } from '@app/categories/sub-categories-01/entities/sub-categories-01.entity';
import { KeywordsEntity } from '@app/keywords/entities/keywords.entity';

@Injectable({ scope: Scope.REQUEST })
export class MarketingStrategyService {
  public userLogged: UsersEntity;

  constructor(
    // Repositories
    @InjectRepository(MarketingStrategyEntity)
    private readonly marketingStrategyRepository: Repository<MarketingStrategyEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(SubCategories02Entity)
    private readonly subCategories02Repository: Repository<SubCategories02Entity>,
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>,
    @InjectRepository(SubCategories01Entity)
    private readonly subCategories01Repository: Repository<SubCategories01Entity>,
    @InjectRepository(KeywordsEntity)
    private readonly keywordsRepository: Repository<KeywordsEntity>,
    //Services
    private readonly addressMarketingStrategyService: AddressMarketingService,
    private readonly requestContextUserService: RequestContextUserService,
  ) {
    this.userLogged = this.requestContextUserService.getUser();
  }

  /**
   *
   * @param strategy
   * @param id | El id que viene desde el controlador hace referencia al usuario logueado. Es tomado desde la request, que viene desde el interceptor del loggin
   * @returns strategy
   */
  // La validacion del usuario y de las categorias estan en el middleware
  public async createStrategy(strategy: CreateMarketingStrategyDto): Promise<MarketingStrategyEntity> {
    console.log('Iniciando creación de estrategia...', strategy.title);
    const userToCreate = this.requestContextUserService.getUser();
    console.log('Usuario logueado:', userToCreate?.email);

    if (!userToCreate) {
      throw new ErrorManager({
        type: 'UNAUTHORIZED',
        message: 'No se pudo encontrar el usuario en el contexto de la petición',
      });
    }

    let {
      address_marketing,
      title,
      description,
      category_id,
      sub_category_01_id,
      sub_categories_02_ids,
      keywords,
      keyword_ids,
      phone,
      user_phone,
      website,
      social_media,
    } = strategy;

    // Validación de usuario existente
    const strategyUser = await this.marketingStrategyRepository
      .createQueryBuilder('marketing_strategy')
      .leftJoinAndSelect('marketing_strategy.user', 'user')
      .where('marketing_strategy.user = :id', { id: userToCreate.id })
      .getOne();

    console.log('¿Ya tiene estrategia?', !!strategyUser);

    if (strategyUser) {
      throw new ErrorManager({
        type: 'CONFLICT',
        message: 'El usuario ya tiene un perfil comercial creado',
      });
    }

    // Validar máximo de subcategorías 2
    if (sub_categories_02_ids && sub_categories_02_ids.length > 5) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'El máximo de subcategorías 02 permitidas es 5',
      });
    }

    // Buscar las entidades de categorías
    const category = await this.categoriesRepository.findOne({
      where: { id: category_id },
    });

    if (!category) {
      throw new ErrorManager({
        type: 'NOT_FOUND',
        message: 'Categoría no encontrada',
      });
    }

    const subCategory01 = await this.subCategories01Repository.findOne({
      where: { id: sub_category_01_id },
      relations: ['category'],
    });

    if (!subCategory01) {
      throw new ErrorManager({
        type: 'NOT_FOUND',
        message: 'Subcategoría 1 no encontrada',
      });
    }

    // Validar que la subcategoría 1 pertenezca a la categoría seleccionada
    if (subCategory01.category.id !== category_id) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'La subcategoría 1 no pertenece a la categoría seleccionada',
      });
    }

    // Buscar las subcategorías 2 seleccionadas
    let subCategories02: SubCategories02Entity[] = [];
    if (sub_categories_02_ids && sub_categories_02_ids.length > 0) {
      subCategories02 = await this.subCategories02Repository.find({
        where: { id: In(sub_categories_02_ids) },
        relations: ['sub_categories_01'],
      });

      // Validar que todas las subcategorías 2 existan
      if (subCategories02.length !== sub_categories_02_ids.length) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Algunas subcategorías 2 no existen',
        });
      }

      // Validar que las subcategorías 2 pertenezcan a la subcategoría 1 seleccionada
      const invalidSubCategories = subCategories02.filter((sub2) => sub2.sub_category_01.id !== sub_category_01_id);

      if (invalidSubCategories.length > 0) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Algunas subcategorías 2 no pertenecen a la subcategoría 1 seleccionada',
        });
      }
    }

    // Buscar las entidades de Keywords
    let keywords_list: KeywordsEntity[] = [];
    if (keyword_ids && keyword_ids.length > 0) {
      keywords_list = await this.keywordsRepository.find({
        where: { id: In(keyword_ids) },
      });

      if (keywords_list.length !== keyword_ids.length) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Algunas palabras clave seleccionadas no existen',
        });
      }
    }

    // Buscar usuario con relaciones para tener el teléfono y la dirección si se necesitan
    const user = await this.usersRepository.findOne({
      where: { id: userToCreate.id },
      relations: ['address_user'],
    });

    console.log('Usuario completo cargado:', !!user, 'con dirección:', !!user?.address_user);

    if (!user) {
      throw new ErrorManager({
        type: 'NOT_FOUND',
        message: 'Usuario no encontrado',
      });
    }

    // Validación de teléfono
    if (user_phone) {
      phone = user.phone;
      if (!phone) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No tienes un teléfono registrado en tu perfil. Por favor, ingresa uno comercial.',
        });
      }
    } else {
      // Validar que el teléfono no esté en uso
      if (!phone) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El número de teléfono es requerido',
        });
      }

      const phoneExists = await this.marketingStrategyRepository.findOne({
        where: { phone },
      });

      if (phoneExists) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'El número de teléfono ya está en uso',
        });
      }
    }

    // Creación de la estrategia de marketing
    const createResponseMarketingStrategy = this.marketingStrategyRepository.create({
      user: this.userLogged,
      title,
      description,
      category, // Entidad completa
      sub_category_01: subCategory01, // Entidad completa
      sub_category_02: subCategories02, // Array de entidades
      keywords: keywords?.map((key) => key.toLowerCase()) || [],
      keywords_list: keywords_list, // Relación Many-to-Many
      phone,
      user_phone,
      website: website?.toLowerCase(),
      social_media: transformObject(social_media),
    });

    // Guardar la estrategia
    console.log('Guardando estrategia en repositorio...');
    const responseCreateStrategy = await this.marketingStrategyRepository.save(createResponseMarketingStrategy);
    console.log('Estrategia guardada ID:', responseCreateStrategy.id);

    if (user.userType !== 'ADMIN' && responseCreateStrategy) {
      console.log('Actualizando rol del usuario...');
      await this.usersRepository.update(user.id, {
        userType: UserType.FREE_PROVIDER,
      });
    }

    // Crear dirección de marketing
    console.log('Creando dirección de marketing...');
    await this.CreateaddressMarketingStrategy(
      address_marketing,
      user,
      responseCreateStrategy.id,
      category.name,
      subCategory01.name
    );
    console.log('Dirección creada con éxito');

    return responseCreateStrategy;
  }

  public async CreateaddressMarketingStrategy(
    address_marketing: any,
    user: UsersEntity,
    marketing_strategy_id: number,
    categoryName?: string,
    subCategoryName?: string,
  ) {
    try {
      const digitalKeywords = ['digital', 'freelance', 'software', 'programación', 'web', 'diseño', 'consultoría', 'informática', 'tecnología'];
      const isDigital =
        digitalKeywords.some((k) => categoryName?.toLowerCase().includes(k)) ||
        digitalKeywords.some((k) => subCategoryName?.toLowerCase().includes(k));

      // El país siempre es obligatorio
      if (!address_marketing.country) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El país es obligatorio para todas las estrategias de marketing',
        });
      }

      if (address_marketing.address_of_user === true) {
        if (!user.address_user) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message: 'No tienes una dirección registrada en tu perfil. Por favor, desmarca la opción de usar dirección de perfil e ingresa una manualmente.',
          });
        }
        address_marketing.lat = user.address_user.lat;
        address_marketing.lon = user.address_user.lon;
        address_marketing.state = user.address_user.state;
        address_marketing.address = user.address_user.address;
        address_marketing.country = user.address_user.country;
        address_marketing.post_code = user.address_user.post_code;
      } else {
        // Si no es digital y es dirección nueva, validar campos mínimos
        if (!isDigital) {
          if (!address_marketing.address || !address_marketing.state || !address_marketing.town) {
            throw new ErrorManager({
              type: 'BAD_REQUEST',
              message: 'La dirección, estado/provincia y localidad son obligatorios para este tipo de negocio',
            });
          }
        }
      }

      address_marketing.marketing_strategy = marketing_strategy_id;

      // Limpiar post_code si viene como string vacio desde el front
      if (address_marketing.post_code === '') {
        address_marketing.post_code = null;
      }

      return await this.addressMarketingStrategyService.createAddressMarketingStrategy(address_marketing);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getStrategyByUserId(userId: number) {
    try {
      const strategy = await this.marketingStrategyRepository
        .createQueryBuilder('marketing_strategy')
        .where('marketing_strategy.user = :userId', { userId })
        .leftJoinAndSelect('marketing_strategy.category', 'category')
        .leftJoinAndSelect('marketing_strategy.sub_category_01', 'sub_category_01')
        .leftJoinAndSelect('marketing_strategy.address_marketing', 'address_marketing')
        .getOne();

      return strategy;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getStrategyByEntity(entity: MarketingStrategyEntity) {
    try {
      const strategyByUser = await this.marketingStrategyRepository
        .createQueryBuilder('marketing_strategy')
        .where('marketing_strategy.id = :id', { id: entity })
        .leftJoinAndSelect('marketing_strategy.user', 'user')
        .leftJoinAndSelect('marketing_strategy.category', 'category')
        .leftJoinAndSelect('marketing_strategy.sub_category_01', 'sub_category_01')
        .leftJoinAndSelect('marketing_strategy.sub_category_02', 'sub_category_02')
        .leftJoinAndSelect('marketing_strategy.address_marketing', 'address_marketing')
        .leftJoinAndSelect('marketing_strategy.opening_days_hours', 'opening_days_hours')
        .leftJoinAndSelect('marketing_strategy.ratings_marketing', 'ratings_marketing')
        .select([
          'marketing_strategy.id',
          'marketing_strategy.title',
          'marketing_strategy.description',
          'marketing_strategy.phone',
          'marketing_strategy.keywords',
          'marketing_strategy.website',
          'marketing_strategy.social_media',
          'address_marketing.lat',
          'address_marketing.lon',
          'address_marketing.country',
          'address_marketing.state',
          'address_marketing.town',
          'address_marketing.address',
          'address_marketing.post_code',
          'category.name',
          'sub_category_01.name',
          'sub_category_02.name',
          'user.name',
          'user.lastName',
          'user.email',
          'user.avatar',
          'user.userType',
          'opening_days_hours.day',
          'opening_days_hours.closes_at_noon',
          'opening_days_hours.open_24_hours',
          'opening_days_hours.opening_morning',
          'opening_days_hours.closing_morning',
          'opening_days_hours.closing_evening',
          'ratings_marketing.starts',
          'ratings_marketing.comment',
        ])
        .getOne();
      if (!strategyByUser) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Estrategia de marketing no encontrada',
        });
      }
      return strategyByUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getAllStrategies() {
    try {
      const strategies = await this.marketingStrategyRepository
        .createQueryBuilder('marketing_strategy')
        .leftJoinAndSelect('marketing_strategy.user', 'user')
        .leftJoinAndSelect('marketing_strategy.category', 'category')
        .leftJoinAndSelect('marketing_strategy.sub_category_01', 'sub_category_01')
        .leftJoinAndSelect('marketing_strategy.sub_category_02', 'sub_category_02')
        .leftJoinAndSelect('marketing_strategy.address_marketing', 'address_marketing')
        .leftJoinAndSelect('marketing_strategy.opening_days_hours', 'opening_days_hours')
        .leftJoinAndSelect('marketing_strategy.ratings_marketing', 'ratings_marketing')
        .leftJoinAndSelect('ratings_marketing.user', 'rating_user')
        .select([
          'marketing_strategy.id',
          'marketing_strategy.title',
          'marketing_strategy.description',
          'marketing_strategy.phone',
          'marketing_strategy.keywords',
          'marketing_strategy.website',
          'marketing_strategy.social_media',
          'address_marketing.lat',
          'address_marketing.lon',
          'address_marketing.country',
          'address_marketing.state',
          'address_marketing.town',
          'address_marketing.address',
          'address_marketing.post_code',
          'category.name',
          'sub_category_01.name',
          'sub_category_02.name',
          'user.name',
          'user.lastName',
          'user.email',
          'user.avatar',
          'user.userType',
          'opening_days_hours.day',
          'opening_days_hours.closes_at_noon',
          'opening_days_hours.open_24_hours',
          'opening_days_hours.opening_morning',
          'opening_days_hours.closing_morning',
          'opening_days_hours.closing_evening',
          'ratings_marketing.comment',
          'ratings_marketing.starts',
          'ratings_marketing.comment',
          'rating_user.id',
          'rating_user.name',
          'rating_user.avatar',
          'rating_user.email',
        ])
        .getMany();

      if (!strategies) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Estrategias de marketing no encontradas',
        });
      }

      return strategies;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async searchStrategies(keyword?: string, location?: string): Promise<MarketingStrategyEntity[]> {
    try {
      const queryBuilder = this.marketingStrategyRepository
        .createQueryBuilder('marketing_strategy')
        .leftJoinAndSelect('marketing_strategy.user', 'user')
        .leftJoinAndSelect('marketing_strategy.category', 'category')
        .leftJoinAndSelect('marketing_strategy.sub_category_01', 'sub_category_01')
        .leftJoinAndSelect('marketing_strategy.sub_category_02', 'sub_category_02')
        .leftJoinAndSelect('marketing_strategy.address_marketing', 'address_marketing')
        .leftJoinAndSelect('marketing_strategy.opening_days_hours', 'opening_days_hours')
        .leftJoinAndSelect('marketing_strategy.ratings_marketing', 'ratings_marketing')
        .leftJoinAndSelect('ratings_marketing.user', 'rating_user')
        .select([
          'marketing_strategy.id',
          'marketing_strategy.title',
          'marketing_strategy.description',
          'marketing_strategy.phone',
          'marketing_strategy.keywords',
          'marketing_strategy.website',
          'marketing_strategy.social_media',
          'address_marketing.lat',
          'address_marketing.lon',
          'address_marketing.country',
          'address_marketing.state',
          'address_marketing.town',
          'address_marketing.address',
          'address_marketing.post_code',
          'category.name',
          'sub_category_01.name',
          'sub_category_02.name',
          'user.name',
          'user.lastName',
          'user.email',
          'user.avatar',
          'user.userType',
          'opening_days_hours.day',
          'opening_days_hours.closes_at_noon',
          'opening_days_hours.open_24_hours',
          'opening_days_hours.opening_morning',
          'opening_days_hours.closing_morning',
          'opening_days_hours.closing_evening',
          'ratings_marketing.comment',
          'ratings_marketing.starts',
          'rating_user.id',
          'rating_user.name',
          'rating_user.avatar',
          'rating_user.email',
        ]);

      if (keyword) {
        queryBuilder.andWhere(
          '(marketing_strategy.title ILIKE :keyword OR marketing_strategy.description ILIKE :keyword OR :keywordLow = ANY(marketing_strategy.keywords))',
          {
            keyword: `%${keyword}%`,
            keywordLow: keyword.toLowerCase()
          },
        );
      }

      if (location) {
        queryBuilder.andWhere(
          '(address_marketing.state ILIKE :location OR address_marketing.address ILIKE :location OR address_marketing.town ILIKE :location)',
          { location: `%${location}%` },
        );
      }

      return await queryBuilder.getMany();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getStrategyById(strategyId: number) {
    try {
      const strategyById = await this.marketingStrategyRepository
        .createQueryBuilder('marketing_strategy')
        .where('marketing_strategy.id = :id', { id: strategyId })
        .leftJoinAndSelect('marketing_strategy.user', 'user')
        .leftJoinAndSelect('marketing_strategy.category', 'category')
        .leftJoinAndSelect('marketing_strategy.sub_category_01', 'sub_category_01')
        .leftJoinAndSelect('marketing_strategy.sub_category_02', 'sub_category_02')
        .leftJoinAndSelect('marketing_strategy.address_marketing', 'address_marketing')
        .leftJoinAndSelect('marketing_strategy.opening_days_hours', 'opening_days_hours')
        .leftJoinAndSelect('marketing_strategy.images_marketing', 'images_marketing')
        .leftJoinAndSelect('marketing_strategy.ratings_marketing', 'ratings_marketing')
        .leftJoinAndSelect('ratings_marketing.user', 'rating_user')
        .select([
          'marketing_strategy.id',
          'marketing_strategy.title',
          'marketing_strategy.description',
          'marketing_strategy.phone',
          'marketing_strategy.keywords',
          'marketing_strategy.website',
          'marketing_strategy.social_media',
          'address_marketing.lat',
          'address_marketing.lon',
          'address_marketing.country',
          'address_marketing.state',
          'address_marketing.town',
          'address_marketing.address',
          'address_marketing.post_code',
          'category.name',
          'sub_category_01.name',
          'sub_category_02.name',
          'user.id',
          'user.name',
          'user.lastName',
          'user.email',
          'user.avatar',
          'user.userType',
          'opening_days_hours.day',
          'opening_days_hours.closes_at_noon',
          'opening_days_hours.open_24_hours',
          'opening_days_hours.opening_morning',
          'opening_days_hours.closing_morning',
          'opening_days_hours.closing_evening',
          'images_marketing.id',
          'images_marketing.url',
          'images_marketing.type',
          'ratings_marketing.comment',
          'ratings_marketing.starts',
          'ratings_marketing.comment',
          'rating_user.id',
          'rating_user.name',
          'rating_user.avatar',
          'rating_user.email',
        ])
        .getOne();
      if (!strategyById) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Error, no existe una estrategia de marketing ha la que se hace referencia.',
        });
      }
      return strategyById;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async softDeleteMarketingStrategy() {
    try {
      const marketingStrategyId = await this.marketingStrategyRepository.findOne({ where: { user: { id: this.userLogged.id } } });
      return await this.marketingStrategyRepository.softDelete(marketingStrategyId.id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async restoreSoftDeleteMarketingStrategy() {
    try {
      const id = this.userLogged.id;
      const marketingStrategyId = await this.marketingStrategyRepository
        .createQueryBuilder('marketing_strategy')
        .withDeleted()
        .where('marketing_strategy.user.id = :id', { id })
        .getOne();
      return await this.marketingStrategyRepository.restore(marketingStrategyId.id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
