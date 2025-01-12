import { ComponentTypes } from "../components/Components";
import System from "./System";

// Change to event driven instead of callback later on..
export class CollisionSystem extends System {
  constructor(eventEmitter) {
    super();
    this.eventEmitter = eventEmitter;
  }

  update(world, time, delta) {
    const entities = world.getEntitiesWithComponentArchetype(
      ComponentTypes.COLLIDER,
      ComponentTypes.TRANSFORM
    );

    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entityA = entities[i];
        const entityB = entities[j];

        const transformA = world.getComponent(entityA, ComponentTypes.TRANSFORM);
        const transformB = world.getComponent(entityB, ComponentTypes.TRANSFORM);

        const colliderA = world.getComponent(entityA, ComponentTypes.COLLIDER);
        const colliderB = world.getComponent(entityB, ComponentTypes.COLLIDER);

        const collided = this.checkCollision(transformA, colliderA, transformB, colliderB);

        if (collided) {
          this.eventEmitter.emit('collision', { entityA, entityB });
        }
      }
    }

  }

  checkCollision(transformA, colliderA, transformB, colliderB) {
    if (colliderA.subType === ComponentTypes.BOX_COLLIDER && colliderB.subType === ComponentTypes.BOX_COLLIDER) {
      return this.checkBoxCollision(transformA, colliderA, transformB, colliderB);
    }
    if (colliderA.subType === ComponentTypes.CIRCLE_COLLIDER && colliderB.subType === ComponentTypes.CIRCLE_COLLIDER) {
      return this.checkCircleCollision(transformA, colliderA, transformB, colliderB);
    }
    if (colliderA.subType === ComponentTypes.CIRCLE_COLLIDER && colliderB.subType === ComponentTypes.BOX_COLLIDER) {
      return this.checkCircleBoxCollision(transformA, colliderA, transformB, colliderB);
    }
    if (colliderA.subType === ComponentTypes.BOX_COLLIDER && colliderB.subType === ComponentTypes.CIRCLE_COLLIDER) {
      return this.checkCircleBoxCollision(transformB, colliderB, transformA, colliderA);
    }

    console.error('Invalid collider pair:', colliderA, colliderB);
    return false;
  }

  checkBoxCollision(transformA, boxA, transformB, boxB) {
    const ax1 = transformA.x - boxA.width / 2;
    const ax2 = transformA.x + boxA.width / 2;
    const ay1 = transformA.y - boxA.height / 2;
    const ay2 = transformA.y + boxA.height / 2;
  
    const bx1 = transformB.x - boxB.width / 2;
    const bx2 = transformB.x + boxB.width / 2;
    const by1 = transformB.y - boxB.height / 2;
    const by2 = transformB.y + boxB.height / 2;
  
    return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
  }

  checkCircleCollision(transformA, circleA, transformB, circleB) {
    const dx = transformA.x - transformB.x;
    const dy = transformA.y - transformB.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    return distance < (circleA.radius + circleB.radius);
  }

  checkCircleBoxCollision(transformCircle, circle, transformBox, box) {
    const cx = transformCircle.x;
    const cy = transformCircle.y;
  
    const bx1 = transformBox.x - box.width / 2;
    const bx2 = transformBox.x + box.width / 2;
    const by1 = transformBox.y - box.height / 2;
    const by2 = transformBox.y + box.height / 2;
  
    const closestX = Math.max(bx1, Math.min(cx, bx2));
    const closestY = Math.max(by1, Math.min(cy, by2));
  
    const dx = cx - closestX;
    const dy = cy - closestY;
  
    return dx * dx + dy * dy < circle.radius * circle.radius;
  }
  
  
}