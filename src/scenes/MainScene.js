import Phaser from "phaser";
import { createPlayer, PlayerCannonSystem } from "../game/Player";
import World from "../engine/core/World";
import { GraphicsRenderSystem } from "../engine/systems/GraphicsRenderSystem";
import { WeaponSystem } from "../game/Weapon";
import MovementSystem from "../engine/systems/MovementSystem";
import { EnemySpawnerSystem } from "../game/Enemy";

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
    this.world.addSystem(new EnemySpawnerSystem(this, 3000));
  }

  create() {
    createPlayer(this, this.world);

    this.input.on('pointerdown', () => {
      this.weaponSystem.startShooting();
    });
    this.input.on('pointerup', () => {
      this.weaponSystem.stopShooting();
    });
  }

  update(time, delta) {
    this.world.update(time, delta);

    //const entities = this.world.getAllEntities();
    //console.log(entities);
    //console.log(entities.length);
    //this.enemySpawner.update(time);
  }
}

export default MainScene;