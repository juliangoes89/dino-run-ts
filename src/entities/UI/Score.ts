import PlayScene from "../../scenes/PlayScene";

export class Score extends Phaser.GameObjects.Text{
    scene: PlayScene;

    score = 0;
    scoreInterval = 100;
    scoreDeltaTime = 0;

    constructor(scene: PlayScene){
        super(scene,
            scene.gameWidth, 
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
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }

    init(){
        this.setOrigin(1,0)
        .setAlpha(0);
    }

    update(time: number, delta: number): void {
        if(!this.scene.isGameRunning){
            return;
        }
        this.scoreDeltaTime += delta;

        if(this.scoreDeltaTime >= this.scoreInterval){
            this.score++;
            this.scoreDeltaTime = 0;

            if(this.score % 100 === 0){
                this.scene.gameSpeedModifier += 0.2;
                this.scene.progressSound.play();
                this.scene.tweens.add({
                    targets:this,
                    duration: 100,
                    repeat: 3,
                    alpha: 0,
                    yoyo: true,
                });
            }
        }

       const score = Array.from(String(this.score), Number);

       for(let i = 0; i < 5 - String(this.score).length; i++){
           score.unshift(0);
       }

       this.setText(score.join(""));
    }

    reset(){
        this.score = 0;
        this.scoreDeltaTime = 0;
    }
    
    hide(){
        this.setAlpha(0);
    }
    
    show(){
        this.setAlpha(1);
    }

}