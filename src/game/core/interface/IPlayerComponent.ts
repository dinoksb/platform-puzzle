import { Player } from "../Player";

export interface IPlayerComponent {
    onAdd(player: Player): void;
    onUpdate(): void;
}
