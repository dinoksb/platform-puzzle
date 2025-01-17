import { IPlayerComponent } from "./interface/IPlayerComponent";

export interface IPlayerConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
    gravityX?: number;
    gravityY?: number;
}

export class Player extends Phaser.GameObjects.Sprite {
    public scene: Phaser.Scene;
    private components: IPlayerComponent[] = [];

    constructor(config: IPlayerConfig) {
        super(config.scene, config.x, config.y, config.texture);

        this.scene = config.scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        // set default collision
        this.body = this.body as Phaser.Physics.Arcade.Body;
        this.body.setCollideWorldBounds(true);
        if(config.gravityX){
            this.body.setGravityX(config.gravityX);
        }
        if(config.gravityY){
            this.body.setGravityY(config.gravityY);
        }
    }

    public update(): void{
        for(const component of this.components){
            component.onUpdate();
        }
    }

    public addComponent(component: IPlayerComponent): void{
        this.components.push(component);
        component.onAdd(this);
    }

}
