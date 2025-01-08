class ComponentMap {
  #components
  #componentType

  constructor(componentType) {
    this.#components = new Map();
    this.#componentType = componentType;
  }

  add(entity, component) {
    if (this.has(entity)) {
      throw new Error(`Could not add component to entity ${entity} - entity already has component`);
    }
    this.#components.set(entity, component);
  }

  has(entity) {
    return this.#components.has(entity);
  }

  get(entity) {
    if (!this.has(entity)) {
      throw new Error(`Could not find component of type ${this.#componentType} for entity ${entity}`);

    }
    return this.#components.get(entity);
  }

  delete(entity) {
    if (!this.has(entity)) {
      throw new Error(`Could not find component of type ${this.#componentType} for entity ${entity}`);
    }
    this.#components.delete(entity);
  }

  empty() {
    return this.#components.size === 0;
  }

  getEntitiesWithComponent() {
    return Array.from(this.#components.keys());
  }
}

export default class ComponentStore {
  #componentTypes
  constructor() {
    this.#componentTypes = new Map();
  }

  addComponent(entity, componentType, component) {
    if (!this.#componentTypes.has(componentType)) {
      this.#componentTypes.set(componentType, new ComponentMap(componentType));
    }

    const componentMap = this.#componentTypes.get(componentType);
    componentMap.add(entity, component);
  }

  getComponent(entity, componentType) {
    const componentMap = this.#componentTypes.get(componentType);
    if (!componentMap) {
      throw new Error(`Component type ${componentType} does not exist`);
    }
    return componentMap.get(entity);
  }

  removeComponent(entity, componentType) {
    const componentMap = this.#componentTypes.get(componentType);

    if (!componentMap) {
      throw new Error(`Component type ${componentType} does not exist`);
    }

    componentMap.delete(entity);

    if (componentMap.empty()) {
      this.#componentTypes.delete(componentType);
    }
  }

  getEntitiesWithComponent(componentType) {
    const componentMap = this.#componentTypes.get(componentType);
    
    if (!componentMap) {
      throw new Error(`Component type ${componentType} does not exist`);
    }

    return componentMap.getEntitiesWithComponent();
  }

  getAllComponentsForEntity(entity) {
    const components = {};
    for (const [componentType, componentMap] of this.#componentTypes.entries()) {
      if (componentMap.has(entity)) {
        components[componentType] = componentMap.get(entity);
      }
    }
    return components;
  }

  getEntitiesWithComponentArchetype(...componentTypes) {
    const entitySets = componentTypes.map((type) => {
      const componentMap = this.#componentTypes.get(type);
      if (!componentMap) {
        throw new Error(`Component type ${type} does not exist`);
      }
      return new Set(componentMap.getEntitiesWithComponent());
    });
  
    const intersection = entitySets.reduce((acc, set) => {
      if (!acc) return set;
      return new Set([...acc].filter((entity) => set.has(entity)));
    }, null);
  
    return Array.from(intersection || []);
  }
}