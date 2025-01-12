import Phaser from "phaser";
import { createPlayer, PlayerCannonSystem } from "../game/Player";
import World from "../engine/core/World";
import { GraphicsRenderSystem } from "../engine/systems/GraphicsRenderSystem";
import { Projectile, WeaponSystem } from "../game/Weapon";
import MovementSystem from "../engine/systems/MovementSystem";
import { Enemy, EnemySpawnerSystem } from "../game/Enemy";
import { CollisionSystem } from "../engine/systems/CollisionSystem";
import { BoxCollider, CircleCollider, Collider, Velocity } from "../engine/components/Components";
import EventEmitter from "../engine/core/EventEmitter";

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

    this.eventEmitter = new EventEmitter();

    this.world.addSystem(new CollisionSystem(this.eventEmitter));

    this.world.registerComponent(new BoxCollider(0, 0));
    this.world.registerComponent(new CircleCollider(0));
    this.world.registerComponent(new Velocity(0, 0));
    this.world.registerComponent(new Projectile());
    this.world.registerComponent(new Enemy());
  }

  create() {
    createPlayer(this, this.world);
    
    this.input.on('pointerdown', () => {
      this.weaponSystem.startShooting();
    });
    this.input.on('pointerup', () => {
      this.weaponSystem.stopShooting();
    });

    this.eventEmitter.on('collision', ({ entityA, entityB }) => {
      const isProjectileA = this.world.getComponent(entityA, 'Projectile') !== null;
      const isProjectileB = this.world.getComponent(entityB, 'Projectile') !== null;
      const isEnemyA = this.world.getComponent(entityA, 'Enemy') !== null;
      const isEnemyB = this.world.getComponent(entityB, 'Enemy') !== null;
      const isPlayerA = this.world.getComponent(entityA, 'Player') !== null;
      const isPlayerB = this.world.getComponent(entityB, 'Player') !== null;
      const isPlayerCannonA = this.world.getComponent(entityA, 'PlayerCannon') !== null;
      const isPlayerCannonB = this.world.getComponent(entityB, 'PlayerCannon') !== null;

      if (isProjectileA && isEnemyB) {
        this.world.removeEntity(entityA);
        this.world.removeEntity(entityB);
      } else if (isProjectileB && isEnemyA) {
        this.world.removeEntity(entityB);
        this.world.removeEntity(entityA);
      }

      if (isPlayerA && isEnemyB) {
        this.world.removeEntity(entityB);
      } else if (isEnemyA && isPlayerB) {
        this.world.removeEntity(entityA);
      }

      if (isPlayerCannonA && isEnemyB) {
        this.world.removeEntity(entityB);
      } else if (isEnemyA && isPlayerCannonB) {
        this.world.removeEntity(entityA);
      }
    });
  }

  update(time, delta) {
    this.world.update(time, delta);
    this.eventEmitter.processEvents();

    //const entities = this.world.getAllEntities();
    //console.log(entities);
    //console.log(entities.length);
    //this.enemySpawner.update(time);
  }
}

export default MainScene;