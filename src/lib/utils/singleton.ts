export function lazySingleton<T>(factory: () => T) {
  return new LazySingleton(factory);
}

class LazySingleton<T> {
  private factory: () => T;
  private instance: T | null = null;

  constructor(factory: () => T) {
    this.factory = factory;
  }

  get() {
    if (!this.instance) {
      this.instance = this.factory();
    }
    return this.instance;
  }
}
