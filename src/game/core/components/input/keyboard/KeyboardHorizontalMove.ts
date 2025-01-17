import { IPlayerComponent } from "../../../interface/IPlayerComponent";
import { Player } from "../../../Player";

export class KeyboardHorizontalMove implements IPlayerComponent {
    private onLeftDown?: () => void;
    private onRightDown?: () => void;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private body!: Phaser.Physics.Arcade.Body;
    private speed: number = 100;
    private maxVelocity: number = 100;
    private useAcceleration: boolean = false;

    constructor(
        speed?: number,
        maxVelocity?: number,
        useAcceleration?: boolean,
        onLeftDown?: () => void,
        onRightDown?: () => void
    ) {
        if (speed) this.speed = speed;
        if (maxVelocity) this.maxVelocity = maxVelocity;
        if (useAcceleration) this.useAcceleration = useAcceleration;
        if (onLeftDown) this.onLeftDown = onLeftDown;
        if (onRightDown) this.onRightDown = onRightDown;
    }

    onAdd(player: Player): void {
        if (!player.scene.input.keyboard) {
            throw new Error("Keyboard input is not available.");
        }
        this.cursors = player.scene.input.keyboard.createCursorKeys();
        this.body = player.body as Phaser.Physics.Arcade.Body;
        this.body.setMaxVelocityX(this.maxVelocity);
    }

    onUpdate(): void {
        if (!this.body) return;

        let velocityX = 0;
        if (this.cursors.left?.isDown) {
            velocityX = -this.speed;

            if (this.onLeftDown) this.onLeftDown();
        } else if (this.cursors.right?.isDown) {
            velocityX = this.speed;

            if (this.onRightDown) this.onRightDown();
        } else {
            if (this.useAcceleration) {
                this.body.setDragX(this.speed);
            }
        }

        if (this.useAcceleration) {
            this.body.setAccelerationX(velocityX);
        } else {
            this.body.setVelocityX(velocityX);
        }
    }
}
