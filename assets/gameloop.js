//init game instance
	var posx = 100;
	var posy = 100;
	var radius = 100;
	var balls = [];

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
		bProperties.VelocityY = 0;
		bProperties.gravityX = 0;
		bProperties.gravityY = 0;

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

			ctx.beginPath();
		    ctx.rect(-bProperties.width / 2, -bProperties.height / 2, bProperties.width, bProperties.height);
		    ctx.stroke();
		    ctx.fill();

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
			    myBall.velocityX = random(2, 5);
			    myBall.VelocityY = random(2, 5);
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
				updater();
				lagginRate -= frames;
			}
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
			theBall.x += theBall.velocityX;
			theBall.y += theBall.VelocityY;

			
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
				theBall.VelocityY = -theBall.VelocityY;
			}

			if (theBall.y + theBall.width > $('#main_canvas').height()) {
				theBall.y = $('#main_canvas').height() - theBall.width;
				theBall.VelocityY = -theBall.VelocityY;
			}

			ballsAreCollinding(theBall, index);
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
					ball.velocityY = -ball.VelocityY;
				}
			}

			i++;
		}
	}

	function rendering(lagAmount) {
		context.clearRect(0, 0, $('#main_canvas').width(), $('#main_canvas').height());
		//syntax with the optimal response time.
		var i = 0;
		for(; i < balls.length;){
			//this will save the state of the canvas, then restor it to prevent from re-create all the state each update.
			context.save();
			balls[i].render(lagAmount, context);
			context.restore();
			i++;
		}
	}

	function random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function ballsAreCollinding(ball, index) {	
		for(i = 0; i < balls.length; i++) {
			var otherBall = balls[i];
			if(index != i) {
				//left collide
				if(ball.a.x < balls[i].b.x && ball.b.x > balls[i].a.x){
					console.log(ball.velocityX);
					ball.velocityX = -ball.velocityX;
				}
			}
		}
	}