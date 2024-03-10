import PlayScene from "../../../scenes/PlayScene";
import { EventDispatcher } from "../../../utils/EventDispatcher";

export class Restart extends Phaser.GameObjects.Image{
    scene: PlayScene;
    emitter: EventDispatcher;
    
    constructor(scene: PlayScene){
        super(scene,
            0,
            80,
            "restart"
        )
        scene.add.existing(this);
        this.init();

    }
    
    init(){
        this.setInteractive();
        this.emitter=EventDispatcher.getInstance();
    }

    setupGameRestart(){
        this.on("pointerdown", ()=>{
            this.emitter.emit("RESET_PRESSED");
        });
    }
}