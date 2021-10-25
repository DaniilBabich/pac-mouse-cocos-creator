cc.Class({
    extends: cc.Component,

    properties: {
        mouse: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    },

    start() {
        this.status = null;
        this.score = 0;
    },

    update() {
        if (cc.director.getScene().name === 'game') {
            if (this.mouse.getComponent('mouse').status) {
                this.status = this.mouse.getComponent('mouse').status;
                this.score = this.mouse.getComponent('mouse').scoring;
                this.mouse.getComponent('mouse').status = null;
                cc.director.loadScene('result');
            }
        }
    }
});