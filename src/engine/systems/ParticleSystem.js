import { ComponentTypes } from "../components/Components";
import System from "./System";

export class ParticleSystem extends System {
  constructor(scene, eventEmitter) {
    super();
    this.scene = scene;
    this.eventEmitter = eventEmitter;
    this.emitters = new Map();
  }

  update(world, time, delta) {
    const entities = world.getEntitiesWithComponentArchetype(
      ComponentTypes.PARTICLE,
      ComponentTypes.TRANSFORM
    );

    for (const entity of entities) {
      const particleComponent = world.getComponent(entity, ComponentTypes.PARTICLE);
      const transform = world.getComponent(entity, ComponentTypes.TRANSFORM);

      if (!this.emitters.has(entity)) {
        const emitter = this.scene.add.particles(
          transform.x,
          transform.y,
          particleComponent.texture,
          particleComponent.config
        );
        this.emitters.set(entity, emitter);
      }

      const emitter = this.emitters.get(entity);
      emitter.setPosition(transform.x, transform.y);

      if (particleComponent.active) {
        particleComponent.elapsed += delta;

        if (particleComponent.elapsed === delta) {
          emitter.explode(20);
        }

        if (particleComponent.elapsed >= particleComponent.lifespan) {
          particleComponent.active = false;
          particleComponent.elapsed = 0;
          this.eventEmitter.emit('particlesExploded', { entity });
        }
      }
    }

    for (const [entity, emitter] of this.emitters.entries()) {
      if (!world.entityIsValid(entity)) {
        emitter.stop();
        emitter.destroy();
        this.emitters.delete(entity);
      }
    }
  }
}