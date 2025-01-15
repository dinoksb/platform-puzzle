import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class LevelSelectScene extends Scene {
    private scrollingMap: Phaser.GameObjects.TileSprite;
    private pageSelectors: Phaser.GameObjects.Image[] = [];
    private currentPage: number = 0;

    private colors: number[] = [
        0xffffff, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00,
    ];
    private columns: number = 3;
    private rows: number = 4;
    private thumbWidth: number = 60;
    private thumbHeight: number = 60;
    private spacing: number = 20;
    private localStorageName: string = "levelSelect";

    private stars: number[] = [];
    private thumbContainers: Phaser.GameObjects.Container[] = [];

    constructor() {
        super("LevelSelectScene");
    }

    create() {
        this.add.image(0, 0, "background").setOrigin(0, 0);

        const centerX = this.cameras.main.centerX;

        // Load save data from localStorage
        const savedData = localStorage.getItem(this.localStorageName);
        if (savedData) {
            this.stars = savedData.split(",").map(Number);
        }

        // Set title text
        this.add
            .text(centerX, 20, "Level Select Page", {
                fontFamily: "Arial Black",
                fontSize: 20,
                stroke: "#000000",
                color: "#ffffff",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5, 0.5);

        // Create scrolling map
        this.scrollingMap = this.add
            .tileSprite(
                0,
                0,
                this.colors.length * this.scale.width,
                this.scale.height,
                "transp"
            )
            .setOrigin(0, 0);
        this.scrollingMap.setInteractive();
        this.scrollingMap.setPosition(this.currentPage * -this.scale.width, 0);
        this.thumbContainers.forEach((container) => {
            container.x += this.currentPage * this.scale.width;
        });
        this.input.setDraggable(this.scrollingMap);

        // Calculate margins
        const rowLength =
            this.thumbWidth * this.columns + this.spacing * (this.columns - 1);
        this.thumbWidth * this.columns + this.spacing * (this.columns - 1);
        const leftMargin = (this.scale.width - rowLength) / 2;
        const colHeight =
            this.thumbHeight * this.rows + this.spacing * (this.rows - 1);
        const topMargin = (this.scale.height - colHeight) / 2;

        console.log("this.scale.width: ", this.scale.width);
        console.log("rowLength: ", rowLength);
        console.log("leftMargin: ", leftMargin);

        // Create thumbnails
        this.createThumbnails(leftMargin, topMargin);

        // Page selectors
        this.createPageSelectors();

        // Input events
        this.setupDragEvents();

        EventBus.emit("current-scene-ready", this);
    }

    private createThumbnails(leftMargin: number, topMargin: number) {
        const thumbOffsetX = this.thumbWidth + this.spacing;
        const thumbOffsetY = this.thumbHeight + this.spacing;
        const pageWidth = this.scale.width;

        for (let k = 0; k < this.colors.length; k++) {
            for (let i = 0; i < this.columns; i++) {
                for (let j = 0; j < this.rows; j++) {
                    const thumbX =
                        k * pageWidth +
                        leftMargin +
                        i * thumbOffsetX -
                        this.currentPage * pageWidth;
                    const thumbY = topMargin + j * thumbOffsetY;
                    const thumb = this.add
                        .image(0, 0, "levelthumb")
                        .setTint(this.colors[k])
                        .setOrigin(0, 0);

                    const levelNumber =
                        k * this.rows * this.columns + j * this.columns + i;
                    thumb.setData("levelNumber", levelNumber);
                    thumb.setFrame((this.stars[levelNumber] || 0) + 1);

                    const levelText = this.add.text(
                        0,
                        0,
                        levelNumber.toString(),
                        {
                            font: "24px Arial",
                            color: "#000000",
                        }
                    );

                    const container = this.add.container(thumbX, thumbY, [
                        thumb,
                        levelText,
                    ]);
                    this.thumbContainers.push(container);
                }
            }
        }
    }

    private createPageSelectors() {
        this.clearPageSelectors();

        for (let k = 0; k < this.colors.length; k++) {
            const selectorX =
                this.scale.width / 2 +
                (k - Math.floor(this.colors.length / 2)) * 40;
            const selector = this.add
                .image(selectorX, this.scale.height - 40, "levelpages")
                .setInteractive();
            selector.setTint(this.colors[k]);
            selector.setData("pageIndex", k);
            selector.on("pointerup", () => {
                const difference = k - this.currentPage;
                this.changePage(difference);
            });
            if (k === this.currentPage) {
                selector.setScale(1.5);
            } else {
                selector.setScale(1);
            }
            this.pageSelectors.push(selector);
        }
    }

    private clearPageSelectors() {
        this.pageSelectors.forEach((selector) => {
            selector.destroy();
        });

        this.pageSelectors = [];
    }

    private setupDragEvents() {
        this.input.on(
            "dragstart",
            (
                _: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.GameObject
            ) => {
                if (gameObject instanceof Phaser.GameObjects.TileSprite) {
                    gameObject.setData("startPosition", gameObject.x);
                }
            }
        );

        this.input.on(
            "drag",
            (
                _: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.GameObject,
                dragX: number
            ) => {
                if (gameObject instanceof Phaser.GameObjects.TileSprite) {
                    // Restrict the drag range to the map's bounds
                    const clampedX = Phaser.Math.Clamp(
                        dragX,
                        -gameObject.width + this.scale.width,
                        0
                    );
                    const deltaX = clampedX - gameObject.x;
                    gameObject.x = clampedX;

                    // Sync all thumbnail containers with the drag
                    this.thumbContainers.forEach((container) => {
                        container.x += deltaX;
                    });
                }
            }
        );

        this.input.on(
            "dragend",
            (
                _: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.GameObject
            ) => {
                if (gameObject instanceof Phaser.GameObjects.TileSprite) {
                    const startPosition = gameObject.getData("startPosition");
                    const swipeDistance = startPosition - gameObject.x;

                    if (swipeDistance > this.scale.width / 8) {
                        this.changePage(1);
                    } else if (swipeDistance < -this.scale.width / 8) {
                        this.changePage(-1);
                    } else {
                        this.changePage(0);
                    }
                }
            }
        );
    }

    changePage(page: number) {
        this.currentPage += page;
        this.pageSelectors.forEach((selector, index) => {
            if (index === this.currentPage) {
                selector.setScale(1.5);
            } else {
                selector.setScale(1);
            }
        });

        const targetX = this.currentPage * -this.scale.width;
        let initialX = this.scrollingMap.x;

        this.tweens.add({
            targets: this.scrollingMap,
            x: targetX,
            duration: 300,
            ease: "Cubic.easeOut",
            onUpdate: (tween) => {
                const currentX = tween.getValue();
                const deltaX = currentX - initialX;
                initialX = currentX;

                // Update each thumbnail container position
                this.thumbContainers.forEach((container) => {
                    container.x += deltaX;
                });
            },
        });
    }

    changeScene() {
        this.scene.start("GameScene");
    }
}
