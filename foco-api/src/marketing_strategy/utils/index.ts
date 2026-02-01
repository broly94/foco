import { SocialMedia } from '@app/marketing_strategy/interfaces';

export function transformObject(obj: SocialMedia) {
  const transformed: SocialMedia = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Convierte el valor a minúsculas y asigna al nuevo objeto
      transformed[key] = obj[key].toLowerCase();
    }
  }

  return transformed;
}
