import { CloudGroup } from "../entities/Environment/CloudGroup";
import { GroundTile } from "../entities/Environment/GroundTile";
import { ObstacleGroup } from "../entities/Obstacles/ObstacleGroup";
import { Player } from "../entities/Player";
import { HighScore } from "../entities/UI/HighScore";
import { Score } from "../entities/UI/Score";
import { SpriteWithDynamicBody } from "../types";
import { GameScene } from "./GameScene";

export class PlayScene extends GameScene {

    player: Player;
    obstacles: ObstacleGroup;
    
    ground: GroundTile;
    clouds: CloudGroup;

    startTrigger: SpriteWithDynamicBody;
    
    highScoreText: HighScore;
    scoreText: Score;
    
    gameOverContainer: Phaser.GameObjects.Container;
    gameOverText:  Phaser.GameObjects.Image;
    
    restartText:  Phaser.GameObjects.Image;

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
    }
    //#endregion
    //#region  Create Functions
    private createPlayer() {
        this.player = new Player(this, 0, this.gameHeight, "dino-run");
    }

    createEnvironment() {
        this.ground = new GroundTile(this);
        this.clouds = new CloudGroup(this);
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
        this.scoreText = new Score(this);
        this.highScoreText = new HighScore(this, this.scoreText.getBounds().left - 20);
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
                        this.ground.rollOutGround();
                        if(this.ground.width >= this.gameWidth){
                            rollOutEvent.remove();
                            this.player.setVelocityX(0);
                            this.ground.width = this.gameWidth;
                            this.clouds.showClouds();
                            this.scoreText.show();
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

            this.highScoreText.updateHighScore(this.scoreText.text);
            this.scoreText.reset();

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