export default class Weapon {
  constructor(scene, shootDelay, projRadius, projColor, projSpeed) {
    this.scene = scene;
    this.isShooting = false;
    this.shootDelay = shootDelay;
    this.projRadius = projRadius
    this.projColor = projColor;
    this.projSpeed = projSpeed;
    this.lastShotTime = 0;
    this.projectiles = this.scene.add.group();
  }

  startShooting() {
    this.isShooting = true;
  }

  stopShooting() {
    this.isShooting = false;
  }

  fireProjectile(originX, originY, angle, cannonLength) {
    const projectile = this.scene.add.circle(
      originX + Math.cos(angle) * cannonLength,
      originY + Math.sin(angle) * cannonLength,
      this.projRadius,
      this.projColor
    );

    projectile.angle = angle;
    projectile.speed = this.projSpeed;

    this.projectiles.add(projectile);
  }

  update(time, originX, originY, angle, cannonLength) {
    if (this.isShooting && time > this.lastShotTime + this.shootDelay) {
      this.fireProjectile(originX, originY, angle, cannonLength);
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
