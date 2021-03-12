// @ts-check

import Phaser from 'phaser';
import Hero from '../entities/Hero.js';

class Game extends Phaser.Scene {

  preload() {
    this.load.image('mage', 'assets/mage/mage.png');
    this.load.spritesheet('idle-spritesheet', 'assets/mage/idle.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('walk-spritesheet', 'assets/mage/walk.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('jump-spritesheet', 'assets/mage/jump.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('double-jump-spritesheet', 'assets/mage/double-jump.png', { frameWidth: 171, frameHeight: 128 });

    this.load.tilemapTiledJSON('level1-tilemap', 'assets/tilemap.json');
    this.load.image('ground-image', 'assets/tiles/tiles.png ');
    this.load.image('bush-image', 'assets/tiles/bush-and-trees.png');

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

    this.anims.create({
      key: 'hero-walk',
      frames: this.anims.generateFrameNumbers('walk-spritesheet', {}),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'hero-jump',
      frames: this.anims.generateFrameNumbers('jump-spritesheet', {}),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'hero-double-jump',
      frames: this.anims.generateFrameNumbers('double-jump-spritesheet', {}),
      frameRate: 20,
      repeat: 0
    });



    let map = this.make.tilemap({ key: 'level1-tilemap' });
    let groundTiles = map.addTilesetImage('ground', 'ground-image');
    let bushTiles = map.addTilesetImage('bush', 'bush-image');

    let objects = map.getObjectLayer('Objects').objects;

    let heroX;
    let heroY;
    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.name == 'Start') {
        heroX = object.x;
        heroY = object.y
      }
    }


    let bkg = map.createStaticLayer('background', [groundTiles, bushTiles]);
    let hero = new Hero(this, heroX, heroY);
    let groundLayer = map.createStaticLayer('ground', [groundTiles, bushTiles]);
    let fgd = map.createStaticLayer('foreground', [groundTiles, bushTiles])

    this.physics.add.collider(hero, groundLayer);
    groundLayer.setCollisionBetween(groundTiles.firstgid, groundTiles.firstgid + groundTiles.total, true);

    this.cameras.main.startFollow(hero);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, false, true);
  }


}

export default Game;