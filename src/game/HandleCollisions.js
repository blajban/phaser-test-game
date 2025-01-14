import { ComponentTypes } from "../engine/components/Components";
import { CustomComponentTypes } from "../scenes/MainScene";

function projectileHitEnemy(world, projectileEntity, enemyEntity) {
  const proj = world.getComponent(projectileEntity, CustomComponentTypes.PROJECTILE);
  const enemy = world.getComponent(enemyEntity, CustomComponentTypes.ENEMY);
  enemy.hp -= proj.dmg;
  
  if (enemy.hp <= 0) {
    const particleComponent = world.getComponent(enemyEntity, ComponentTypes.PARTICLE);
    particleComponent.active = true;

    world.removeComponent(enemyEntity, CustomComponentTypes.ENEMY);
    world.removeComponent(enemyEntity, ComponentTypes.VELOCITY);

    const scoreEntity = world.getEntitiesWithComponent(CustomComponentTypes.SCORE)[0];
    const scoreComponent = world.getComponent(scoreEntity, CustomComponentTypes.SCORE);
    scoreComponent.score += 1;
  }

  world.removeEntity(projectileEntity);
}

function enemyHitPlayer(world, enemyEntity, playerEntity) {
  const player = world.getComponent(playerEntity, CustomComponentTypes.PLAYER);
  const enemy = world.getComponent(enemyEntity, CustomComponentTypes.ENEMY);
  player.hp -= enemy.dmg;

  if (player.hp <= 0) {
    console.log('LOST!!')
  }
  world.removeEntity(enemyEntity);
}

export function handleCollisions(world, entityA, entityB) {
  const isProjectileA = world.getComponent(entityA, CustomComponentTypes.PROJECTILE) !== null;
  const isProjectileB = world.getComponent(entityB, CustomComponentTypes.PROJECTILE) !== null;
  const isEnemyA = world.getComponent(entityA, CustomComponentTypes.ENEMY) !== null;
  const isEnemyB = world.getComponent(entityB, CustomComponentTypes.ENEMY) !== null;
  const isPlayerA = world.getComponent(entityA, CustomComponentTypes.PLAYER) !== null;
  const isPlayerB = world.getComponent(entityB, CustomComponentTypes.PLAYER) !== null;

  if (isProjectileA && isEnemyB) {
    projectileHitEnemy(world, entityA, entityB);
  } else if (isProjectileB && isEnemyA) {
    projectileHitEnemy(world, entityB, entityA);
  }

  if (isPlayerA && isEnemyB) {
    enemyHitPlayer(world, entityB, entityA);
  } else if (isEnemyA && isPlayerB) {
    enemyHitPlayer(world, entityA, entityB);
  }
}