import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Player } from "../core/Player";
import { KeyboardHorizontalMove } from "../core/components/input/keyboard/KeyboardHorizontalMove";
import { KeyboardHorizontalSpaceWallJump } from "../core/components/input/keyboard/KeyboardHorizontalSpaceWallJump";

export class GameScene extends Scene {
    private player!: Player;
    private platformLayer?: Phaser.Tilemaps.TilemapLayer;
    private itemLayer?: Phaser.Tilemaps.TilemapLayer;
    private goal!: Phaser.GameObjects.Image;

    constructor() {
        super("GameScene");
    }

    preload() {
        this.cache.tilemap.remove("tilelayer");
        this.load.tilemapTiledJSON(
            "tilelayer",
            // `assets/mapDatas/level${GameState.currentLevel}.json`
            `assets/mapDatas/level0.json`
        );
    }

    create() {
        const map = this.make.tilemap({ key: "tilelayer" });
        map.setCollision(1);

        const mapTileSetImage = map.addTilesetImage("default_tile", "tile");
        if (!mapTileSetImage) {
            throw new Error("Failed to load tileset: default_tile");
        }
        const itemTileSetImage = map.addTilesetImage("items", "coin");
        if (!itemTileSetImage) {
            throw new Error("Failed to load tileset: items");
        }

        const background = this.add.image(0, 0, "background").setOrigin(0, 0);
        background.setDisplaySize(map.widthInPixels, map.heightInPixels);

        this.platformLayer = map
            .createLayer("Tile", mapTileSetImage, 0, 0)
            ?.setCollisionByProperty({ collides: true });

        this.itemLayer = map
            .createLayer("Coin", itemTileSetImage, 0, 0)
            ?.setCollisionByProperty({ collides: true });
        const coins = this.itemLayer?.createFromTiles(2, -1, {
            key: "coin",
            origin: 0,
        });
        coins?.forEach((coin) => {
            this.physics.add.existing(coin);
            const body = coin.body as Phaser.Physics.Arcade.Body;
            body.setBoundsRectangle(new Phaser.Geom.Rectangle(0, 0, 32, 32));
        });

        const objectsLayer = map.getObjectLayer("Objects");
        if (objectsLayer) {
            this.createFromObjectsLayer(objectsLayer);
        }

        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.startFollow(this.player);
        this.physics.add.collider(this.player, this.platformLayer!);

        if (coins) {
            this.physics.add.collider(coins, this.platformLayer!);
        }

        if (this.player && coins) {
            this.physics.add.overlap(
                this.player,
                coins,
                this
                    .handlePlayerEatCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
            );
        }

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.player.update();
    }

    changeScene() {
        this.scene.start("MainMenuScene");
    }

    private createPlayer(posX: number, posY: number): void {
        this.player = new Player({
            scene: this,
            x: posX,
            y: posY,
            texture: "player",
            gravityX: 0,
            gravityY: 200,
        });

        this.player.addComponent(
            new KeyboardHorizontalMove(
                800,
                200,
                true,
                () => {
                    this.player.flipX = true;
                },
                () => {
                    this.player.flipX = false;
                }
            )
        );
        this.player.addComponent(new KeyboardHorizontalSpaceWallJump(300, 250));
    }

    private createFromObjectsLayer(layer: Phaser.Tilemaps.ObjectLayer) {
        for (let i = 0; i < layer.objects.length; ++i) {
            const obj = layer.objects[i];
            switch (obj.name) {
                case "spawn": {
                    const x = Math.round(obj.x! / 32) * 32;
                    const y = Math.round(obj.y! / 32) * 32;
                    this.createPlayer(x, y);
                    break;
                }
                case "goal": {
                    this.goal = this.physics.add
                        .image(obj.x!, obj.y!, "goal")
                        .setOrigin(0, 0)
                        .setImmovable(false);
                    if (
                        this.goal.body &&
                        this.goal.body instanceof Phaser.Physics.Arcade.Body
                    ) {
                        this.goal.body.setAllowGravity(false);
                    }
                    this.physics.add.collider(this.goal, this.platformLayer!);

                    this.physics.add.overlap(
                        this.goal,
                        this.player,
                        this.handleGoal,
                        undefined,
                        this
                    );
                    break;
                }
            }
        }
    }

    private handlePlayerEatCoin(
        _: Phaser.Physics.Arcade.Body,
        coin: Phaser.Physics.Arcade.Body
    ) {
        coin.destroy();
    }

    private handleGoal() {
        this.scene.start("LevelSelectScene");
    }
}
