import { Preloader } from "./scenes/Preloader"
import { MainMenu } from "./scenes/MainMenu";
import { Game } from "./scenes/Game";
import Phaser from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    title: "PLATFORM_PUZZLE",
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#0x444444",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physic: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: true,
        },
    },
    scene: [Preloader, MainMenu, Game],
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;