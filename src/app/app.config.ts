
import { InjectionToken } from '@angular/core';
export const APP_CONFIG = new InjectionToken('app.config');
export const AppConfig = {
    PASSWORD_MIN_LENGTH: 5,
    PASSWORD_MAX_LENGTH: 15,
    USER_SESSION_KEY: 'user',
};
