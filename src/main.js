import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

if (window.game) {
  console.log('Game already initialized');
} else {
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [ MainScene ],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 },
      },
    },
  };

  window.game = new Phaser.Game(config);
}