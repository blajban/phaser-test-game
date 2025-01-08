export default class EntityStore {
  #entities

  constructor() {
    this.#entities = new Set();
    this.currentId = 0;
  }

  #nextId() {
    return this.currentId += 1;
  }

  newEntity() {
    const newEntity = this.#nextId();
    this.#entities.add(newEntity);
    return newEntity;
  }

  entityIsValid(entity) {
    return this.#entities.has(entity);
  }

  removeEntity(entity) {
    if(!this.entityIsValid(entity)) {
      throw new Error(`Entity ${entity} does not exist`);
    }
    return this.#entities.delete(entity);
  }

  getAllEntities() {
    return Array.from(this.#entities); // Return copy to prevent user changing the internal set
  }
}