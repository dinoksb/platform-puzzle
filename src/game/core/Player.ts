import Phaser from "phaser";

interface PlayerConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    settings: {
        gravity: {
            y: number;
        };
    };
}

export class Player extends Phaser.GameObjects.Sprite {
    private playerMaxVelocityX: number;
    private playerSpeed: number;
    private playerJump: number;
    private wallJumpSpeed: number;
    private wallSlideSpeed: number;
    private canJump: boolean;
    private onWall: boolean;
    private wallJumpDirection: number;
    private cursor: Phaser.Types.Input.Keyboard.CursorKeys;

    public scene: Phaser.Scene;

    constructor(config: PlayerConfig) {
        super(config.scene, config.x, config.y, "player");

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

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setGravityY(config.settings.gravity.y);
        body.setMaxVelocityX(this.playerMaxVelocityX);

        const keyboard = this.scene.input.keyboard;
        if (keyboard) {
            this.cursor = keyboard.createCursorKeys();
        } else {
            throw new Error("Keyboard input is not initialized.");
        }
    }

    update() {
        this.move();
        this.handleJumpState();
    }

    private move() {
        const body = this.body as Phaser.Physics.Arcade.Body;

        // Handle left/right movement based on input
        if (this.cursor.left.isDown) {
            body.setAccelerationX(-this.playerSpeed);
            this.flipX = true;
        } else if (this.cursor.right.isDown) {
            body.setAccelerationX(this.playerSpeed);
            this.flipX = false;
        } else if (!this.onWall) {
            body.setAccelerationX(0);
            body.setDragX(this.playerSpeed / 2);
        }

        // Control sliding speed when the player is on a wall
        if (
            (this.cursor.left.isDown || this.cursor.right.isDown) &&
            this.onWall &&
            body.velocity.y > this.wallSlideSpeed
        ) {
            body.setVelocityY(this.wallSlideSpeed);
        }
    }

    private jump() {
        const body = this.body as Phaser.Physics.Arcade.Body;

        // Perform a jump if conditions are met
        if ((this.canJump && body.blocked.down) || this.onWall) {
            body.velocity.y = -this.playerJump;

            // If jumping from a wall, set horizontal velocity
            if (this.onWall) {
                body.setVelocityX(this.wallJumpDirection * this.wallJumpSpeed);
                body.setVelocityY(-this.wallJumpSpeed);
            }

            this.canJump = false;
            this.onWall = false;
        }
    }

    private handleJumpState() {
        const body = this.body as Phaser.Physics.Arcade.Body;

        // Check if jump input is pressed
        if (Phaser.Input.Keyboard.JustDown(this.cursor.space)) {
            this.jump();
        }

        // Reset jump ability if player is on the ground
        if (body.blocked.down) {
            this.canJump = true;
            this.onWall = false;
        }

        // Detect if player is on a wall
        if (body.blocked.right && !body.blocked.down) {
            this.onWall = true;
            this.wallJumpDirection = -1; // Jump direction is left when on the right wall
        } else if (body.blocked.left && !body.blocked.down) {
            this.onWall = true;
            this.wallJumpDirection = 1; // Jump direction is right when on the left wall
        } else {
            this.onWall = false;
        }
    }
}
