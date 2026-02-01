import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AccessLoginGuard } from '@app/auth/guards/access-login.guard';
import { AddressUsersService } from '@app/address_users/services/address_users.service';
import { ErrorManager } from '@app/common/utils/error-manager';
import { CreateAddressUserDto } from '@app/address_users/dto/CreateAddressUserDto';
import { UpdateAddressUserDto } from '@app/address_users/dto/UpdateAddressUserDto';
//import { AccessPublicDecorator } from '@app/common/decorators/access-public.decorator';

@ApiTags('Address User')
@Controller('address-users')
@UseGuards(AccessLoginGuard)
export class AddressUsersController {
  constructor(private readonly adressUserService: AddressUsersService) {}

  @Post('create')
  public async createAddressUser(@Body() body: CreateAddressUserDto) {
    return await this.adressUserService.createAddressUser(body);
  }

  @Put('update/:userId')
  public async updateAdressUser(@Body() body: UpdateAddressUserDto, @Param('userId') userId: number) {
    try {
      return await this.adressUserService.updateAddressUser(body, userId);
    } catch (error) {
      throw new ErrorManager.createSignatureError(error.message);
    }
  }

  @Post()
  public async findAdressUserById(@Body('id') id: number) {
    try {
      const adressUser = await this.adressUserService.findAddressUserById(id);
      console.log(adressUser);
      return adressUser;
    } catch (error) {
      throw new ErrorManager.createSignatureError(error.message);
    }
  }
}
