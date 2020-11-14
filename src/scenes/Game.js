/// <reference path="../../typings/phaser.d.ts" />
// @ts-check

import Phaser from 'phaser';

class Game extends Phaser.Scene {

  preload() {
    this.load.image('mage', 'assets/mage/mage.png');

  }


  create() {
    this.hero = this.physics.add.sprite(400, 300, 'mage');
    this.hero.body.setCollideWorldBounds(true);

  }


}

export default Game;