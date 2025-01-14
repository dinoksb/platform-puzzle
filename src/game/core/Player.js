import Phaser from "phaser";

export class Player extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, "box");

        this.scene = config.scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.playerMaxVelocityX = 200;
        this.playerSpeed = this.playerMaxVelocityX * 4;

        this.playerJump = 300;
        this.wallJumpSpeed = 250;
        this.wallSlideSpeed = 50; // Speed for sliding down the wall
        this.canJump = true;
        this.onWall = false;
        this.wallJumpDirection = 0;

        this.body.setGravityY(config.settings.gravity.y);
        this.body.setMaxVelocityX(this.playerMaxVelocityX);

        this.cursor = this.scene.input.keyboard.createCursorKeys();
    }

    update() {
        this.move();
        this.handleJumpState();
    }

    move() {
        // Handle left/right movement based on input
        if (this.cursor.left.isDown) {
            this.body.setAccelerationX(-this.playerSpeed);
            this.flipX = true;
        } else if (this.cursor.right.isDown) {
            this.body.setAccelerationX(this.playerSpeed);
            this.flipX = false;
        } else if (!this.onWall) {
            this.body.setAccelerationX(
                ((this.body.velocity.x > 0 ? -1 : 1) * this.playerSpeed) / 3
            );
        }

        // Control sliding speed when the player is on a wall
        if (
            (this.cursor.left.isDown || this.cursor.right.isDown) &&
            this.onWall &&
            this.body.velocity.y > this.wallSlideSpeed
        ) {
            this.body.setVelocityY(this.wallSlideSpeed);
        }
    }

    jump() {
        // Perform a jump if conditions are met
        if ((this.canJump && this.body.blocked.down) || this.onWall) {
            this.body.velocity.y = -this.playerJump;

            // If jumping from a wall, set horizontal velocity
            if (this.onWall) {
                this.body.setVelocityX(
                    this.wallJumpDirection * this.wallJumpSpeed
                );
                this.body.setVelocityY(-this.wallJumpSpeed);
            }

            this.canJump = false;
            this.onWall = false;
        }
    }

    handleJumpState() {
        // Check if jump input is pressed
        if (Phaser.Input.Keyboard.JustDown(this.cursor.space)) {
            this.jump();
        }

        // Reset jump ability if player is on the ground
        if (this.body.blocked.down) {
            this.canJump = true;
            this.onWall = false;
        }

        // Detect if player is on a wall
        if (this.body.blocked.right && !this.body.blocked.down) {
            this.onWall = true;
            this.wallJumpDirection = -1; // Jump direction is left when on the right wall
        } else if (this.body.blocked.left && !this.body.blocked.down) {
            this.onWall = true;
            this.wallJumpDirection = 1; // Jump direction is right when on the left wall
        } else {
            this.onWall = false;
        }
    }
}
