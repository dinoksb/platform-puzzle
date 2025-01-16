import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class MainMenuScene extends Scene {
    constructor() {
        super("MainMenuScene");
    }

    create() {
        this.createUI();
        this.inputEvent();

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("LevelSelectScene");
    }

    createUI() {
        const { centerX, centerY } = this.cameras.main;

        // create background image
        this.add.image(0, 0, "background").setOrigin(0, 0);

        // create title text
        const titleText = this.add
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

        // create click to start text
        this.add
            .text(centerX, centerY + titleText.height, "Press click to start", {
                fontFamily: "Arial Black",
                fontSize: 28,
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5, 0.5)
            .setDepth(100);
    }

    inputEvent() {
        this.input.on("pointerup", () => {
            this.scene.start("LevelSelectScene");
        });
    }
}
