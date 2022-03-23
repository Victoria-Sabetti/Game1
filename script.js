const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const colors = ["dodgerblue", "fuchsia", "gainsboro", "khaki", "White"];


var playing = false;
function play_audio() {
	if(playing) {
		 document.getElementById("myAudio").pause();
		 playing=false;
	} else {		
		document.getElementById("myAudio").play();
		playing = true;
	}
}

  //cover the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var falling = [];
var catchers = [];

var left;
var right;

var lblScore = document.querySelector('#score');
var lblLives = document.querySelector('#life');
var lblLevel = document.querySelector('#level');
var scoreNum = 0;
var lifeNum = 3;
lblLives.innerHTML = lifeNum.toString();
var level = 1;
const LEVEL_BALLS = 10;

class Catcher {
    static color = 'brown'
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 20;
    }

    draw() {
        c.fillStyle = Catcher.color;
        c.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.draw();

        if (right) this.x += this.speed;
        if (left) this.x -= this.speed;

        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    }
}

catchers.push(new Catcher(canvas.width / 2 - 200 / 2, canvas.height - 30 - 10, 200, 30));
catchers.push(new Catcher(catchers[0].x, catchers[0].y - 30, 20, 30));
catchers.push(new Catcher(catchers[0].x + catchers[0].width - 20, catchers[0].y - 30, 20, 30));

class Falling {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius
        this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        //make sure color length is 7, otherwise it doesn't work
        while (this.color.length != 7) {
            this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
        this.yVel = level + 2;
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

var create = setInterval(() => {
    //positioning the falling balls q2sec
    var x = Math.random() * ((canvas.width - 20) - 20) + 20;
    falling.push(new Falling(x, -10, 20));

}, 2000);

function animation() {
    requestAnimationFrame(animation);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < falling.length; i++) {
        falling[i].update();

        if (falling[i].y + falling[i].radius > catchers[0].y &&
            catchers[0].x <= falling[i].x + falling[i].radius &&
            falling[i].x - falling[i].radius <= catchers[0].x + catchers[0].width) {
            Catcher.color = falling[i].color;
            falling.splice(i, 1);
            catchers.forEach((catchers) => {
                catchers.update();
            });
            scoreNum++;
            lblScore.innerHTML = scoreNum.toString();
            if (scoreNum % LEVEL_BALLS == 0) {
                level++;
                lblLevel.innerHTML = level.toString();
            }

        } else if (falling[i].y - falling[i].radius > catchers[0].y) {
            lifeNum--;
            lblLives.innerHTML = lifeNum.toString();
            if (lifeNum == 0) {
                //falling.splice(i, 1);
                clearInterval(create);
                lblScore.innerHTML += " GAME OVER!";
                alert("GAME OVER!");
            } else {
                alert("You have lost 1 life!");
            }
            falling.splice(0, falling.length);
        }
    }


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