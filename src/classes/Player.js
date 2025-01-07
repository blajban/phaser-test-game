import Phaser from "phaser";
import Weapon from "./Weapon";

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.cannonLength = 40;
    this.cannonWidth = 10;

    this.weapon = new Weapon(this.scene, 100, 5, 0xffff00, 3);

    this.circle = this.scene.add.circle(this.x, this.y, 20, 0xff0000);
    this.cannon = this.scene.add.graphics();

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