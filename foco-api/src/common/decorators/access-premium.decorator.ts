import { SetMetadata } from '@nestjs/common';
import { PREMIUM_KEY } from '@app/constans/key-decorators';
import { UserType } from '@app/interfaces';

export const AccessPremiumDecorator = () => SetMetadata(PREMIUM_KEY, UserType.PREMIUM_PROVIDER);
