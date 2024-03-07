import PlayScene from "../../scenes/PlayScene";

export class ObstacleCacti extends Phaser.Physics.Arcade.Sprite {
    scene: PlayScene;
    constructor(scene: PlayScene, obstacleNum:number){
        super(scene, scene.gameWidth + Phaser.Math.Between(150, 300), scene.gameHeight,`obstacle-${obstacleNum}`);
    }
}