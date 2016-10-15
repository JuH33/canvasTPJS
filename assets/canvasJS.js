

$(document).ready(function(){

var canvas = document.querySelector("#main_canvas");
var cWidth = $(canvas).width();
var cHeight = $(canvas).height();

if(canvas.getContext){
	var context = canvas.getContext('2d');
	fetchInput(context);
	changeColor(context);
	changeBG(context);
	createCircle(context);

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
		            	var filename = this.href.replace(window.location.host, "").replace('http:///canvasJS/', '');
		            	$("#modal").append("<img src='" + dir + filename + "'>");
		        	});
		        	$('#modal img').each(function(index, value){
		            	console.log($(value));
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
	var width, height, posx, posy;
	$('#launch_circle').click(function(){
		width = $('cWidth').val();
		height = $('cHeight').val();
		posy = $('posy').val();
		posx = $('posx').val();
		drawCircle();
	});

	function drawCircle(){
		ctx.arc(posx, posy, 50, width, height, false);
	}
}

});