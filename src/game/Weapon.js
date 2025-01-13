import { CircleCollider, CircleShape, Component, ComponentTypes, Transform, Velocity } from "../engine/components/Components";
import System from "../engine/systems/System";
import { validateNumbers } from "../engine/utilities/validation";
import { CustomComponentTypes } from "../scenes/MainScene";


export class Projectile extends Component {
  constructor(dmg) {
    super(CustomComponentTypes.PROJECTILE);
    validateNumbers(dmg);
    this.dmg = dmg;
  }
}

// Fix/remove error raising and handling
function removeOutOfBounds(world, scene) {
  const { width, height } = scene.scale;

  const projectiles = world.getEntitiesWithComponent('Projectile');
  for (const proj of projectiles) {
    const transform = world.getComponent(proj, ComponentTypes.TRANSFORM);
    if (
      transform.x < 0 || transform.x > width ||
      transform.y < 0 || transform.y > height
    ) {Projectile
      world.removeEntity(proj);
    }
  } 

}

// refactor
function fireProjectile(world, scene, projRadius, projColor, projSpeed) {
  const pointer = scene.input.activePointer;
  const player = world.getEntitiesWithComponent('Player')[0];
  const playerTransform = world.getComponent(player, ComponentTypes.TRANSFORM);
  const cannon = world.getEntitiesWithComponent('PlayerCannon')[0];
  const cannonTransform = world.getComponent(cannon, ComponentTypes.TRANSFORM);
  const cannonShape = world.getComponent(cannon, ComponentTypes.RECT_SHAPE);
  const angle = Phaser.Math.Angle.Between(cannonTransform.x, cannonTransform.y, pointer.x, pointer.y);

  const projectile = world.createEntity([
    new Transform(
      playerTransform.x + Math.cos(angle) * cannonShape.width,
      playerTransform.y + Math.sin(angle) * cannonShape.width),
    new CircleShape(projRadius, projColor),
    new CircleCollider(projRadius),
    new Projectile(1)
  ]);

  const vx = Math.cos(angle) * projSpeed;
  const vy = Math.sin(angle) * projSpeed;

  world.addComponent(projectile, new Velocity(vx, vy));
}

// Little bit weird to have properties and functions like start/stopshooting in the system. Fix when adding input system/events
export class WeaponSystem extends System {
  constructor(scene, shootDelay, projRadius, projColor, projSpeed) {
    super();
    this.scene = scene;
    this.shootDelay = shootDelay;
    this.projRadius = projRadius;
    this.projColor = projColor;
    this.projSpeed = projSpeed;

    this.isShooting = false;
    this.lastShotTime = 0;

  }

  startShooting() {
    this.isShooting = true;
  }

  stopShooting() {
    this.isShooting = false;
  }

  update(world, time, delta) {
    if (this.isShooting && time > this.lastShotTime + this.shootDelay) {
      fireProjectile(world, this.scene, this.projRadius, this.projColor, this.projSpeed);
      this.lastShotTime = time;
    }

    removeOutOfBounds(world, this.scene);
    
  }
}
