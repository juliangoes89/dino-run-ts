import PlayScene from "../../../scenes/PlayScene";

export class GameOver extends Phaser.GameObjects.Image{
    scene: PlayScene;
    constructor(scene: PlayScene){
        super(scene,
            0,
            0,
            "game-over"
        )
        scene.add.existing(this);
        
    }
}