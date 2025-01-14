export class Player extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, "box");

        this.scene = config.scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.playerSpeed = 200;
        this.playerJump = 400;

        this.body.setGravityY(config.settings.gravity.y);
        this.body.velocity.x = this.playerSpeed;

        this.canJump = true;
        this.onWall = false;

        this.scene.input.on("pointerdown", this.handleJump, this);
    }

    handleJump() {
        if ((this.canJump && this.body.blocked.down) || this.onWall) {
            this.body.velocity.y = -this.playerJump;

            if (this.onWall) {
                this.scaleX *= -1;
                this.body.velocity.x = this.playerSpeed * this.scaleX;
            }

            this.canJump = false;
            this.onWall = false;

            if (this.scaleX === -1) {
                this.body.setOffset(this.body.width, 0);
            } else {
                this.body.setOffset(0, 0);
            }
        }
    }

    update() {
        if (this.body.blocked.down) {
            this.canJump = true;
            this.onWall = false;
        }

        if (this.body.blocked.right && this.body.blocked.down) {
            this.scaleX = -1;
            this.body.setOffset(this.body.width, 0);
        }

        if (this.body.blocked.right && !this.body.blocked.down) {
            this.onWall = true;
        }

        if (this.body.blocked.left && this.body.blocked.down) {
            this.scaleX = 1;
            this.body.setOffset(this.width - this.body.width, 0);
        }

        if (this.body.blocked.left && !this.body.blocked.down) {
            this.onWall = true;
            this.body.setOffset(this.width - this.body.width, 0);
        }

        if (this.scaleX === -1) {
            this.body.setOffset(this.body.width, 0);
        } else {
            this.body.setOffset(0, 0);
        }

        this.body.velocity.x = this.playerSpeed * this.scaleX;
    }
}
