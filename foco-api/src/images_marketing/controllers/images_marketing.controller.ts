import { ErrorManager } from '@app/common/utils/error-manager';
import { Controller, Delete, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Express, Request, Response } from 'express';
import { ImagesMarketingService } from '@app/images_marketing/services/images_marketing.service';
import { AccessPremiumDecorator } from '@app/common/decorators/access-premium.decorator';
import { AccessLoginGuard } from '@app/auth/guards/access-login.guard';
import { extname } from 'path';
import { Types } from '@app/images_marketing/interfaces';

@ApiTags('Images Marketing')
@Controller('images-marketing')
@UseGuards(AccessLoginGuard)
export class ImagesMarketingController {
  constructor(private readonly imageMarketingService: ImagesMarketingService) {}

  @AccessPremiumDecorator()
  @Post('upload-images-general-strategy/:folder')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        //TODO: Tamaño maximo: 1MB
        fileSize: 1024 * 1024,
      },
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.includes('image')) {
          cb(new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error, el archivo no tiene el formato correcto' }), false);
        }
        //TODO: Filetrar imagen para que tenga una extencion de imagen
        if (['.jpg', '.jpeg', '.png'].includes(extname(file.originalname).toLocaleLowerCase())) {
          cb(null, true);
        } else {
          cb(new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error al cargar la imagen.' }), false);
        }
      },
    }),
  )
  //TODO: El frontend tiene que tener la interfaz de flodersCloudinary para poder pasarle la carpeta donde se va a guardar la imagen
  public async uploadImagesStrategy(@UploadedFile() file: Express.Multer.File, @Param('folder') folder: Types, @Res() res: Response) {
    try {
      if (file == undefined)
        throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error, ningun archivo seleccionado para subir' });
      const imageMarketingResponse = await this.imageMarketingService.uploadImagesStrategy(file, folder);
      console.log(imageMarketingResponse);
      if (!imageMarketingResponse) throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error, no se pudo subir la imagen.' });
      return res.json({
        error: false,
        message: 'Imagen cargada con exito.',
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @AccessPremiumDecorator()
  @Delete('delete-image-strategy/:imageId')
  public async deleteImage(@Param('imageId') imageId: number, @Res() res: Response) {
    try {
      await this.imageMarketingService.deleteImage(imageId);
      return res.json({
        message: 'Imagen eliminada.',
        error: false,
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
