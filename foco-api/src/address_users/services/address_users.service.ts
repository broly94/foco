import { Repository } from 'typeorm';
import { Inject, Injectable, forwardRef, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressUserEntity } from '@app/address_users/entities/address_user.entity';
import { ErrorManager } from '@app/common/utils/error-manager';
import { CreateAddressUserDto } from '@app/address_users/dto/CreateAddressUserDto';
import { UpdateAddressUserDto } from '@app/address_users/dto/UpdateAddressUserDto';
import { UsersService } from '@app/users/services/users.service';
import { validateLatLong } from '@app/common/utils/errors-validate';
import { UsersEntity } from '@app/users/entities/users.entity';

@Injectable()
export class AddressUsersService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectRepository(AddressUserEntity)
    private readonly addressUserRepository: Repository<AddressUserEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  public async createAddressUser(body: CreateAddressUserDto) {
    return await this.addressUserRepository.save(body);
  }

  //TODO: Esta funcion es consumida por el servicio de la entidad Users
  public async updateAddressUser(addressUser: UpdateAddressUserDto, userId: number) {
    try {
      const user = await this.usersService.findUserById(userId, true);
      const addressUserUpdate = await this.addressUserRepository.update(user.id, addressUser);
      if (addressUserUpdate.affected) return addressUserUpdate;
    } catch (error) {
      //validateLatLong(error);
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findAddressUserById(id: number): Promise<AddressUserEntity> {
    try {
      return await this.addressUserRepository.findOne({ where: { id } });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  //?: Esta funcion va a ser de uso exclusivo para verificar direcciones
  public async getAllAddressUsers(): Promise<AddressUserEntity[]> {
    try {
      return await this.addressUserRepository.find();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  //TODO: Esta funcion es consumida por el servicio de la entidad Users
  public async deleteAdressUser(userId: number) {
    try {
      const { address_user } = await this.usersService.findUserById(userId, true);
      return await this.addressUserRepository.delete(address_user.id);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
