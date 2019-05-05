import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('global window');
export const API_BASE_URL = new InjectionToken<string>('api base url');
