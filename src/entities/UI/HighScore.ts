import PlayScene from "../../scenes/PlayScene";

export class HighScore extends Phaser.GameObjects.Text{
    scene: PlayScene;

    constructor(scene: PlayScene, x:number){
        super(scene,
            x, 
            0, 
            "00000", 
            {
                fontSize: 30,
                fontFamily: "Arial",
                color: "#535353",
                resolution: 5,
            }
        )
        scene.add.existing(this);
        this.init();
        //this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }

    getHighScoreValue():string{
        return this.text.substring(this.text.length - 5);
    }

    updateHighScore(currentScore:string){
        const newHighScore = this.getHighScoreValue();
        const newScore = Number(currentScore) > Number(newHighScore) ? currentScore : newHighScore;
        this.setText("HI "+newScore);
        this.show();
    }

    init(){
        this.setOrigin(1,0)
        .setAlpha(0);
    }

    hide(){
        this.setAlpha(0);
    }
    
    show(){
        this.setAlpha(1);
    }
}