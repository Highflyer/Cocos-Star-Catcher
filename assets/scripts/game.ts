// Game
const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    // 这个属性引用了星星预制资源
    @property(cc.Prefab) starPrefab: cc.Prefab = null;
    // 星星产生后消失时间的随机范围
    @property minStarDuration: number = 0;
    @property maxStarDuration: number = 0;

    // 地面节点，用于确定星星生成的高度
    @property(cc.Node) ground: cc.Node = null;
    // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    @property(cc.Node) player: cc.Node = null;
    // 得分显示标签
    @property(cc.Label) scoreDisplay: cc.Label = null;
    // 得分音效资源
    @property({ type: cc.AudioClip })
    scoreAudio: cc.AudioClip = null;

    groundY: number;
    score: number;
    timer: number;
    starDuration: number;

    onLoad() {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // 生成一个新的星星
        this.spawnNewStar();
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 生成一个新的星星
        this.spawnNewStar();
        // 初始化计分
        this.score = 0;
    }

    start() {}

    update(dt: number) {
        // 每帧更新计时器，超过限度还没有生成新的星星就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    spawnNewStar() {
        // 使用给定的模板在场景中生成一个新节点
        const newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 在星星组件上暂存 Game 对象的引用
        newStar.getComponent('Star').game = this;
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    getNewStarPosition(): number | cc.Vec2 | cc.Vec3 {
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        const maxX = this.node.width / 2;
        const randX = (Math.random() - 0.5) * 2 * maxX;

        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        const randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;

        // 返回星星坐标
        return cc.v2(randX, randY);
    }

    gainScore() {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'SCORE : ' + this.score;
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    gameOver() {
        // 停止 player 节点的跳跃动作
        this.player.stopAllActions();
        cc.director.loadScene('MenuScene');
    }
}
