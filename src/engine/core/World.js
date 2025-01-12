import ComponentStore from "./ComponentStore";
import EntityStore from "./EntityStore";
import { cleanupGraphics } from "../utilities/draw";

export default class World {
  constructor() {
    this.entityStore = new EntityStore();
    this.componentStore = new ComponentStore();
    this.systems = [];
  }

  addSystem(system) {
    this.systems.push(system);
  }

  update(time, delta) {
    for (const system of this.systems) {
      this.systems.forEach((system) => system.update(this, time, delta));
    }
  }

  createEntity(components = []) {
    const entity = this.entityStore.newEntity();
    components.forEach((component) => this.componentStore.addComponent(entity, component));
    return entity;
  }


  getAllEntities() {
    return this.entityStore.getAllEntities();
  }

  removeEntity(entity) {
    const components = this.componentStore.getAllComponentsForEntity(entity);
    for (const componentType in components) {
      this.componentStore.removeComponent(entity, componentType);
    }

    this.entityStore.removeEntity(entity);
  }

  entityIsValid(entity) {
    return this.entityStore.entityIsValid(entity);
  }

  registerComponent(component) {
    this.componentStore.registerComponent(component);
  }

  addComponent(entity, component) {
    if (!this.entityStore.entityIsValid(entity)) {
      throw new Error(`Entity ${entity} does not exist`);
    }
    this.componentStore.addComponent(entity, component);
  }

  getComponent(entity, componentType) {
    return this.componentStore.getComponent(entity, componentType);
  }

  removeComponent(entity, componentType) {
    this.componentStore.removeComponent(entity, componentType);
  }

  getEntitiesWithComponent(componentType) {
    return this.componentStore.getEntitiesWithComponent(componentType);
  }

  getEntitiesWithComponentArchetype(...componentTypes) {
    return this.componentStore.getEntitiesWithComponentArchetype(...componentTypes);
  }

  getAllComponentsForEntity(entity) {
    return this.componentStore.getAllComponentsForEntity(entity);
  }
}