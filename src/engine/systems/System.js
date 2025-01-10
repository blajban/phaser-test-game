export default class System {
  constructor() {}

  update(world, time, delta) {
    throw new Error('Each system needs to implement the update() method.');
  }
}
