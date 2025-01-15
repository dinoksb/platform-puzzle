import { PreloaderScene } from "./scenes/PreloaderScene";
import { LevelSelectScene } from "./scenes/LevelSelectScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { GameScene } from "./scenes/GameScene";
import Phaser from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    title: "PLATFORM_PUZZLE",
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    parent: "game-container",
    backgroundColor: "#0x444444",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 300 },
            debug: true,
        },
    },
    scene: [PreloaderScene, MainMenuScene, LevelSelectScene, GameScene],
};

const StartGame = (parent: string) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;
