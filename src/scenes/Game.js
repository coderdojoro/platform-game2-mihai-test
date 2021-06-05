// @ts-check

import Phaser from 'phaser';
import Hero from '../entities/Hero.js';

class Game extends Phaser.Scene {

  preload() {
    this.load.image('mage', 'assets/mage/mage.png');
    this.load.spritesheet('idle-spritesheet', 'assets/mage/idle.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('walk-spritesheet', 'assets/mage/walk.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('run-spritesheet', 'assets/mage/run.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('jump-spritesheet', 'assets/mage/jump.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('double-jump-spritesheet', 'assets/mage/double-jump.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('fall-spritesheet', 'assets/mage/fall.png', { frameWidth: 171, frameHeight: 128 });
    this.load.spritesheet('death-spritesheet', 'assets/mage/death.png', { frameWidth: 171, frameHeight: 128 });
    this.load.audio('hero-death', 'assets/mage/death.mp3');

    this.load.image('background4', 'assets/wallpapers/background4.png');
    this.load.image('background3', 'assets/wallpapers/background3.png');
    this.load.image('background2', 'assets/wallpapers/background2.png');
    this.load.image('background1', 'assets/wallpapers/background1.png');


    this.load.tilemapTiledJSON('level1-tilemap', 'assets/tilemap.json');
    this.load.spritesheet('ground-image', 'assets/tiles/tiles.png', { frameWidth: 32, frameHeight: 32 });
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

    this.anims.create({
      key: 'hero-fall',
      frames: this.anims.generateFrameNumbers('fall-spritesheet', {}),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'hero-run',
      frames: this.anims.generateFrameNumbers('run-spritesheet', {}),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'hero-death',
      frames: this.anims.generateFrameNumbers('death-spritesheet', {}),
      frameRate: 6,
      repeat: 0
    });

    this.deathSound = this.sound.add('hero-death', { loop: false, volume: 1 });


    let map = this.make.tilemap({ key: 'level1-tilemap' });
    let background4 = map.addTilesetImage('wallpaper4', 'background4');
    let background3 = map.addTilesetImage('wallpaper3', 'background3');
    let background2 = map.addTilesetImage('wallpaper2', 'background2');
    let background1 = map.addTilesetImage('wallpaper1', 'background1');

    this.battlegroundLayer1 = map.createStaticLayer('wallpaper1' /*layer name from json*/, background1);
    this.battlegroundLayer1.setScrollFactor(0.0, 1);
    this.battlegroundLayer2 = map.createStaticLayer('wallpaper2' /*layer name from json*/, background2);
    this.battlegroundLayer2.setScrollFactor(0.2, 1);
    this.battlegroundLayer3 = map.createStaticLayer('wallpaper3' /*layer name from json*/, background3);
    this.battlegroundLayer3.setScrollFactor(0.4, 1);
    this.battlegroundLayer4 = map.createStaticLayer('wallpaper4' /*layer name from json*/, background4);
    this.battlegroundLayer4.setScrollFactor(0.6, 1);

    let groundTiles = map.addTilesetImage('ground', 'ground-image');
    let bushTiles = map.addTilesetImage('bush', 'bush-image');

    let objects = map.getObjectLayer('Objects').objects;

    let heroX;
    let heroY;
    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.name == 'spawn') {
        heroX = object.x;
        heroY = object.y;
      }
    }


    let bkg = map.createStaticLayer('background', [groundTiles, bushTiles]);
    let hero = new Hero(this, heroX, heroY);
    let spikeGroup = this.physics.add.group({ immovable: true, allowGravity: false });
    for (let a = 0; a < objects.length; a++) {
      let object = objects[a];
      if (object.name == 'spike') {
        let spike = spikeGroup.create(object.x, object.y, 'ground-image', object.gid - groundTiles.firstgid);
        spike.setOrigin(0, 1);
      }
    }
    let groundLayer = map.createStaticLayer('ground', [groundTiles, bushTiles]);
    let fgd = map.createStaticLayer('foreground', [groundTiles, bushTiles])

    this.physics.add.overlap(hero, spikeGroup, hero.spikeOverlap, null, hero);

    this.physics.add.collider(hero, groundLayer);
    groundLayer.setCollisionBetween(groundTiles.firstgid, groundTiles.firstgid + groundTiles.total, true);

    this.cameras.main.startFollow(hero);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, false, true);
  }


}

export default Game;