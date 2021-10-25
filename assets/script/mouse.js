cc.Class({
    extends: cc.Component,

    properties: {
        obstacles: {
            default: null,
            type: cc.Node
        },
        food: {
            default: null,
            type: cc.Node
        },
        cats: {
            default: null,
            type: cc.Node
        },
        score: {
            default: null,
            type: cc.Node
        },
        theme: {
            default: null,
            type: cc.AudioClip
        },
        countdown: {
            default: null,
            type: cc.AudioClip
        },
        whistle: {
            default: null,
            type: cc.AudioClip
        },
        crunch: {
            default: null,
            type: cc.AudioClip
        },
        fart: {
            default: null,
            type: cc.AudioClip
        },
        scream: {
            default: null,
            type: cc.AudioClip
        }
    },

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            switch (event.keyCode) {
                case cc.macro.KEY.left:
                    this.direction.new = 'left';
                    break;
                case cc.macro.KEY.right:
                    this.direction.new = 'right';
                    break;
                case cc.macro.KEY.down:
                    this.direction.new = 'down';
                    break;
                case cc.macro.KEY.up:
                    this.direction.new = 'up';
                    break;
            }
        }, this);
        const countdown =  cc.audioEngine.play(this.countdown, false, 1);
        cc.audioEngine.setFinishCallback(countdown, () => {
            const whistle = cc.audioEngine.play(this.whistle, false, 1);
            this.go = true;
            for (const cat of this.cats.children) {
                cat.getComponent('cat').go = true;
            }
            cc.audioEngine.setFinishCallback(whistle, () => {
                cc.audioEngine.play(this.theme, true, 1);
            });
        });
    },

    start() {
        this.direction = {
            now: null,
            new: null
        };
        this.speed = 1.5;
        this.scoring = 0;
        this.factor = 1;
        this.status = null;
        this.go = false;
    },

    update() {
        if (this.direction.new !== this.direction.now && this.checkDirection(this.direction.new)) {
            this.step(this.direction.new, true);
            this.direction.now = this.direction.new;
            this.direction.new = null;
        } else if (this.checkDirection(this.direction.now)) {
            this.step(this.direction.now);
        }
        this.score.getComponent(cc.Label).string = 'Score: ' + this.scoring;
    },

    checkDirection(direction) {
        if (this.go) {
            switch (direction) {
                case 'left':
                    return !this.obstacles.children.some(obstacle =>
                        obstacle.getBoundingBox().contains(cc.v2(this.node.x - this.node.width / 2 - 0.2, this.node.y - this.node.height / 2 + 0.2))
                        ||
                        obstacle.getBoundingBox().contains(cc.v2(this.node.x - this.node.width / 2 - 0.2, this.node.y + this.node.height / 2 - 0.2))
                    )
                case 'right':
                    return !this.obstacles.children.some(obstacle =>
                        obstacle.getBoundingBox().contains(cc.v2(this.node.x + this.node.width / 2 + 0.2, this.node.y - this.node.height / 2 + 0.2))
                        ||
                        obstacle.getBoundingBox().contains(cc.v2(this.node.x + this.node.width / 2 + 0.2, this.node.y + this.node.height / 2 - 0.2))
                    )
                case 'down':
                    return !this.obstacles.children.some(obstacle =>
                        obstacle.getBoundingBox().contains(cc.v2(this.node.x - this.node.width / 2 + 0.2, this.node.y - this.node.height / 2 - 0.2))
                        ||
                        obstacle.getBoundingBox().contains(cc.v2(this.node.x + this.node.width / 2 - 0.2, this.node.y - this.node.height / 2 - 0.2))
                    )
                case 'up':
                    return !this.obstacles.children.some(obstacle =>
                        obstacle.getBoundingBox().contains(cc.v2(this.node.x - this.node.width / 2 + 0.2, this.node.y + this.node.height / 2 + 0.2))
                        ||
                        obstacle.getBoundingBox().contains(cc.v2(this.node.x + this.node.width / 2 - 0.2, this.node.y + this.node.height / 2 + 0.2))
                    )
            }
        }
    },

    step(direction, angle) {
        if (this.go) {
            switch (direction) {
                case 'left':
                    this.node.x -= this.speed;
                    if (angle) {
                        if (this.node.angle === 0 && this.direction.now) this.node.x += 0.1;
                        this.node.angle = 180;
                        this.node.x += 0.1;
                        this.node.y = Math.round(this.node.y);
                    }
                    break;
                case 'right':
                    this.node.x += this.speed;
                    if (angle) {
                        if (this.node.angle === 180) this.node.x -= 0.1;
                        this.node.angle = 0;
                        this.node.x -= 0.1;
                        this.node.y = Math.round(this.node.y);
                    }
                    break;
                case 'down':
                    this.node.y -= this.speed;
                    if (angle) {
                        if (this.node.angle === 90) this.node.y += 0.1;
                        this.node.angle = 270;
                        this.node.y += 0.1;
                        this.node.x = Math.round(this.node.x);
                    }
                    break;
                case 'up':
                    this.node.y += this.speed;
                    if (angle) {
                        if (this.node.angle === 270) this.node.y -= 0.1;
                        this.node.angle = 90;
                        this.node.y -= 0.1;
                        this.node.x = Math.round(this.node.x);
                    }
                    break;
            }
        }
    },

    onCollisionEnter(other) {
        switch (other.getComponent(cc.Sprite).spriteFrame.name) {
            case 'cookie':
                this.scoring += 10;
                other.node.destroy();
                cc.audioEngine.play(this.crunch, false, 1);
                if (this.food.children.length === 1) {
                    this.status = 'YOU WON';
                    cc.audioEngine.stopAll();
                }
                break;
            case 'cheese':
                this.scoring += 60;
                other.node.destroy();
                cc.audioEngine.play(this.fart, false, 1);
                if (this.food.children.length === 1) {
                    this.status = 'YOU WON';
                    cc.audioEngine.stopAll();
                }
                for (const cat of this.cats.children) {
                    if (!cat.getComponent('cat').status) {
                        cat.getComponent('cat').status = 'scared';
                        cat.getComponent('cat').speed = 0.75;
                        switch (cat.getComponent('cat').direction.now) {
                            case 'left':
                                cat.getComponent('cat').direction.now = 'right';
                                cat.getComponent('cat').direction.back = 'left';
                                break;
                            case 'right':
                                cat.getComponent('cat').direction.now = 'left';
                                cat.getComponent('cat').direction.back = 'right';
                                break;
                            case 'up':
                                cat.getComponent('cat').direction.now = 'down';
                                cat.getComponent('cat').direction.back = 'up';
                                break;
                            case 'down':
                                cat.getComponent('cat').direction.now = 'up';
                                cat.getComponent('cat').direction.back = 'down';
                                break;
                        }
                        cc.tween(cat)
                            .target(cat)
                            .to(0, {color: new cc.Color(255, 255, 255)})
                            .delay(2)
                            .to(0, {color: cat.getComponent('cat').color})
                            .delay(0.5)
                            .to(0, {color: new cc.Color(255, 255, 255)})
                            .delay(0.5)
                            .to(0, {color: cat.getComponent('cat').color})
                            .delay(0.5)
                            .to(0, {color: new cc.Color(255, 255, 255)})
                            .delay(0.5)
                            .to(0, {color: cat.getComponent('cat').color})
                            .delay(0.25)
                            .to(0, {color: new cc.Color(255, 255, 255)})
                            .delay(0.25)
                            .to(0, {color: cat.getComponent('cat').color})
                            .delay(0.25)
                            .to(0, {color: new cc.Color(255, 255, 255)})
                            .delay(0.25)
                            .to(0, {color: cat.getComponent('cat').color})
                            .call(() => {
                                this.factor = 1;
                                cat.getComponent('cat').speed = 1.5;
                                cat.getComponent('cat').status = null;
                                if (cat.name === 'cat-chaser') {
                                    cat.getComponent('cat').direction.now = null;
                                    cat.getComponent('cat').direction.back = null;
                                }
                            })
                            .start()
                    }
                }
                break;
            case 'cat':
                switch (other.getComponent('cat').status) {
                    case 'scared':
                        this.scoring += 500 * this.factor++;
                        cc.audioEngine.play(this.scream, false, 1);
                        cc.Tween.stopAllByTarget(other.node);
                        other.node.color = new cc.Color(255, 255, 255);
                        other.getComponent('cat').speed = 3;
                        other.getComponent('cat').status = 'beaten';
                        other.getComponent('cat').direction.now = null;
                        other.getComponent('cat').direction.back = null;
                        if (other.node.x % other.getComponent('cat').speed !== 0) other.node.x -= other.node.x % other.getComponent('cat').speed;
                        if (other.node.y % other.getComponent('cat').speed !== 0) other.node.y -= other.node.y % other.getComponent('cat').speed;
                        break;
                    case null:
                        this.status = 'YOU LOSE';
                        cc.audioEngine.stopAll();
                        break;
                }
                break;
            case 'gate':
                switch (other.node.x) {
                    case 45:
                        this.node.x += 16 * this.node.width;
                        break;
                    case 585:
                        this.node.x -= 16 * this.node.width;
                        break;
                }
                break;
        }
    }
});