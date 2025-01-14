import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    constructor() {
        super("MainMenu");
    }

    create() {
        const { centerX, centerY } = this.cameras.main;

        this.add.image(0, 0, "background").setOrigin(0, 0);
        this.add
            .text(centerX, centerY, "Platform Puzzle Game!", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5, 0.5)
            .setDepth(100);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("Game");
    }
}
