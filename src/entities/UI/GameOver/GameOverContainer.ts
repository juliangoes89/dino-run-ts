import PlayScene from "../../../scenes/PlayScene";
import { GameOver } from "./GameOver";
import { Restart } from "./Restart";

export class GameOverContainer extends Phaser.GameObjects.Container{
    scene: PlayScene;
    restart: Restart;
    gameOver: GameOver;

    constructor(scene: PlayScene){
        super(scene, scene.gameWidth/2, (scene.gameHeight/2) - 50);
        scene.add.existing(this);
        this.gameOver = new GameOver(scene);
        this.restart = new Restart(scene);
        this.add(this.restart);
        this.add(this.gameOver);
        this.init();
    }

    init(){
        this.setAlpha(0);
        this.setupRestartGameEvent();
    }

    setupRestartGameEvent(){
        this.restart.setupGameRestart();
    };

    show(){
        this.setAlpha(1);
    }
    
    hide(){
        this.setAlpha(0);
    }
}