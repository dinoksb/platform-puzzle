import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { MainMenuScene } from "./game/scenes/MainMenuScene";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const changeScene = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenuScene;

            if (scene) {
                scene.changeScene();
            }
        }
    };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            <div>
                <button className="button" onClick={changeScene}>
                    Change Scene
                </button>
            </div>
        </div>
    );
}

export default App;
