import { IPlayerComponent } from "../../../interface/IPlayerComponent";
import { Player } from "../../../Player";

export class KeyboardHorizontalSpaceJump implements IPlayerComponent {
    private onJump?: () => void;

    protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    protected body!: Phaser.Physics.Arcade.Body;
    private jumpSpeed: number = 300;
    private canJump = true;

    constructor(jumpSpeed?: number, onJump?: () => void) {
        if (jumpSpeed) this.jumpSpeed = jumpSpeed;
        if (onJump) this.onJump = onJump;
    }

    onAdd(player: Player): void {
        if (!player.scene.input.keyboard) {
            throw new Error("Keyboard input is not available.");
        }
        this.cursors = player.scene.input.keyboard.createCursorKeys();
        this.body = player.body as Phaser.Physics.Arcade.Body;
    }

    onUpdate(): void {
        if (this.body.blocked.down) {
            this.canJump = true;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.jump();
        }
    }

    public jump(): void {
        if (this.canJump) {
            this.body.setVelocityY(-this.jumpSpeed);
            this.canJump = false;

            if (this.onJump) this.onJump();
        }
    }
}
