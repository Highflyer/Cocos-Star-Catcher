import Game from './game';

// Star
const { ccclass, property } = cc._decorator;

@ccclass
export default class Star extends cc.Component {
    // 星星和主角之间的距离小于这个数值时，就会完成收集
    @property pickRadius: number = 0;

    game: Game;

    // onLoad () {}

    start() {}

    update(dt: number) {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }
        // 根据 Game 脚本中的计时器更新星星的透明度
        const opacityRatio = 1 - this.game.timer / this.game.starDuration;
        const minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }

    getPlayerDistance() {
        // 根据 player 节点位置判断距离
        const playerPos = this.game.player.getPosition();
        // 根据两点位置计算两点之间距离
        const dist = this.node.position.sub(playerPos).mag();

        return dist;
    }

    onPicked() {
        // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();
        // 调用 Game 脚本的得分方法
        this.game.gainScore();
        // 然后销毁当前星星节点
        this.node.destroy();
    }
}
