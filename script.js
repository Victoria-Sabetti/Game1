const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//cover the screen
canvas.width = innerWidth;
canvas.height = innerHeight;

var falling = [];
var catchers = [];

var left;
var right;

var score = document.querySelector('#score');
var scoreNum = 0;

class Catcher {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
    }

    draw() {
        c.fillStyle = 'brown';
        c.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.draw();

        if (right) this.x += this.speed;
        if (left) this.x -= this.speed;

        if (this.x <0) {
            this.x = 0;
        }
        if(this.x + this.width > canvas.width) {
        this.x = canvas.width - this.width;
        }
    }
}

catchers.push(new Catcher(canvas.width/2 - 200/2, canvas.height - 30 - 10, 200, 30));
catchers.push(new Catcher(catchers[0].x, catchers[0].y - 30, 20, 30));
catchers.push(new Catcher(catchers[0].x + catchers[0].width - 20, catchers[0].y - 30, 20, 30));

class Falling {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = 'dodgerblue';
        this.yVel = 3;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 360, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.y += this.yVel;

    }
}

setInterval(() => {
    //positioning the falling balls q2sec
    var x = Math.random() * ((canvas.width - 20) -20) +20;
    falling.push(new Falling(x, -10, 20));
}, 2000);

function animation() {
    requestAnimationFrame(animation);
    c.clearRect(0, 0, canvas.width, canvas.height);

    falling.forEach((falling, index) => {
        falling.update();

        if(falling.y + falling.radius > catchers[0].y) {
            setTimeout(function () {
                falling.splice(index, 1)
            }, 0);
            }
    });

    catchers.forEach((catchers) => {
        catchers.update();
    });

    catchers[1].x = catchers[0].x;
    catchers[2].x = catchers[0].x + catchers[0].width - 20;
}
animation();

document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowLeft') {
        left = true;
    }
    if (event.key == 'ArrowRight') {
        right = true;
    }
});

document.addEventListener('keyup', () => {
    left = false;
    right = false;
});