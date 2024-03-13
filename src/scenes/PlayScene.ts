import { CloudGroup } from "../entities/Environment/CloudGroup";
import { GroundTile } from "../entities/Environment/GroundTile";
import { ObstacleGroup } from "../entities/Obstacles/ObstacleGroup";
import { Player } from "../entities/Player";
import { StartTrigger } from "../entities/StartTrigger";
import { GameOverContainer } from "../entities/UI/GameOver/GameOverContainer";
import { HighScore } from "../entities/UI/HighScore";
import { Score } from "../entities/UI/Score";
import { SpriteWithDynamicBody } from "../types";
import { EventDispatcher } from "../utils/EventDispatcher";
import { GameScene } from "./GameScene";

export class PlayScene extends GameScene {

    // Game Objects 
    player: Player;
    obstacles: ObstacleGroup;
    
    // Environment
    ground: GroundTile;
    clouds: CloudGroup;

    startTrigger: StartTrigger;
    
    // UI
    highScoreText: HighScore;
    scoreText: Score;
    gameOverContainer: GameOverContainer;

    // Game Variables
    gameSpeed = 10;
    gameSpeedModifier = 1;

    // Sounds
    progressSound: Phaser.Sound.HTML5AudioSound;

    // Game State Management
    emitter: EventDispatcher;
    rollOutEvent: Phaser.Time.TimerEvent;


    constructor() {
        super("PlayScene");
    }

    create() {
        this.createEventEmitter();
        this.createEnvironment();
        this.createPlayer();
        this.createObstacles();
        this.createGameOverContainer();
        this.createScore();
        this.createSounds();

        this.setEventListeners();

        this.handleGameStart();
        this.handleObstacleCollisions();

    }
    //#region Update Function
    update(time: number, delta: number): void {
        if(!this.isGameRunning){
            return;
        }
    }
    //#endregion
    //#region  Create Functions
    createEventEmitter(){
        this.emitter=EventDispatcher.getInstance();
    }

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
        this.gameOverContainer = new GameOverContainer(this);
    }

    createScore(){
        this.scoreText = new Score(this);
        this.highScoreText = new HighScore(this, this.scoreText.getBounds().left - 20);
    }

    createSounds(){
        this.progressSound = this.sound.add("progress",{volume:0.3}) as Phaser.Sound.HTML5AudioSound;
    }
    //#endregion
    //#region Listeners
    setEventListeners(){
        this.emitter.on("RESET_PRESSED", this.handleGameRestartEvent, this);
    }
    //#endregion
    //#region Game Handlers
    handleGameStart(){
        this.startTrigger = new StartTrigger(this);
        this.physics.add.overlap(
            this.startTrigger,
            this.player,
            ()=>{
                const startGame = this.startTrigger.start();
                if(startGame){
                    this.rollOutEvent = this.time.addEvent({
                        delay: 1000/60,
                        loop: true,
                        callback: this.rollOutEventCallback.bind(this),
                    });
                }
            }
        );
    }

    rollOutEventCallback(){
        this.player.playRunAnimation();
        this.player.setVelocityX(80);
        this.ground.rollOutGround();
        if(this.ground.width >= this.gameWidth){
            this.rollOutEvent.remove();
            this.player.setVelocityX(0);
            this.ground.width = this.gameWidth;
            this.clouds.showClouds();
            this.scoreText.show();
            this.isGameRunning = true;
        }
    }

    handleObstacleCollisions(){
        this.physics.add.collider(this.player, this.obstacles, ()=>{
            this.isGameRunning = false;
            
            this.physics.pause();
            this.anims.pauseAll();
            
            this.player.die();
            this.obstacles.stopAllObstacles();
            
            this.gameOverContainer.show();

            this.highScoreText.updateHighScore(this.scoreText.text);
            this.scoreText.reset();

            this.gameSpeedModifier = 1;
        });
    }

    handleGameRestartEvent(){
        this.physics.resume();
        this.player.setVelocityY(0);

        this.obstacles.clearAllObstacles();
        
        this.gameOverContainer.setAlpha(0);
        this.anims.resumeAll();

        this.isGameRunning = true;
    }
    //#endregion

}
export default PlayScene;