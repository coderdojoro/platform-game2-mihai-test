// @ts-check

class Hero extends Phaser.GameObjects.Sprite {

    keyLeft;
    keyRight;
    keyJump;
    keyRun;

    heroState = 'idle';
    animState = 'idle';

    constructor(scene, x, y) {
        super(scene, x, y, 'mage');
        this.initialX = x;
        this.initialY = y;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }

        this.body.setCollideWorldBounds(true);
        this.body.setSize(33, 54);
        this.body.setOffset(70, 57);
        this.anims.play('hero-idle');
        this.body.setDragX(900);

        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keyJump = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyRun = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!(this.body instanceof Phaser.Physics.Arcade.Body)) {
            return;
        }
        if (this.heroState == 'death') {
            return;
        }

        if (this.keyLeft.isUp && this.keyRight.isUp && this.body.onFloor() && this.body.velocity.y == 0) {
            this.body.setAccelerationX(0);
            this.heroState = "idle";
        }

        if (this.keyLeft.isDown && this.body.onFloor() && this.body.velocity.y == 0) {
            //this.body.setVelocityX(-500);
            this.body.setMaxVelocity(200, 400);
            this.body.setAccelerationX(-500);
            this.setFlipX(true);
            this.heroState = "walk";
        }
        if (this.keyRight.isDown && this.body.onFloor() && this.body.velocity.y == 0) {
            //this.body.setVelocityX(500);
            this.body.setMaxVelocity(200, 400);
            this.body.setAccelerationX(500);
            this.setFlipX(false);
            this.heroState = "walk";
        }

        if (this.keyRun.isDown && this.keyLeft.isDown && this.body.onFloor() && this.body.velocity.y == 0) {
            this.body.setMaxVelocity(400, 400);
            this.body.setAccelerationX(-500);
            this.setFlipX(true);
            this.heroState = "run";
        }

        if (this.keyRun.isDown && this.keyRight.isDown && this.body.onFloor() && this.body.velocity.y == 0) {
            this.body.setMaxVelocity(400, 400);
            this.body.setAccelerationX(500);
            this.setFlipX(false);
            this.heroState = "run";
        }

        let justDown = Phaser.Input.Keyboard.JustDown(this.keyJump);

        if (justDown && this.heroState != 'jump' && this.body.onFloor() && this.body.velocity.y == 0) {
            this.body.setVelocityY(-250);
            justDown = false;
            this.heroState = 'jump';
        }

        if (justDown && (this.heroState == 'jump' || this.heroState == 'fall')) {
            this.body.setVelocityY(-400);
            this.heroState = 'double-jump';
        }

        if (!this.body.onFloor() && this.body.velocity.y > 0 && this.heroState != 'jump' && this.heroState != 'double-jump' && this.heroState != 'fall') {
            this.heroState = 'fall';
            this.body.setVelocityX(0);
        }

        if (this.heroState == 'jump' || this.heroState == 'double-jump' || this.heroState == 'fall') {
            if (this.keyRight.isDown) {
                this.setFlipX(false);
                this.body.setAccelerationX(500);
            } else if (this.keyLeft.isDown) {
                this.setFlipX(true);
                this.body.setAccelerationX(-500);
            } else {
                this.body.setVelocityX(0);
            }
        }



        if (this.heroState == "idle" && this.animState != "idle") {
            this.anims.play('hero-idle');
            this.animState = "idle";
        }
        if (this.heroState == "walk" && this.animState != "walk") {
            this.anims.play('hero-walk');
            this.animState = "walk";
        }
        if (this.heroState == "run" && this.animState != "run") {
            this.anims.play('hero-run');
            this.animState = "run";
        }
        if (this.heroState == 'jump' && this.animState != 'jump') {
            this.anims.play('hero-jump');
            this.animState = 'jump';
        }

        if (this.heroState == 'double-jump' && this.animState != 'double-jump') {
            this.anims.play('hero-double-jump');
            this.animState = 'double-jump';
        }

        if (this.heroState == 'fall' && this.animState != 'fall') {
            this.anims.play('hero-fall');
            this.animState = 'fall';
        }

        //console.log("heroState:" + this.heroState + " animState:" + this.animState);

    }
    spikeOverlap(hero, tiles) {
        if (this.heroState != 'death') {
            this.anims.play('hero-death');
            this.heroState = 'death';
            this.animState = 'death';
            this.body.stop();
            this.scene.deathSound.play();
            this.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
                this.heroState = 'idle';
                this.setX(this.initialX);
                this.setY(this.initialY);
            }, this);

        }

    }
}

export default Hero;