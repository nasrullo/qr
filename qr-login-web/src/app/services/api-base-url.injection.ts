import {InjectionToken} from '@angular/core';

export let API_BASE_URL = new InjectionToken<string>('APIBaseUrl');

export function getBaseApiUrl(): string {
  return (window as { [key: string]: any })["apiUrl"];
}

export let WS_BASE_URL = new InjectionToken<string>('WSBaseUrl');

export function getBaseWsUrl(): string {
  return (window as { [key: string]: any })["wsUrl"];
}
