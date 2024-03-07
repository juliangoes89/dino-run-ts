import PlayScene from "../../scenes/PlayScene";

export class GroundTile extends Phaser.GameObjects.TileSprite{
    scene: PlayScene;

    constructor(scene: PlayScene){
        super(scene,0,scene.gameHeight,88,26, 'ground');
        scene.add.existing(this);
        this.init();
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }
    init(){
        this.setOrigin(0, 1);
    }
    update(): void {
        if(!this.scene.isGameRunning){
            return;
        }
        this.moveScrollGround();
    }

    moveScrollGround(){
        this.tilePositionX += (this.scene.gameSpeed * this.scene.gameSpeedModifier);
    }
    
    rollOutGround(){
        this.width += (17*2);
    }
}