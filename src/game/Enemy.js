import Phaser from "phaser";
import { CircleCollider, CircleShape, Component, ComponentTypes, Particle, Transform, Velocity } from "../engine/components/Components";
import System from "../engine/systems/System";
import { validateNumbers } from "../engine/utilities/validation";
import { CustomComponentTypes } from "../scenes/MainScene";

export class Enemy extends Component {
  constructor(hp, dmg) {
    super(CustomComponentTypes.ENEMY);
    validateNumbers(hp, dmg);
    this.hp = hp;
    this.dmg = dmg;
  }
}

export function createEnemy(world, x, y, targetX, targetY, radius, color, speed, hp, dmg) {
  const enemy = world.createEntity();
  world.addComponent(enemy, new Transform(x, y));
  world.addComponent(enemy, new CircleShape(radius, color));
  world.addComponent(enemy, new CircleCollider(radius));
  const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  world.addComponent(enemy, new Velocity(vx, vy));
  world.addComponent(enemy, new Enemy(hp, dmg));
  world.addComponent(enemy, new Particle('particle', 6000, {
    speed: { min: -100, max: 100 },
    scale: { start: 0.3, end: 0.2 },
    lifespan: 700,
    quantity: 30,
    blendMode: 'ADD',
    emitting: false
  }));
}

function spawnEnemy(world, scene) {
  const { width, height } = scene.scale;

  const side = Phaser.Math.Between(0, 3); // 0 = top, 1 = right, 2 = bottom, 3 = left
  let x, y;

  switch (side) {
    case 0:
      x = Phaser.Math.Between(0, width);
      y = -10;
      break;
    case 1:
      x = width + 10;
      y = Phaser.Math.Between(0, height);
      break;
    case 2:
      x = Phaser.Math.Between(0, width);
      y = height + 10;
      break;
    case 3:
      x = -10;
      y = Phaser.Math.Between(0, height);
      break;
  }

  const player = world.getEntitiesWithComponent('Player')[0];
  const playerTransform = world.getComponent(player, ComponentTypes.TRANSFORM);

  createEnemy(world, x, y, playerTransform.x, playerTransform.y, 10, 0x00ffff, 10, 10, 2);
}

export class EnemySpawnerSystem extends System {
  constructor(scene, spawnDelay) {
    super();
    this.scene = scene;

    this.spawnDelay = spawnDelay;
    this.lastSpawnTime = 0;
  }

  update(world, time, delta) {
    if (time > this.lastSpawnTime + this.spawnDelay) {
      spawnEnemy(world, this.scene);
      this.lastSpawnTime = time;
    }
  }
}



