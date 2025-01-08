import Phaser from "phaser";

export default class Enemy {
  constructor(scene, x, y, targetX, targetY, speed) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.sprite = this.scene.add.circle(x, y, 10, 0x00ff00);

    this.targetX = targetX;
    this.targetY = targetY;
    
    const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
    this.velocityX = Math.cos(angle) * speed;
    this.velocityY = Math.sin(angle) * speed;
  }

  update(time) {
    // Move the enemy toward the player
    this.sprite.x += this.velocityX * (1 / 60);
    this.sprite.y += this.velocityY * (1 / 60);

    // Check if the enemy is near the target (player)
    if (
      Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        this.targetX,
        this.targetY
      ) < 20 // distance from player center
    ) {
      this.sprite.destroy();
    }
  }
}