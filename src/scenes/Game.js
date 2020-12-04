// @ts-check

import Phaser from 'phaser';

class Game extends Phaser.Scene {

  preload() {
    this.load.image('mage', 'assets/mage/mage.png');
    this.load.spritesheet('idle-spritesheet', 'assets/mage/idle.png', { frameWidth: 128, frameHeight: 128 });
  }
  
  create() {
    this.anims.create({
      key: 'hero-idle',
      frames: [
        { frame: 0, key: 'mage', duration: 5000 },
        ...this.anims.generateFrameNumbers('idle-spritesheet', {})
      ],
      frameRate: 6,
      repeat: -1
    });

    let hero = this.physics.add.sprite(400, 300, 'mage');

    hero.body.setCollideWorldBounds(true);
    hero.body.setSize(33, 54);
    hero.body.setOffset(27, 57);
    hero.anims.play('hero-idle');
  }


}

export default Game;