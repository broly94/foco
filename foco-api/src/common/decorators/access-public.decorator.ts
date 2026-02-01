import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from '@app/constans/key-decorators';
import { UserType } from '@app/interfaces';

export const AccessPublicDecorator = () => SetMetadata(PUBLIC_KEY, UserType.FREE_PROVIDER);
