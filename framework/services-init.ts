import { Injectable, Injector, Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServicesInit {
  constructor(private injector: Injector) {
  }

  async init<T>(serviceClass: any, ...params: unknown[]): Promise<T> {
    let className = `${serviceClass.name || 'unknown'}`;
    const instance = this.injector.get(serviceClass) as any;

    if (!instance)
      throw new Error(`Service not found: ${className}`);

    const hasInit = typeof instance.init === 'function';

    if (params.length > 0 && !hasInit)
      throw new Error(`Service ${className} has no init method but initialization parameters were provided.`);

    if (hasInit)
      await instance.init(...params);

    return instance as T;
  }
}
