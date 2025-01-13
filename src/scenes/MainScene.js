import Phaser from "phaser";
import { createPlayer, PlayerCannonSystem } from "../game/Player";
import World from "../engine/core/World";
import { GraphicsRenderSystem } from "../engine/systems/GraphicsRenderSystem";
import { Projectile, WeaponSystem } from "../game/Weapon";
import MovementSystem from "../engine/systems/MovementSystem";
import { Enemy, EnemySpawnerSystem } from "../game/Enemy";
import { CollisionSystem } from "../engine/systems/CollisionSystem";
import { BoxCollider, CircleCollider, Collider, ComponentTypes, Particle, Text, Transform, Velocity } from "../engine/components/Components";
import EventEmitter from "../engine/core/EventEmitter";
import TextRenderSystem from "../engine/systems/TextRenderSystem";
import { createScoreText, ScoreSystem } from "../game/UI";
import { ParticleSystem } from "../engine/systems/ParticleSystem";
import { handleCollisions } from "../game/HandleCollisions";

export const CustomComponentTypes = {
  PROJECTILE: 'Projectile',
  ENEMY: 'Enemy',
  PLAYER: 'Player',
  PLAYER_CANNON: 'PlayerCannon',
  SCORE: 'Score',
  SCORE_TEXT: 'ScoreText'
};

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.world = new World();
    this.world.addSystem(new GraphicsRenderSystem(this));
    this.world.addSystem(new TextRenderSystem(this));
    this.world.addSystem(new PlayerCannonSystem(this));
    this.world.addSystem(new MovementSystem(this));
    this.weaponSystem = new WeaponSystem(this, 100, 6, 0x00ff00, 40);
    this.world.addSystem(this.weaponSystem);
    this.world.addSystem(new EnemySpawnerSystem(this, 3000));
    this.world.addSystem(new ScoreSystem(this));

    this.eventEmitter = new EventEmitter();

    this.world.addSystem(new CollisionSystem(this.eventEmitter));
    this.world.addSystem(new ParticleSystem(this, this.eventEmitter));

    this.world.registerComponent(new BoxCollider(0, 0));
    this.world.registerComponent(new CircleCollider(0));
    this.world.registerComponent(new Velocity(0, 0));
    this.world.registerComponent(new Projectile(0));
    this.world.registerComponent(new Enemy(0, 0));
    this.world.registerComponent(new Text('Registering'));
    this.world.registerComponent(new Particle('texture', 0, {}));

    // Temporary phaser.. 
    this.load.image('particle', 'assets/red.png');

  }

  create() {
    createPlayer(this, this.world);
    createScoreText(this.world);
    
    this.input.on('pointerdown', () => {
      this.weaponSystem.startShooting();
    });
    this.input.on('pointerup', () => {
      this.weaponSystem.stopShooting();
    });

    this.eventEmitter.on('collision', ({ entityA, entityB }) => {
      handleCollisions(this.world, entityA, entityB);
    });

    this.eventEmitter.on('particlesExploded', ({ entity }) => {
      this.world.removeEntity(entity);
    });
  }

  update(time, delta) {
    this.world.update(time, delta);
    this.eventEmitter.processEvents();
  }
}

export default MainScene;