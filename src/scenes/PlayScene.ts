import { CloudGroup } from "../entities/Environment/CloudGroup";
import { ObstacleGroup } from "../entities/Obstacles/ObstacleGroup";
import { Player } from "../entities/Player";
import { SpriteWithDynamicBody } from "../types";
import { GameScene } from "./GameScene";

export class PlayScene extends GameScene {

    player: Player;
    ground: Phaser.GameObjects.TileSprite;
    obstacles: ObstacleGroup;
    clouds: CloudGroup;

    startTrigger: SpriteWithDynamicBody;
    
    highScoreText: Phaser.GameObjects.Text;
    scoreText: Phaser.GameObjects.Text;
    gameOverContainer: Phaser.GameObjects.Container;
    gameOverText:  Phaser.GameObjects.Image;
    restartText:  Phaser.GameObjects.Image;

    score = 0;
    scoreInterval = 100;
    scoreDeltaTime = 0;

    spawnInterval = 1250;
    spawnTime = 0;
    gameSpeed = 10;
    gameSpeedModifier = 1;

    progressSound: Phaser.Sound.HTML5AudioSound;


    constructor() {
        super("PlayScene");
    }

    create() {
        this.createEnvironment();
        this.createPlayer();
        this.createObstacles();
        this.createGameOverContainer();
        this.createScore();

        this.progressSound = this.sound.add("progress",{volume:0.3}) as Phaser.Sound.HTML5AudioSound;

        this.handleGameStart();
        this.handleObstacleCollisions();
        this.handleGameRestart();


    }
    //#region Update Function
    update(time: number, delta: number): void {
        if(!this.isGameRunning){
            return;
        }

        this.spawnTime += delta;
        this.scoreDeltaTime += delta;

        if(this.scoreDeltaTime >= this.scoreInterval){
            this.score++;
            this.scoreDeltaTime = 0;

            if(this.score % 100 === 0){
                this.gameSpeedModifier += 0.2;
                this.progressSound.play();
                this.tweens.add({
                    targets:this.scoreText,
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

       this.scoreText.setText(score.join(""));
       
       this.ground.tilePositionX += (this.gameSpeed * this.gameSpeedModifier);
    }
    //#endregion
    //#region  Create Functions
    private createPlayer() {
        this.player = new Player(this, 0, this.gameHeight, "dino-run");
    }

    createEnvironment() {
        this.ground = this.add.tileSprite(
            0,
            this.gameHeight,
            88,
            26,
            "ground"
        )
        .setOrigin(0,1);

        this.clouds = new CloudGroup(this);
        this.clouds.setAlpha(0);
    }

    createObstacles(){
        this.obstacles = new ObstacleGroup(this.physics.world, this);
    }

    createGameOverContainer(){
        this.gameOverText = this.add.image(0,0,"game-over");
        this.restartText = this.add.image(0, 80,"restart").setInteractive();

        this.gameOverContainer = this.add
                                    .container(this.gameWidth/2, (this.gameHeight/2) - 50, [this.gameOverText, this.restartText])
                                    .setAlpha(0);
    }

    createScore(){
        this.scoreText = this.add.text(this.gameWidth, 0, "00000", {
            fontSize: 30,
            fontFamily: "Arial",
            color: "#535353",
            resolution: 5,
        })
        .setOrigin(1,0)
        .setAlpha(0);
        this.highScoreText = this.add.text(this.scoreText.getBounds().left - 20, 0, "00000", {
            fontSize: 30,
            fontFamily: "Arial",
            color: "#535353",
            resolution: 5,
        })
        .setOrigin(1,0)
        .setAlpha(0);
    }
    //#endregion

    //#region Game Handlers
    handleGameStart(){
        this.startTrigger = this.physics.add.sprite(
            0,
            10,
            null
        )
        .setAlpha(0)
        .setOrigin(0,1);

        this.physics.add.overlap(
            this.startTrigger,
            this.player,
            ()=>{
                if(this.startTrigger.y === 10){
                    this.startTrigger.body.reset(0, this.gameHeight);
                    return;
                }
                this.startTrigger.body.reset(9999, 9999);
                const rollOutEvent = this.time.addEvent({
                    delay: 1000/60,
                    loop: true,
                    callback: ()=>{
                        this.player.playRunAnimation();
                        this.player.setVelocityX(80);
                        this.ground.width += (17*2);
                        if(this.ground.width >= this.gameWidth){
                            rollOutEvent.remove();
                            this.player.setVelocityX(0);
                            this.ground.width = this.gameWidth;
                            this.clouds.setAlpha(1);
                            this.scoreText.setAlpha(1);
                            this.isGameRunning = true;
                        }
                    },
                });
            }
        );
    }

    handleObstacleCollisions(){
        this.physics.add.collider(this.player, this.obstacles, ()=>{
            this.isGameRunning = false;
            
            this.physics.pause();
            this.anims.pauseAll();
            
            this.player.die();
            this.obstacles.stopAllObstacles();
            this.gameOverContainer.setAlpha(1);

            const newHighScore = this.highScoreText.text.substring(this.highScoreText.text.length - 5);
            const newScore = Number(this.scoreText.text) > Number(newHighScore) ? this.scoreText.text : newHighScore;
            
            this.highScoreText.setText("HI "+newScore);
            this.highScoreText.setAlpha(1);

            this.spawnTime = 0;
            this.score = 0;
            this.scoreDeltaTime = 0;
            this.gameSpeedModifier = 1;
        });
    }

    handleGameRestart(){
        this.restartText.on("pointerdown", ()=>{
            this.physics.resume();
            this.player.setVelocityY(0);
            
            this.obstacles.clearAllObstacles();
            
            this.gameOverContainer.setAlpha(0);
            this.anims.resumeAll();

            this.isGameRunning = true;
        });
    }
    //#endregion

}
export default PlayScene;