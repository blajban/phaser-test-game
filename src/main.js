import Phaser from 'phaser';
import ExampleScene from './scenes/ExampleScene';

if (window.game) {
  console.log('Game already initialized');
} else {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [ ExampleScene ],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 },
      },
    },
  };

  window.game = new Phaser.Game(config);
}