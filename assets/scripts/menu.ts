// Menu
const { ccclass, property } = cc._decorator;

@ccclass
export default class Menu extends cc.Component {
    @property(cc.Node) startButton: cc.Node = null;

    onLoad() {
        cc.director.preloadScene('GameScene');
        this.startButton.on(cc.Node.EventType.TOUCH_START, () => {
            const fade = cc.fadeOut(0.3);
            const startPlay = cc.callFunc(() => {
                cc.director.loadScene('GameScene');
            }, this.startButton);
            this.node.runAction(cc.sequence(fade, startPlay));
        });
    }

    start() {}

    // update(dt: number) {}
}
