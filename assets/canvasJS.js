//global scope variables
var debug = false; //check to write log in console if needed
var loopInterval, startTime;
var loopIsActive = false;
var cWidth;
var cHeight;
var started_at;
var lagginRate = 0;
var context;
var canvas;
var ballsSize;
var ballsNumber;
var multipleGeneration;
var ballColor;


$(document).ready(function(){

	canvas = document.querySelector("#main_canvas");
	cWidth = $(canvas).width();
	cHeight = $(canvas).height();

	if(canvas.getContext){
		context = canvas.getContext('2d');
		fetchInput(context);
		changeColor(context);
		changeBG(context);
		createCircle(context);
		initGamingLoop(120, context);

	} else {
		alert('sorry your navigator doesn\'t support canvas rendering');
	}

	function fetchInput(context){
		$('#text_input').keyup(function(e){
			var val = $(this).val();
			if(val != undefined && $(this).val().length != 0){
				context.font = "30px Arial";
				context.fillText(val, 10, 50);
			}
			if(e.keyCode == 8){
				context.clearRect(0, 0, cWidth, cHeight);
				$(this).val('');
			}
		})
	}

	function changeColor(ctx){
		$('#html5colorpicker').change(function(){
			var reg = /^([#]{1})([0-9a-zA-Z]{3,6})$/gi;
			console.log($(this).val());
			if(!$(this).val().match(reg)){
				alert('sorry, you must enter a valid hexadecimal value');
			} else {
				ctx.fillStyle = $(this).val();
				ctx.fillRect(0,0, cWidth, cHeight);
			}
		});
	}

	function changeBG(ctx){
		var button = $('#bgimage');
		var modalIsSet = false;
		button.click(function(){
			$('#modal').fadeIn(500);
			getPictures();
		});

		function getPictures(){
			var dir = "assets/images/";
			var fileextension = ".png";
			if(modalIsSet){
				$('#modal').fadeIn();
			} else {
				$.ajax({
					url: dir,
					success: function (data) {
		        	//List all .png file names in the page
		        	$(data).find("a:contains(" + fileextension + ")").each(function () {
		        		var filename = this.href.replace('http://' + window.location.host + '/canvasTPJS/', "");
		        		$("#modal").append("<img src='" + dir + filename + "'>");
		        	});
		        	$('#modal img').eac	//ballsAreCollinding(theBall, index);

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
h(function(index, value){
		        		$(value).on('click', function(){
		        			setPictures($(this));
		        		});
		        	});
		        	modalIsSet = true;
		        }
		    });
			}
		}

		function setPictures(picture){
			var path = picture.attr('src');
			var img = document.createElement('img');
			$(img).attr('src', path)
			.width(cWidth)
			.height('auto');
			ctx.clearRect(0, 0, cWidth, cHeight);
			ctx.drawImage(img, 0, 0, cWidth, cHeight);
			$('#modal').fadeOut();
		}
	}

	function createCircle(ctx){
		var radius, posx, posy;
		$('#launch_circle').click(function(){
			ctx.clearRect(0, 0, cWidth, cHeight);
			radius = $('#cradius').val();
			posy = $('#ypos').val();
			posx = $('#xpos').val();
			color = $('#colorCircle').val();
			drawCircle();
		});

		function drawCircle(){
			ctx.beginPath();
			ctx.arc(posx, posy, radius, 0 * Math.PI, 2 * Math.PI, false);
			ctx.fillStyle = color;
			ctx.fill();
		}
	}

	function initGamingLoop(frameRate, ctx){
		startGameLoop();

		function stopGameLoop(){
			$('#stop_game_instance').on('click', function(){
				loopIsActive = false;
			});
		}

		function startGameLoop() {
			$('#launch_game').on('click', function() {
				if(loopIsActive == false){
					if(debug == true){
						var date_object = new Date();
						startTime = date_object.getTime();
					}
					loopIsActive = true;
					frames = (1000 / frameRate);
					started_at = Date.now();
					setProperties();
					if(debug){
						console.log('ballsNumber at start : ' + ballsNumber + ' | '	+ 'ballsSize at start : ' + ballsSize.length);	
					}
					generateBalls();
					stopGameLoop();
				} else {
					alert('le jeu est en fonctionnement');
				}
			});
		}
	}

	function setProperties(){
		ballsNumber = $('#ballsNumber').val();
		ballsSize = $('#ballsSize').val();
		ballColor = $('#ballsColor').val();
	}

	var physcis2D = function() {
		var velocity, weight, waterfall, rigidbody, xShock, yShock;

		this.idleState = function(){
			//follow the path
		}

		this.onShock = function(){
			//on shocking must get a new direction 
		}

		this.bounceOnFloor = function(){
			//Get bouncing on spe floor
		}
	}

});