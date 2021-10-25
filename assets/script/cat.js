cc.Class({
    extends: cc.Component,

    properties: {
        obstacles: {
            default: null,
            type: cc.Node
        },
        mouse: {
            default: null,
            type: cc.Node
        }
    },

    start() {
        this.direction = {
            now: null,
            back: null
        };
        this.speed = 1.5;
        this.color = this.node.color;
        this.respawn = cc.v2(315, 345);
        this.status = null;
        this.go = false;
        this.checkDirection = this.mouse.getComponent('mouse').checkDirection.bind(this);
        this.step = this.mouse.getComponent('mouse').step.bind(this);
    },

    update() {
        const directions = [];
        if (this.checkDirection('left')) directions.push('left');
        if (this.checkDirection('right')) directions.push('right');
        if (this.checkDirection('down')) directions.push('down');
        if (this.checkDirection('up')) directions.push('up');
        if (this.direction.back && directions.length > 1) {
            directions.splice(directions.findIndex(direction => direction === this.direction.back), 1)
        }
        if (this.status === 'beaten') {
            if (
                this.node.x === this.respawn.x
                &&
                this.node.y === this.respawn.y
            ) {
                this.speed = 1.5;
                this.node.color = this.color;
                this.status = null;
                if (this.node.name === 'cat-chaser') {
                    this.direction.now = null;
                    this.direction.back = null;
                }
            } else this.chaserDirection(directions, this.respawn);
        } else if (this.status === 'scared') {
            this.randomDirection(directions);
        } else if (this.node.name === 'cat-chaser') {
            this.chaserDirection(directions, this.mouse);
        } else this.randomDirection(directions);
        this.step(this.direction.now);
        this.backDirection(this.direction.now);
    },

    chaserDirection(directions, target) {
        if (directions.length > 1) {
            const differenceX = target.x - this.node.x;
            const differenceY = target.y - this.node.y;
            if (Math.abs(differenceX) > Math.abs(differenceY) && differenceX < 0) {
                if (directions.some(direction => direction === 'left')) this.direction.now = 'left';
                else if (directions.some(direction => direction === 'down') && differenceY <= 0) this.direction.now = 'down';
                else if (directions.some(direction => direction === 'up') && differenceY >= 0) this.direction.now = 'up';
                else if (!this.direction.now) this.direction.now = 'right';
            } else if (Math.abs(differenceX) > Math.abs(differenceY) && differenceX > 0) {
                if (directions.some(direction => direction === 'right')) this.direction.now = 'right';
                else if (directions.some(direction => direction === 'down') && differenceY <= 0) this.direction.now = 'down';
                else if (directions.some(direction => direction === 'up') && differenceY >= 0) this.direction.now = 'up';
                else if (!this.direction.now) this.direction.now = 'left';
            } else if (Math.abs(differenceY) > Math.abs(differenceX) && differenceY < 0) {
                if (directions.some(direction => direction === 'down')) this.direction.now = 'down';
                else if (directions.some(direction => direction === 'left') && differenceX <= 0) this.direction.now = 'left';
                else if (directions.some(direction => direction === 'right') && differenceX >= 0) this.direction.now = 'right';
                else if (!this.direction.now) this.direction.now = 'up';
            } else if (Math.abs(differenceY) > Math.abs(differenceX) && differenceY > 0) {
                if (directions.some(direction => direction === 'up')) this.direction.now = 'up';
                else if (directions.some(direction => direction === 'left') && differenceX <= 0) this.direction.now = 'left';
                else if (directions.some(direction => direction === 'right') && differenceX >= 0) this.direction.now = 'right';
                else if (!this.direction.now) this.direction.now = 'down';
            }
        } else this.direction.now = directions[0];
    },

    randomDirection(directions) {
        this.direction.now = directions[Math.floor(Math.random() * directions.length)];
    },

    backDirection() {
        switch (this.direction.now) {
            case 'left':
                this.direction.back = 'right';
                break;
            case 'right':
                this.direction.back = 'left';
                break;
            case 'up':
                this.direction.back = 'down';
                break;
            case 'down':
                this.direction.back = 'up';
                break;
        }
    }
});