import { ErrorManager } from './error-manager';

export const validateLatLong = (error: any) => {
  if (error.detail != undefined) {
    if (error.detail.includes('already exists')) {
      if (error.detail.includes('lat')) {
        throw ErrorManager.createSignatureError('La latitud ya existe');
      }
      if (error.detail.includes('lon')) {
        throw new ErrorManager.createSignatureError('La longitud ya existe');
      }
    }
  }
};

export const validateCategories = (error: any) => {
  if (error.detail != undefined) {
    if (error.detail.includes('already exists')) {
      if (error.detail.includes('category')) {
        throw new ErrorManager.createSignatureError('La categoria ya existe');
      }
    }
  }
};
