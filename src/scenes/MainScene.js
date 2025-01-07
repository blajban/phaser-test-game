import Phaser from "phaser";
import Player from "../classes/Player";
import Enemy from "../classes/Enemy";

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {}

  create() {
    const { width, height } = this.scale;
    this.player = new Player(this, width / 2, height / 2);
    
    this.enemies = [];

    this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

  update(time, delta) {
    this.player.update(time);
    this.enemies.forEach((enemy) => enemy.update());
  }

  spawnEnemy() {
    const { width, height } = this.scale;

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

    const enemy = new Enemy(this, x, y, this.player.x, this.player.y, 40);
    this.enemies.push(enemy);
  }
}

export default MainScene;