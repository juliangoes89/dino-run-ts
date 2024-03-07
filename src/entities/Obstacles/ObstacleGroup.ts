import { PRELOAD_CONFIG } from "../..";
import { PlayScene } from "../../scenes/PlayScene";
import { SpriteWithDynamicBody } from "../../types";
import { ObstacleBird } from "./ObstacleBird";
import { ObstacleCacti } from "./ObstacleCacti";

export class ObstacleGroup extends Phaser.Physics.Arcade.Group {
    scene: PlayScene;

    constructor(world:Phaser.Physics.Arcade.World , scene: PlayScene, children?: Phaser.GameObjects.GameObject[], config?: Phaser.Types.Physics.Arcade.PhysicsGroupConfig){
        super(world, scene, children, config);
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }

    update(time: number, delta: number): void {
        if(!this.scene.isGameRunning){
            return;
        }

        if(this.scene.spawnTime >= this.scene.spawnInterval){
            this.scene.spawnTime = 0;
            this.spawnObstacle();
        }
        this.moveObstacles(this.scene.gameSpeed, this.scene.gameSpeedModifier);
        this.cleanOutOfBoundsObstacles();
    }
    spawnObstacle(){
        const obstacleCount = PRELOAD_CONFIG.cactusesCount + PRELOAD_CONFIG.birdsCount
        const obstacleNum = Math.floor(Math.random() * obstacleCount) + 1;
        
        let obstacle:Phaser.Physics.Arcade.Sprite;

        if(obstacleNum > PRELOAD_CONFIG.cactusesCount){
            const obstacleBird = new ObstacleBird(this.scene);
            obstacleBird.playFlyingAnimation();
            obstacle = obstacleBird;
        }else{
            const obstacleCacti = new ObstacleCacti(this.scene, obstacleNum);
            obstacle = obstacleCacti;
        }
        this.add(obstacle,true);
        obstacle
        .setOrigin(0,1)
        .setImmovable(true);
        
    }

    moveObstacles( gameSpeed:number , gameSpeedModifier: number){
        Phaser.Actions.IncX(this.getChildren(), -gameSpeed * gameSpeedModifier);
    }

    stopAllObstacles(){
        this.getChildren().forEach((obstacle: SpriteWithDynamicBody) => {
            if(obstacle instanceof ObstacleBird){
                obstacle.stopFlyingAnimation();
            }
        });
    }

    cleanOutOfBoundsObstacles(){
        this.getChildren().forEach((obstacle: SpriteWithDynamicBody) => {
            if(obstacle.getBounds().right < 0){
                this.remove(obstacle);
            }
        });
    }

    clearAllObstacles(){
        this.clear(true, true);
    }
}