import Phaser from "phaser";
import Enemy from "./Enemy";

export default class EnemySpawner {
  constructor(scene, targetX, targetY) {
    this.scene = scene;
    this.targetX = targetX;
    this.targetY = targetY;

    this.enemies = [];

    this.scene.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

  update(time) {
    this.enemies.forEach((enemy) => enemy.update());
  }

  spawnEnemy() {
    const { width, height } = this.scene.scale;

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

    const enemy = new Enemy(this.scene, x, y, this.targetX, this.targetY, 40);
    this.enemies.push(enemy);
  }
}