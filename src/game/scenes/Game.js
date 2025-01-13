import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    init() {

    }

    create() {
        this.add.image(0, 0, "background").setOrigin(0, 0);

        const map = this.make.tilemap({key: 'level_1'})
        const tileset = map.addTilesetImage('tileset_level01', 'tile')
        const layer = map.createLayer('layer01', tileset, 0, 0)

        map.setCollision(1)


        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("MainMenu");
    }
}

