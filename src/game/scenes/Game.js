import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Player } from "../core/Player";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    create() {
        const map = this.make.tilemap({ key: "tilelayer" });
        const tileset = map.addTilesetImage("default_tile", "tile");

        const background = this.add.image(0, 0, "background").setOrigin(0, 0);
        background.setDisplaySize(map.widthInPixels, map.heightInPixels);

        const layer = map.createLayer("platforms", tileset, 0, 0);

        map.setCollision(1);

        const settings = {
            gravity: this.physics.world.gravity,
        };
        this.player = new Player({
            scene: this,
            x: map.tileWidth * 2,
            y: map.heightInPixels - map.tileWidth * 2,
            settings: settings,
        });

        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.startFollow(this.player);
        this.physics.add.collider(this.player, layer);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.player.update();
    }

    changeScene() {
        this.scene.start("MainMenu");
    }
}
