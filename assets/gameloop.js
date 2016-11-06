//init game instance
var posx = 100;
var posy = 100;
var radius = 100;
var balls = [];
var direction = {};
var update_count = 0;
var update_max = 0;
var r = 0;
var g = 0;
var b = 0;

var ball = function(width, height, fillStyle, strokeStyle, lineWidth) {
	var bProperties = {};

	//position square properties
	bProperties.x = 0;
	bProperties.y = 0;
	bProperties.renderX = 0;
	bProperties.renderY = 0;
	bProperties.oldX = 0;
	bProperties.oldY = 0;
	bProperties.velocityX = 0;
	bProperties.velocityY = 0;
	bProperties.gravityX = 0.25;
	bProperties.gravityY = 0;
	bProperties.gravitySpeed = 5;

	//square properties
	bProperties.width = width;
	bProperties.height = height;
	bProperties.fillStyle = fillStyle;
	bProperties.strokeStyle = strokeStyle;
	bProperties.lineWidth = lineWidth;

	//sqare rigidBody properties, it's covering each single vector point starting_()
	bProperties.a = { x: bProperties.x, y: bProperties.y };
	bProperties.b = { x: (bProperties.x + bProperties.width), y: bProperties.y };
	bProperties.c = { x: bProperties.x, y: (bProperties.y + bProperties.height) };
	bProperties.d = { x: bProperties.b.x, y: bProperties.c.y };

	//the methode will render the block each update()
	bProperties.render = function(lagAmount, ctx){

		bProperties.renderX = (bProperties.x - bProperties.oldX) * lagAmount + bProperties.oldX;
		bProperties.renderY = (bProperties.y - bProperties.oldY) * lagAmount + bProperties.oldY;

		ctx.strokeStyle = bProperties.strokeStyle;
		ctx.lineWidth = bProperties.lineWidth;
		ctx.fillStyle = bProperties.fillStyle;
		ctx.translate(
			(bProperties.renderX + (bProperties.width / 2)),
			(bProperties.renderY + (bProperties.height / 2))
		);

		//properties for rigidbody2d colliders update()
		bProperties.a = { x: bProperties.x, y: bProperties.y };
		bProperties.b = { x: (bProperties.x + bProperties.width), y: bProperties.y };
		bProperties.c = { x: bProperties.x, y: (bProperties.y + bProperties.height) };
		bProperties.d = { x: bProperties.b.x, y: bProperties.c.y };

		//update gravity state to all blocks
		if(bProperties.velocityX != bProperties.gravitySpeed || bProperties.velocityY != bProperties.gravitySpeed) {
			(bProperties.velocityX < bProperties.gravitySpeed ) ? bProperties.velocityX += 0.01 : bProperties.velocityX -= 0.01;
			(bProperties.velocityY < bProperties.gravitySpeed ) ? bProperties.velocityY += 0.01 : bProperties.velocityY -= 0.01;
		}

		//draw the square
		ctx.beginPath();
		ctx.rect(-bProperties.width / 2, -bProperties.height / 2, bProperties.width, bProperties.height);
		ctx.fill();
		ctx.closePath();

		//console.log('old position : ' + bProperties.oldX);
		//console.log('new position : ' + bProperties.x);
		//console.log('renderx position : ' + bProperties.renderX);
		//console.log('x bound b value : ' + bProperties.b);
		bProperties.oldX = bProperties.x;
		bProperties.oldY = bProperties.y;
	}
	balls.push(bProperties);
	return bProperties;
};

var generateBalls = function() {
	ballsNumber = parseInt(ballsNumber);
	ballsSize = parseInt(ballsSize);
	if(multipleGeneration){
		var resp = confirm('do you wanna add : ' + $('#baballsNumber').val());
		if(resp) loopBalls();
	} else {
		loopBalls();
	}
	var myBall;
	function loopBalls(){
		for (var i = 0; i < ballsNumber; i++) {
			myBall = ball(ballsSize, ballsSize, ballColor, "black", 1);
			myBall.x = random(0, $('#main_canvas').width() - myBall.width);
			//console.log($('#main_canvas').width());
			myBall.y = random(0, $('#main_canvas').width() - myBall.height);
			myBall.name = 'bals_' + i;
			myBall.velocityX = 3;
			myBall.velocityY = 3;
		}
		multipleGeneration = true;
	}
	gamingLoop();
}

var gamingLoop = function() {

	requestAnimationFrame(gamingLoop);

	if(loopIsActive == false){
		if(debug == true) {
			var end_date = new Date;
			var endTime = end_date.getTime();
			console.log("Executive time :" + ( (endTime - startTime) / 1000 ) + "sec");
		}
	} else {
		var TimeStartFrame = Date.now();
		var frameSize = (TimeStartFrame - started_at);
		started_at = TimeStartFrame;
		lagginRate += frameSize;
		//console.log(lagginRate);
		while(lagginRate >= frames) {
			update_count++;
			update_max++;
			updater();
			lagginRate -= frames;
		}
		update_count = 0;
		var lagAmount = (lagginRate / frames);
		rendering(lagAmount);
	}
}

function setMove(canvasCTX){
	//console.log(posx);
	canvasCTX.fillStyle = 'white';
	canvasCTX.fillRect(0,0, $('#main_canvas').width(), $('#main_canvas').height());
	canvasCTX.beginPath();
	canvasCTX.arc(posx, posy, radius, 0 * Math.PI, 2 * Math.PI, false);
	canvasCTX.fillStyle = 'red';
	canvasCTX.fill();
}

//unused now
function checkIfMovement(){
	document.onkeypress = function(e){
		//console.log(e.key == "z");
		//console.log(posy);
		if(e.key == "z"){
			posy--;
		} else if (e.key == "s"){
			posy++;
		} else if (e.key == "d"){
			posx++;
		} else if (e.key == 'q'){
			posx--;
		}
	}
}

function updater(){
	balls.forEach(function(theBall, index) {
		ballsAreCollinding(theBall, index);
		theBall.x += theBall.velocityX;
		theBall.y += theBall.velocityY;


		if (theBall.x < 0) {
			theBall.x = 0;
			theBall.velocityX = -theBall.velocityX;
		}

		if (theBall.x + theBall.width > $('#main_canvas').width()) {
			theBall.x = $('#main_canvas').width() - theBall.width;
			theBall.velocityX = -theBall.velocityX;
		}

		if (theBall.y < 0) {
			theBall.y = 0;
			theBall.velocityY = -theBall.velocityY;
		}

		if (theBall.y + theBall.width > $('#main_canvas').height()) {
			theBall.y = $('#main_canvas').height() - theBall.width;
			theBall.velocityY = -theBall.velocityY;
		}


	});
}

function renderCollider(ball) {
	var i = 0;
	for(;i<balls.length;) {
		//make them different from each others
		if(balls.indexOf(balls[i]) != balls.indexOf(ball)) {
			//gauche
			if (false/*setcolider*/) {
				ball.velocityX = -ball.velocityX;
			}
			if(false/*switch down on other corner*/){
				ball.velocityY = -ball.velocityY;
			}
		}

		i++;
	}
}

function ballsAreCollinding(ball, index) {
	for(i = 0; i < balls.length; i++) {
		var ball2 = balls[i];
		if(balls.indexOf(ball) != balls.indexOf(ball2)) {
			//Colides
			if(leftColide(ball, ball2) && rightColide(ball, ball2) && (topColide(ball, ball2) || bottomColide(ball, ball2)) && update_count <= 1) {
				if(direction.top) {
					ball.velocityY = -ball.velocityY - ball2.gravityX;
					ball2.velocityY = -ball.velocityY + ball.gravityX;
				}
				if(direction.left){
					ball.velocityX = -ball.velocityX - ball2.gravityX;
					ball2.velocityX = -ball.velocityX + ball.gravityX;
				}
				if(debug == true){
					console.log(update_count);
					console.log("ball vX = " + ball.velocityX);
					console.log("ball vY = " + ball.velocityY);
					console.log("ball2 vX = " + ball2.velocityX);
					console.log("ball2 vY = " + ball2.velocityX);
				}
			}
		}
	}
}

function strokeLine(ball) {
	if(update_count <= 1){
		if(update_max >= 500) {
			r += random(1, 250);
			g += random(1, 250);
			b += random(1, 250);
			var l = ball.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ', 0.2)';
			(r > 249) ? r = 0 : void(0);
			(g > 249) ? g = 0 : void(0);
			(b > 249) ? b = 0 : void(0);
			update_max = 0;
		}
		context.beginPath();
		for(var i = 0; i < balls.length; i++) {
			var ball2 = balls[i];
			if(ball.name != ball2.name){
				var raycastX = Math.abs(ball.x - ball2.x);
				var raycastY = Math.abs(ball.y - ball2.y);
				if(debug == true){
					console.log(raycastY + ' : ' + raycastX);
				}
				if(raycastY < 250 && raycastX < 250) {
					//moveTo generate a new path with a head at the same position, can't use fill() with it
					//context.moveTo(ball.x + (ball.width / 2), ball.y + (ball.height / 2));
					context.lineTo(ball2.x + (ball2.width / 2), ball2.y + (ball2.height / 2));
				}	
			}
		}
		context.strokeStyle = "grey";
		context.stroke();
		context.fillStyle = l;
		context.fill();
		context.closePath();
	}
}

function leftColide(ball, ball2) {
	if(ball.b.x >= ball2.a.x) {

		direction.left = true;
		return true;
	} else {
		return false;
	}
}
function rightColide(ball, ball2) {
	if(ball.b.x <= ball2.b.x) {

		direction.left = true;
		return true;
	} else {
		return false;
	}
}
function topColide(ball, ball2) {
	if(ball.d.y >= ball2.a.y && ball.d.y <= ball2.c.y) {
		direction.top = true;
		return true;
	} else {
		return false;
	}
}
function bottomColide(ball, ball2) {
	if(ball.a.y <= ball2.c.y && ball.a.y >= ball2.a.y) {
		direction.top = true;
		return true;
	} else {
		return false;
	}
}

function rendering(lagAmount) {
	context.clearRect(0, 0, $('#main_canvas').width(), $('#main_canvas').height());
	//syntax with the optimal response time.
	var i = 0;
	for(; i < balls.length;) {
		//this will save the state of the canvas, then restor it to prevent from re-create all the state each update.
		context.save();
		balls[i].render(lagAmount, context);
		context.restore();
		strokeLine(balls[i]);
		i++;
	}
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}