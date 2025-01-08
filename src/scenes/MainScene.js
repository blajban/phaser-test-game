import Phaser from "phaser";
import Player from "../game/Player";
import EnemySpawner from "../game/EnemySpawner";

import EntityStore from "../engine/EntityStore";
import ComponentStore from "../engine/ComponentStore";

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    const store = new ComponentStore();

    // Adding components
    const player = 1;
    store.addComponent(player, 'Position', { x: 100, y: 200 });
    store.addComponent(player, 'Health', { hp: 100 });

    const enemy = 2;
    store.addComponent(enemy, 'Position', { x: 300, y: 400 });
    store.addComponent(enemy, 'Health', { hp: 50 });

    // Querying components
    console.log(store.getComponent(player, 'Position')); // { x: 100, y: 200 }

    // Querying entities with a single component type
    console.log(store.getEntitiesWithComponent('Position')); // [1, 2]

    // Querying entities with multiple component types (archetypes)
    console.log(store.getEntitiesWithComponentArchetype('Position', 'Health')); // [1, 2]

    // Removing components
    store.removeComponent(player, 'Health');
    console.log(store.getAllComponentsForEntity(player)); // { Position: { x: 100, y: 200 } }

  }

  create() {
    const { width, height } = this.scale;
    this.player = new Player(this, width / 2, height / 2);
    
    this.enemySpawner = new EnemySpawner(this, this.player.x, this.player.y);
  }

  update(time, delta) {
    this.player.update(time);
    this.enemySpawner.update(time);
  }
}

export default MainScene;