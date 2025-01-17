import { Player } from "../../../Player";
import { KeyboardHorizontalSpaceJump } from "./KeyboardHorizontalSpaceJump";

export class KeyboardHorizontalSpaceWallJump extends KeyboardHorizontalSpaceJump {
    private onWallJump?: () => void;
    private jumpPower: number = 0;
    private jumpDirection: number = 0;
    private onWall: boolean = false;

    constructor(jumpSpeed: number, jumpPower: number, onJump?: ()=>void, onWallJump?: () => void) {
        super(jumpSpeed, onJump);
        if (jumpPower) this.jumpPower = jumpPower;
        if (onWallJump) this.onWallJump = onWallJump;
    }

    onAdd(player: Player): void {
        super.onAdd(player);
    }

    onUpdate(): void {
        super.onUpdate();

        if (this.body.blocked.right && !this.body.blocked.down) {
            this.onWall = true;
            this.jumpDirection = -1; // Jump direction is left when on the right wall
        } else if (this.body.blocked.left && !this.body.blocked.down) {
            this.onWall = true;
            this.jumpDirection = 1; // Jump direction is right when on the left wall
        } else {
            this.onWall = false;
        }

        if (this.body.blocked.down) {
            this.onWall = false;
        }
    }

    public jump(): void {
        super.jump();

        if(this.onWall){
            this.body.setVelocityX(this.jumpDirection * this.jumpPower);
            this.body.setVelocityY(-this.jumpPower);
    
            if (this.onWallJump) this.onWallJump;
            this.onWall = false;
        }
    }
}
