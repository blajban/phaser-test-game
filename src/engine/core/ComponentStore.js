import { checkValidNumbers, validateNumbers } from "../utilities/validation";

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
      return null;

    }
    return this.#components.get(entity);
  }

  delete(entity) {
    if (!this.has(entity)) {
      throw new Error(`Could not delete component of type ${this.#componentType} for entity ${entity}`);
    }
    this.#components.delete(entity);
  }

  empty() {
    return this.#components.size === 0;
  }

  hasComponentType(componentType) {
    return this.#componentType === componentType;
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

  registerComponent(component) {
    if (!this.#componentTypes.has(component.type)) {
      console.log(component.type);
      this.#componentTypes.set(component.type, new ComponentMap(component.type));
    }
  }

  addComponent(entity, component) {
    this.registerComponent(component);

    const componentMap = this.#componentTypes.get(component.type);
    componentMap.add(entity, component);
  }

  getComponent(entity, componentType) {
    validateNumbers(entity);
    const componentMap = this.#componentTypes.get(componentType);
    if (!componentMap) {
      throw new Error(`Component type ${componentType} does not exist (get component)`);
    }
    return componentMap.get(entity);
  }

  removeComponent(entity, componentType) {
    const componentMap = this.#componentTypes.get(componentType);

    if (!componentMap) {
      throw new Error(`Component type ${componentType} does not exist (remove component)`);
    }

    componentMap.delete(entity);
  }

  getEntitiesWithComponent(componentType) {
    const componentMap = this.#componentTypes.get(componentType);
  
    if (!componentMap) {
      throw new Error(`Component type ${componentType} does not exist (get entities with component)`);
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
        throw new Error(`Component type ${type} does not exist (get entities with archetype)`);
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