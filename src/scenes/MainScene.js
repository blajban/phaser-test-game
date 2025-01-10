import Phaser from "phaser";
import Player from "../game/Player";
import EnemySpawner from "../game/EnemySpawner";

import { Transform, CircleShape, RectShape, ComponentTypes } from "../engine/components/Components";
import World from "../engine/core/World";
import { GraphicsRenderSystem } from "../engine/systems/GraphicsRenderSystem";

function createPlayer(scene, world) {
  const { width, height } = scene.scale;
  const playerCircle = world.createEntity();
  world.addComponent(playerCircle, new Transform(width / 2, height / 2, 0, 1));
  world.addComponent(playerCircle, new CircleShape(20, 0xff0000));
}

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.world = new World();
    this.world.addSystem(new GraphicsRenderSystem(this));
  }

  create() {
    createPlayer(this, this.world);
    
    const rect = this.world.createEntity();
    this.world.addComponent(rect, new RectShape(20, 40, 0xff0000));
    this.world.addComponent(rect, new Transform(100, 100, 0, 3));

    this.rect2 = this.world.createEntity();
    this.world.addComponent(this.rect2, new RectShape(20, 40, 0xff0000));
    this.world.addComponent(this.rect2, new Transform(100, 100, 0, 3, -1, -1));

    // Old
    const { width, height } = this.scale;
    this.player = new Player(this, width / 2, height / 2);
    this.enemySpawner = new EnemySpawner(this, this.player.x, this.player.y);
  }

  update(time, delta) {
    const transform = this.world.getComponent(this.rect2, ComponentTypes.TRANSFORM);
    transform.rotation += 2 * delta / 1000;

    if (transform.rotation > Math.PI * 2) {
      transform.rotation -= Math.PI * 2;
    }
    
    this.world.update();

    this.player.update(time);
    this.enemySpawner.update(time);

    
  }
}

export default MainScene;