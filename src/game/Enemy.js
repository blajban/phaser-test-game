import Phaser from "phaser";
import { CircleShape, Component, ComponentTypes, Transform, Velocity } from "../engine/components/Components";
import System from "../engine/systems/System";

export class Enemy extends Component {
  constructor() {
    super('Enemy');
  }
}

export function createEnemy(world, x, y, targetX, targetY, radius, color, speed) {
  const enemy = world.createEntity();
  world.addComponent(enemy, new Transform(x, y));
  world.addComponent(enemy, new CircleShape(radius, color));
  const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  world.addComponent(enemy, new Velocity(vx, vy));
  world.addComponent(enemy, new Enemy());
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

  createEnemy(world, x, y, playerTransform.x, playerTransform.y, 10, 0x00ffff, 10);
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
    

    // Handle collisions
  }
}



