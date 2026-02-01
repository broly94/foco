import { Request, Response } from 'express';
import { Body, Controller, Delete, Param, ParseIntPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OpeningDaysHoursService } from '@app/opening_days_hours/services/opening_days_hours.service';
import { CreateOrUpdateOpeningDaysHoursDto } from '@app/opening_days_hours/dto/CreateOpeningDaysHoursDto';
import { ErrorManager } from '@app/common/utils/error-manager';
import { AccessLoginGuard } from '@app/auth/guards/access-login.guard';
import { RequestWithUser } from '@app/common/interfaces/request-with-user.interface';

@ApiTags('Opening Days Hours')
@Controller('opening-days-hours')
@UseGuards(AccessLoginGuard)
export class OpeningDaysHoursController {
  constructor(private readonly openingDaysHoursService: OpeningDaysHoursService) {}

  @Post('create')
  public async createOrUpdateOpeningDaysHours(@Body() body: CreateOrUpdateOpeningDaysHoursDto, @Req() request: RequestWithUser) {
    try {
      return await this.openingDaysHoursService.createOrUpdateOpeningDaysHours(body, request.idUser);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Delete('delete/:id')
  public async deleteOpeningDaysHours(@Param('id', ParseIntPipe) id: number, @Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const { affected } = await this.openingDaysHoursService.deleteOpeningDaysHours(id, request.idUser);
      if (affected === 0) throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'No se pudo eliminar el horario' });
      if (affected === 1) return response.json({ error: false, message: 'Horario eliminado' });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
