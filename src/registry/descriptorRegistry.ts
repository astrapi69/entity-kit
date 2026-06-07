import type { EntityDescriptor } from "../types";

/**
 * A simple Map-based registry of entity descriptors keyed by `entityName`.
 * Apps register all their descriptors at startup and retrieve them by name,
 * decoupling the code that renders an entity from the code that defines it.
 */
export class DescriptorRegistry {
  // Descriptors are stored type-erased; callers re-apply the concrete type on
  // retrieval via the generic `get<T>()`. `unknown` keeps it type-safe at the
  // boundary without resorting to `any`.
  private readonly descriptors = new Map<string, EntityDescriptor<unknown>>();

  /**
   * Register a descriptor under its `entityName`. Re-registering the same name
   * overwrites the previous descriptor.
   */
  register<T>(descriptor: EntityDescriptor<T>): void {
    this.descriptors.set(
      descriptor.entityName,
      descriptor as EntityDescriptor<unknown>,
    );
  }

  /**
   * Retrieve a descriptor by `entityName`, or `undefined` if none is
   * registered. The caller asserts the concrete type via the `T` parameter.
   */
  get<T>(entityName: string): EntityDescriptor<T> | undefined {
    return this.descriptors.get(entityName) as
      | EntityDescriptor<T>
      | undefined;
  }

  /** Whether a descriptor is registered under the given name. */
  has(entityName: string): boolean {
    return this.descriptors.has(entityName);
  }

  /** All registered descriptors, in insertion order. */
  list(): EntityDescriptor<unknown>[] {
    return Array.from(this.descriptors.values());
  }

  /** Remove a descriptor. Returns true if one was removed. */
  unregister(entityName: string): boolean {
    return this.descriptors.delete(entityName);
  }

  /** Remove all registered descriptors. */
  clear(): void {
    this.descriptors.clear();
  }
}

/**
 * A shared default registry instance for apps that only need one. Apps wanting
 * isolation (e.g. tests, micro-frontends) can construct their own
 * {@link DescriptorRegistry}.
 */
export const descriptorRegistry = new DescriptorRegistry();
