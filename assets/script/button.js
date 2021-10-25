cc.Class({
    extends: cc.Component,

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            if (event.keyCode === cc.macro.KEY.enter || event.keyCode === cc.macro.KEY.space) cc.director.loadScene('game');
        }, this);
    },

    game() {
        cc.director.loadScene('game');
    }
});