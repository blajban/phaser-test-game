import Phaser from "phaser";
import World from "../engine/core/World";
import { GraphicsRenderSystem } from "../engine/systems/GraphicsRenderSystem";
import { CollisionSystem } from "../engine/systems/CollisionSystem";
import EventEmitter from "../engine/core/EventEmitter";
import MovementSystem from "../engine/systems/MovementSystem";
import { CircleCollider, CircleShape, ComponentTypes, RectShape, Transform, Velocity, Component } from "../engine/components/Components";
import System from "../engine/systems/System";

// Phaser scene..
class AnotherScene extends Phaser.Scene {
  constructor() {
    super('AnotherScene');
  }

  preload() {
    // Add systems, register components etc
    this.world = new World();
    this.world.addSystem(new GraphicsRenderSystem(this));
    this.eventEmitter = new EventEmitter();
    //this.world.addSystem(new CollisionSystem(this.eventEmitter));

    this.world.registerComponent(new RectShape(0, 0));
    this.world.registerComponent(new CircleCollider(0));
    this.world.registerComponent(new PlayerCircle());

    //this.world.addSystem(new MovementSystem(this));

    //this.world.addSystem(new WallBounceSystem(this));
  }

  create() {
    // Create entities and components
    const { width, height } = this.scale;
    const colors = [0x00ffff, 0xff00ff, 0xffff00];

    for (let i = 0; i < 20; i++) {
      addBouncingCircle(this.world, width, height, colors);
    }

    //this.world.addComponent(1, new PlayerCircle());
    
    
    // Phaser input..
    /* this.input.on('pointerdown', () => {
      const entity = this.world.getEntitiesWithComponent('PlayerCircle')[0];
      const transform = this.world.getComponent(entity, ComponentTypes.TRANSFORM);

      transform.scale += 1;
    }); */

/*     this.eventEmitter.on('collision', ({ entityA, entityB }) => {
      const velocityA = this.world.getComponent(entityA, ComponentTypes.VELOCITY);
      const velocityB = this.world.getComponent(entityB, ComponentTypes.VELOCITY);

      velocityA.vx = -velocityA.vx;
      velocityA.vy = -velocityA.vy;

      velocityB.vx = -velocityB.vx;
      velocityB.vy = -velocityB.vy;
    }); */


  }

  update(time, delta) {
    this.world.update(time, delta);
    this.eventEmitter.processEvents();
  }
}

function addBouncingCircle(world, width, height, colors) {
  const entity = world.createEntity();
  const randX = width * Math.random();
  const randY = height * Math.random();
  
  const colorIndex = Math.floor(Math.random() * 3);

  world.addComponent(entity, new Transform(randX, randY));
  world.addComponent(entity, new CircleShape(20, colors[colorIndex]));

  /* const speed = 40;
  const randTargetX = width * Math.random();
  const randTargetY = height * Math.random();
  const angle = Phaser.Math.Angle.Between(randX, randY, randTargetX, randTargetY);
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  world.addComponent(entity, new Velocity(vx, vy)); */
  
  //world.addComponent(entity, new CircleCollider(20));
}

class WallBounceSystem extends System {
  constructor(scene) {
    super();
    this.scene = scene;
  }

  update(world, time, delta) {
    const entities = world.getEntitiesWithComponentArchetype(
      ComponentTypes.TRANSFORM,
      ComponentTypes.CIRCLE_SHAPE,
      ComponentTypes.VELOCITY
    );

    const { width, height } = this.scene.scale;

    for (const entity of entities) {
      const transform = world.getComponent(entity, ComponentTypes.TRANSFORM);
      const radius = world.getComponent(entity, ComponentTypes.CIRCLE_SHAPE).radius;

      if (transform.x - radius < 0 || transform.x + radius > width) {
        const velocity = world.getComponent(entity, ComponentTypes.VELOCITY);
        velocity.vx = -velocity.vx;
      }

      if (transform.y - radius < 0 || transform.y + radius > height) {
        const velocity = world.getComponent(entity, ComponentTypes.VELOCITY);
        velocity.vy = -velocity.vy;
      }
    }
  }
}

export class PlayerCircle extends Component {
  constructor() {
    super('PlayerCircle');
  }
}

export default AnotherScene;