
import System from "../engine/systems/System";
import { Component, Transform, CircleShape, RectShape, ComponentTypes, CircleCollider, BoxCollider } from "../engine/components/Components";
import { CustomComponentTypes } from "../scenes/MainScene";
import { validateNumbers } from "../engine/utilities/validation";


export class Player extends Component {
  constructor(hp) {
    super(CustomComponentTypes.PLAYER);
    validateNumbers(hp);
    this.hp = hp;
  }
}

export class PlayerCannon extends Component {
  constructor() {
    super(CustomComponentTypes.PLAYER_CANNON);
  }
}

export class Score extends Component {
  constructor(score = 0) {
    super(CustomComponentTypes.SCORE);
    validateNumbers(score);
    this.score = 0;
  }
}

export function createPlayer(scene, world) {
  const { width, height } = scene.scale;
  const playerCircle = world.createEntity();
  const radius = 20;
  world.addComponent(playerCircle, new Transform(width / 2, height / 2, 0, 1));
  world.addComponent(playerCircle, new CircleShape(radius, 0xff0000));
  world.addComponent(playerCircle, new CircleCollider(radius));
  world.addComponent(playerCircle, new Score());
  world.addComponent(playerCircle, new Player(5));

  const cannon = world.createEntity();
  world.addComponent(cannon, new Transform(width / 2, height / 2, 0, 1, -1, 0));
  world.addComponent(cannon, new RectShape(30, 10, 0xff0000));
  world.addComponent(cannon, new PlayerCannon());
}


export class PlayerCannonSystem extends System {
  constructor(scene) {
    super();
    this.scene = scene;
  }

  update(world) {
    try {
      const pointer = this.scene.input.activePointer;
    const cannon = world.getEntitiesWithComponent('PlayerCannon')[0];

    const cannonTransform = world.getComponent(cannon, ComponentTypes.TRANSFORM);
    const angle = Phaser.Math.Angle.Between(cannonTransform.x, cannonTransform.y, pointer.x, pointer.y);

    cannonTransform.rotation = angle;
    } catch (error) {
      
    }
  }
}
