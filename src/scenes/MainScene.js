import Phaser from "phaser";

class Weapon {
  constructor(scene, shootDelay) {
    this.scene = scene;
    this.isShooting = false;
    this.shootDelay = shootDelay;
    this.lastShotTime = 0;
    this.projectiles = this.scene.add.group();
  }

  startShooting() {
    this.isShooting = true;
  }

  stopShooting() {
    this.isShooting = false;
  }

  fireProjectile(playerX, playerY, angle, cannonLength)  {
    throw new Error('fireProjectile() not implemented in inherited Weapon class');
  }

  update(time, playerX, playerY, angle, cannonLength) {
    if (this.isShooting && time > this.lastShotTime + this.shootDelay) {
      this.fireProjectile(playerX, playerY, angle, cannonLength);
      this.lastShotTime = time;
    }

    // Update projectiles
    this.projectiles.children.iterate((projectile) => {
      if (!projectile || !projectile.active) return;

      projectile.x += Math.cos(projectile.angle) * projectile.speed;
      projectile.y += Math.sin(projectile.angle) * projectile.speed;

      // Remove projectiles that go off-screen
      if (
        projectile.x < 0 || projectile.x > this.scene.scale.width ||
        projectile.y < 0 || projectile.y > this.scene.scale.height
      ) {
        this.projectiles.remove(projectile, true, true);
      }
    });
  }
}

class BasicWeapon extends Weapon {
  constructor(scene) {
    super(scene, 100);
  }

  fireProjectile(playerX, playerY, angle, cannonLength) {
    const projectile = this.scene.add.circle(
      playerX + Math.cos(angle) * cannonLength,
      playerY + Math.sin(angle) * cannonLength,
      5, //radius
      0xffff00
    );

    projectile.angle = angle;
    projectile.speed = 3;

    this.projectiles.add(projectile);
  }
}

class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.cannonLength = 40;
    this.cannonWidth = 10;

    this.weapon = new BasicWeapon(this.scene);

    this.circle = this.scene.add.graphics();
    this.cannon = this.scene.add.graphics();

    this.circle.fillStyle(0xff0000, 1);
    this.circle.fillCircle(this.x, this.y, 20);

    this.scene.input.on('pointerdown', () => {
      this.weapon.startShooting();
    });
    this.scene.input.on('pointerup', () => {
      this.weapon.stopShooting();
    });
  }

  update(time) {
    const pointer = this.scene.input.activePointer;

    this.angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.x, pointer.y);

    this.cannon.clear();
    this.cannon.fillStyle(0xff0000, 1);

    const offsetX = Math.sin(this.angle) * (this.cannonWidth / 2);
    const offsetY = Math.cos(this.angle) * (this.cannonWidth / 2);
    const x2 = this.x + Math.cos(this.angle) * this.cannonLength;
    const y2 = this.y + Math.sin(this.angle) * this.cannonLength;

    this.cannon.beginPath();
    this.cannon.moveTo(this.x - offsetX, this.y + offsetY);
    this.cannon.lineTo(this.x + offsetX, this.y - offsetY);
    this.cannon.lineTo(x2 + offsetX, y2 - offsetY);
    this.cannon.lineTo(x2 - offsetX, y2 + offsetY);
    this.cannon.closePath();
    this.cannon.fillPath();

    this.weapon.update(time, this.x, this.y, this.angle, this.cannonLength);
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {}

  create() {
    const { width, height } = this.scale;
    this.player = new Player(this, width / 2, height / 2);
  }

  update(time, delta) {
    this.player.update(time);
  }
}

export default MainScene;