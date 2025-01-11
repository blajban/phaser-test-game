import Phaser from "phaser";
import { createPlayer, PlayerCannonSystem } from "../game/Player";
import EnemySpawner from "../game/EnemySpawner";
import { ComponentTypes } from "../engine/components/Components";
import World from "../engine/core/World";
import { GraphicsRenderSystem } from "../engine/systems/GraphicsRenderSystem";
import { fireProjectile, WeaponSystem } from "../game/Weapon";
import MovementSystem from "../engine/systems/MovementSystem";

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.world = new World();
    this.world.addSystem(new GraphicsRenderSystem(this));
    this.world.addSystem(new PlayerCannonSystem(this));
    this.world.addSystem(new MovementSystem(this));
    this.weaponSystem = new WeaponSystem(this, 100, 6, 0x00ff00, 40);
    this.world.addSystem(this.weaponSystem);
  }

  create() {
    createPlayer(this, this.world);

    this.input.on('pointerdown', () => {
      this.weaponSystem.startShooting();
    });
    this.input.on('pointerup', () => {
      this.weaponSystem.stopShooting();
    });

    // Old
    //this.enemySpawner = new EnemySpawner(this, 300, 400);
  }

  update(time, delta) {
    this.world.update(time, delta);

    //const entities = this.world.getAllEntities();
    //console.log(entities);
    //this.enemySpawner.update(time);
  }
}

export default MainScene;