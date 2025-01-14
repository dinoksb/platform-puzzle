import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("background", "bg.png");
        this.load.image("logo", "logo.png");

        this.load.tilemapTiledJSON("tilelayer", "mapDatas/level01.json");
        this.load.image("tile", "textures/tiles/default_tile.png");

        this.load.image("box", "textures/character/box.png");

        // when load completed
        this.load.on("complete", () => {
            this.scene.start("MainMenu");
        });
    }
}
