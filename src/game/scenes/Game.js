import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Player } from "../core/Player";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    create() {

        this.add.image(0, 0, "background").setOrigin(0, 0);

        const map = this.make.tilemap({ key: "level01" });
        const tileset = map.addTilesetImage("tileset_level01", "tile");
        const layer = map.createLayer("layer01", tileset, 0, 0);
        map.setCollision(1);

        // layer.setCollisionByExclusion([], true);

        const settings = {
            gravity: this.physics.world.gravity,
        };
        this.box = new Player({ scene: this, x: 200, y: 440, settings: settings });

        this.physics.add.collider(this.box, layer);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.box.update();
    }

    changeScene() {
        this.scene.start("MainMenu");
    }
}
