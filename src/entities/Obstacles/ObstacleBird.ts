import { PlayScene } from "../../scenes/PlayScene";

export class ObstacleBird extends Phaser.Physics.Arcade.Sprite {
    scene: PlayScene;

    constructor(scene: PlayScene){
        const enemyPossibleHeights = [20,70];
        const enemyHeight = enemyPossibleHeights[Math.floor(Math.random() * enemyPossibleHeights.length)];
        super(scene, scene.gameWidth + Phaser.Math.Between(150, 300), scene.gameHeight - enemyHeight, `enemy-bird`);
        this.init();
    }

    init(){
        this.createAnimations();
    }

    createAnimations(){
        this.anims.create({
            key:"enemy-bird-fly",
            frames: this.anims.generateFrameNumbers("enemy-bird"),
            frameRate:6,
            repeat: -1,
        });
    }

    playFlyingAnimation(){
        this.play("enemy-bird-fly", true);
    }

    stopFlyingAnimation(){
        this.stop();
    }

}