export enum ServiceLifetime {
  Singleton = 'Singleton',
  Scoped = 'Scoped',
  Transient = 'Transient'
}

interface ServiceDescriptor {
  factory: () => any;
  lifetime: ServiceLifetime;
  instance?: any;
}

class ServiceRegistry {
  private descriptors = new Map<string, ServiceDescriptor>();

  public register<T>(identifier: string, factory: () => T, lifetime: ServiceLifetime = ServiceLifetime.Singleton): void {
    if (this.descriptors.has(identifier)) {
      console.warn(`[ServiceRegistry] Service ${identifier} is being overwritten.`);
    }
    this.descriptors.set(identifier, { factory, lifetime });
  }

  public registerInstance<T>(identifier: string, instance: T): void {
    this.descriptors.set(identifier, {
      factory: () => instance,
      lifetime: ServiceLifetime.Singleton,
      instance
    });
  }

  public resolve<T>(identifier: string): T {
    const descriptor = this.descriptors.get(identifier);
    
    if (!descriptor) {
      throw new Error(`[ServiceRegistry] Service ${identifier} not found.`);
    }

    if (descriptor.lifetime === ServiceLifetime.Singleton) {
      if (!descriptor.instance) {
        descriptor.instance = descriptor.factory();
      }
      return descriptor.instance as T;
    }

    if (descriptor.lifetime === ServiceLifetime.Transient) {
      return descriptor.factory() as T;
    }

    if (descriptor.lifetime === ServiceLifetime.Scoped) {
      // For now, treat scoped like transient since we don't have a scope container mechanism yet
      return descriptor.factory() as T;
    }

    throw new Error(`[ServiceRegistry] Invalid lifetime for service ${identifier}.`);
  }

  public has(identifier: string): boolean {
    return this.descriptors.has(identifier);
  }
}

export const serviceRegistry = new ServiceRegistry();
