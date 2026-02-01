import { SetMetadata } from '@nestjs/common';
import { ADMIN_KEY } from '@app/constans/key-decorators';
import { UserType } from '@app/interfaces';

export const AccessAdminDecorator = () => SetMetadata(ADMIN_KEY, UserType.ADMIN);
