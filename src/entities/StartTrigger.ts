import PlayScene from "../scenes/PlayScene";

export class StartTrigger extends Phaser.Physics.Arcade.Sprite {
    scene:PlayScene;
    constructor(scene:PlayScene) {
        super(
            scene,
            0,
            10,
            null
        );
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
    }
    init(){
        this.setAlpha(0)
        .setOrigin(0,1);
    }

    start(){
        if(this.y === 10){
            this.body.reset(0, this.scene.gameHeight);
            return false;
        }
        this.body.reset(9999, 9999);
        return true;
    }
}