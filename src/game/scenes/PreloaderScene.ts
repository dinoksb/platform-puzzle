import { Scene } from "phaser";

export class PreloaderScene extends Scene {
    constructor() {
        super("PreloaderScene");
    }

    preload() {
        this.load.setPath("assets");

        // main scene
        this.load.image("background", "textures/bg.png");
        this.load.image("logo", "textures/logo.png");

        // level select scene
        this.load.spritesheet("levelthumb", "textures/ui/levelthumb.png", {
            frameWidth: 60,
            frameHeight: 60,
        });
        this.load.image("levelpages", "textures/ui/levelpages.png");
        this.load.image("transp", "textures/ui/transp.png");

        // game scene
        this.load.image("tile", "textures/tiles/default_tile.png");
        this.load.image("goal", "textures/tiles/red_tile.png");
        this.load.image("coin", "textures/item/coin.png");
        this.load.image("box", "textures/character/box.png");

        // when load completed
        this.load.on("complete", () => {
            this.scene.start("MainMenuScene");
        });
    }
}
