import PlayScene from "../../scenes/PlayScene";
import { SpriteWithDynamicBody } from "../../types";

export class CloudGroup extends Phaser.GameObjects.Group {
    scene: PlayScene;
    constructor(scene: PlayScene, children?: Phaser.GameObjects.GameObject[], config?: Phaser.Types.Physics.Arcade.PhysicsGroupConfig){
        super(scene, children, config);
        this.init();
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }
    init(){
        this.createClouds();
    }
    update(){
        
        if(!this.scene.isGameRunning){
            return;
        }

        this.moveClouds();
        this.rotateClouds();
    }
    moveClouds(){
        Phaser.Actions.IncX(this.getChildren(), -0.5);
    }
    rotateClouds(){
        this.getChildren().forEach((cloud: SpriteWithDynamicBody) => {
            if(cloud.getBounds().right < 0){
                    cloud.x = this.scene.gameWidth + 30;
                }
        });
    }
    createClouds(){
        this.addMultiple([
            this.scene.add.image(this.scene.gameWidth/2, 170, "cloud"),
            this.scene.add.image(this.scene.gameWidth - 80, 80, "cloud"),
            this.scene.add.image(this.scene.gameWidth/1.3, 100, "cloud")
        ]);
    };
}