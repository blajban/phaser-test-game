import System from "./System";
import { ComponentTypes } from "../components/Components";

export default class MovementSystem extends System {
  constructor(scene) {
    super();
    this.scene = scene;
  }

  update(world, time, delta) {
    const entities = world.getEntitiesWithComponentArchetype(
      ComponentTypes.VELOCITY,
      ComponentTypes.TRANSFORM
    );

    for (const entity of entities) {
      const transform = world.getComponent(entity, ComponentTypes.TRANSFORM);
      const velocity = world.getComponent(entity, ComponentTypes.VELOCITY);
      transform.x += velocity.vx * (delta / 1000);
      transform.y += velocity.vy * (delta / 1000);
    }
  }
}
