cc.Class({
    extends: cc.Component,

    properties: {
        status: {
            default: null,
            type: cc.Node
        },
        score: {
            default: null,
            type: cc.Node
        },
        win: {
            default: null,
            type: cc.AudioClip
        },
        losing: {
            default: null,
            type: cc.AudioClip
        }
    },

    onLoad() {
        const persist = cc.find('Persist');
        cc.game.removePersistRootNode(persist);
        this.status.getComponent(cc.Label).string = persist.getComponent('persist').status;
        this.score.getComponent(cc.Label).string = 'Score: ' + persist.getComponent('persist').score;
        switch (persist.getComponent('persist').status) {
            case 'YOU WON':
                cc.audioEngine.play(this.win, false, 1);
                break;
            case 'YOU LOSE':
                cc.audioEngine.play(this.losing, false, 1);
                break;
        }
        const timeout = setTimeout(() => cc.game.restart(), 5000);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            if (event.keyCode === cc.macro.KEY.enter || event.keyCode === cc.macro.KEY.space) {
                clearTimeout(timeout);
                cc.game.restart();
            }
        }, this);
    }
});