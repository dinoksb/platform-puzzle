import { Player } from "./Player";

export class PlayerKeyboardMovement extends Player {
    protected keyboardInput = Phaser.Input.Keyboard.KeyboardPlugin;

    initializeControls() {
        this.keyboardInput = this.scene.input.keyboard;
    }
}
