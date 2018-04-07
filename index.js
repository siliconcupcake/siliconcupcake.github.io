var i = 0;
var j = 0;
var k = 0;
var speed = 100;
var bash_history = [];

var txt = 'cat about_me.txt';
var contact_info = 'SYNOPSIS:<br>&emsp;contact [OPTION]<br><br>-m, --mail<br>&emsp;send me a mail<br><br>-t, --twitter<br>&emsp;visit my twitter page<br><br>-fb, --facebook<br>&emsp;visit my facebook profile<br><br>-lin, --linkedin<br>&emsp;visit my linkedin page'
var credits = 'Please refresh to begin another session.';
var love = 'Made with ❤ by Nandha Kishore';
var url_t = 'https://twitter.com/nandhakishorej';
var url_fb = 'https://www.facebook.com/profile.php?id=100006145142052';
var url_lin = 'https://www.linkedin.com/in/nandha-kishore-j';
var url_git = 'https://github.com/siliconCupcake';
var url_m = 'mailto:jnandhakishore12@gmail.com';
var bootup = 'Configuring ISA PNP,Setting system time from the hardware clock (localtime),Using /etc/random-seed to initialise /dev/urandom,Initialising basic system settings,Updating shared libraries,INIT: entering runlevel: 4,Starting system logger,Initialising advanced hardware,Setting up modules,Initialising network,Setting up localhost,Setting up inet1,Setting up fancy console,Logging you in'.split(',');

var optionsDiv = document.getElementsByClassName("options");
var startBoot;
var command;

window.onload = matrixAnim;

function beginSplash() {
	document.getElementById("splash").style.display = "block";
	startBoot = setInterval(bootSequence, 200);
}

function matrixAnim() {
	var c = document.getElementById("c");
	var ctx = c.getContext("2d");

	//making the canvas full screen
	c.height = window.innerHeight;
	c.width = window.innerWidth;

	//chinese characters - taken from the unicode charset
	var binary = "10";
	//converting the string into an array of single characters
	binary = binary.split("");

	var font_size = 10;
	var columns = c.width/font_size; //number of columns for the rain
	//an array of drops - one per column
	var drops = [];
	//x below is the x coordinate
	//1 = y co-ordinate of the drop(same for every drop initially)
	for(var x = 0; x < columns; ){
	   drops[x] = 1; 
	   x+=2;
	}

	//drawing the characters
	function draw()
	{
		//Black BG for the canvas
		//translucent BG to show trail
		ctx.fillStyle = "rgba(0, 0, 0, 0.025)";
		ctx.fillRect(0, 0, c.width, c.height);
		
		ctx.fillStyle = "#0F0"; //green text
		ctx.font = font_size + "px arial";
		//looping over drops
		for(var i = 0; i < drops.length; i++)
		{
			//a random chinese character to print
			var text = binary[Math.floor(Math.random()*binary.length)];
			//x = i*font_size, y = value of drops[i]*font_size
			ctx.fillText(text, i*font_size, drops[i]*font_size);
			
			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if(drops[i]*font_size > c.height && Math.random() > 0.975)
				drops[i] = 0;
			
			//incrementing Y coordinate
			drops[i]++;
		}
	}

	var timer = setInterval(draw, 22);
	setTimeout(function(){
		clearInterval(timer);
		c.className = "hidden";
		beginSplash();
	}, 4000);
}

function bootSequence() {
	var splash = document.getElementById("boot-sequence");
	if(k == bootup.length){
		clearInterval(startBoot);
		setTimeout(function(){
			document.getElementById("splash").style.display = "none";
			document.getElementById("terminal").style.display = "block";
			beginPage();
		}, 1000);
	}
	else {
		splash.innerHTML += bootup[k] + " ...<br>";
		k++;
	}
}

function beginPage() {
	setTimeout(typeWriter, 1000);
	document.body.onclick = function(e) {
		try {
			console.log("Body clicked");
			command[j].focus();
		} catch (exception) {
			console.log(exception.message);
		}
	};
}

function setCaretPosition(ctrl, pos) {
  // Modern browsers
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  
  // IE8 and below
  } else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}

function typeWriter() {

	var cursor1 = document.getElementById("cursor1");
	var cursor2 = document.getElementById("cursor2");

	cursor1.className = "remove-anim";

	if (i < txt.length) {
		document.getElementById("cursor1").innerHTML += txt.charAt(i);
		i++;	
		setTimeout(typeWriter, speed);
  	}
  	if (i == txt.length) {
  		cursor2.className = "animated";
  		setTimeout(function() {
  			document.getElementById("about").style.display = "block";
  			setTimeout(createNewCommandLine, 500);
  			cursor2.className = "remove-anim";
  		}, 1000);
  	}
}

function createNewCommandLine (option) {
	if (j != 0){
		var clone = optionsDiv[0].cloneNode(true);
		clone.id = "options" + j;
		document.getElementById("terminal").appendChild(clone);
	}

	var pwd = document.getElementsByClassName("pwd");
	var usercommand = document.getElementsByClassName("user-command");
	command = document.getElementsByClassName("command");
	var response = document.getElementsByClassName("response");
	var cursor = document.getElementsByClassName("cursor");
	var index = j;

	window.scrollTo(0, document.body.scrollHeight);

	cursor[j].className = "animated cursor";
	response[j].style.display = "none";
	pwd[j].style.display = "block";
	command[j].value = "";
	usercommand[j].innerHTML = "";
	bash_history[j] = "";
	command[j].focus();
	command[j].removeAttribute('readOnly');
	command[j].onkeyup = function(e) {
		if (e.keyCode == 13) {
			switch (usercommand[j].innerHTML) {
				case "man contact":
					response[j].style.display = "block";
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					response[j].innerHTML = contact_info;
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();						
					break;

				case "resume":
					window.open('Resume.pdf', '_blank');
					response[j].style.display = "block";
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					response[j].innerHTML = "Compiling project list...<br>Opening Resume.pdf";
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();
					break;

				case "github":
					window.open(url_git, '_blank');
					response[j].style.display = "block";
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					response[j].innerHTML = "Redirecting to " + url_git;
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();
					break;

				case "contact -fb":
					window.open(url_fb, '_blank');
					response[j].style.display = "block";
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					response[j].innerHTML = "Redirecting to " + url_fb;
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();
					break;

				case "contact --facebook":
					window.open(url_fb, '_blank');
					response[j].style.display = "block";
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					response[j].innerHTML = "Redirecting to " + url_fb;
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();
					break;

				case "contact -t":
					window.open(url_t, '_blank');
					response[j].style.display = "block";
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					response[j].innerHTML = "Redirecting to " + url_t;
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();
					break;

				case "contact --twitter":
					window.open(url_t, '_blank');
					response[j].style.display = "block";
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					response[j].innerHTML = "Redirecting to " + url_t;
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();
					break;

				case "contact -lin":
					window.open(url_lin, '_blank');
					response[j].style.display = "block";
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					response[j].innerHTML = "Redirecting to " + url_lin;
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();
					break;

				case "contact --linkedin":
					window.open(url_lin, '_blank');
					response[j].style.display = "block";
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					response[j].innerHTML = "Redirecting to " + url_lin;
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();
					break;

				case "contact -m":
					window.open(url_m, '_blank');
					response[j].style.display = "block";
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					response[j].innerHTML = "Drafting mail to jnandhakishore12@gmail.com";
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();
					break;

				case "contact --mail":
					window.open(url_m, '_blank');
					response[j].style.display = "block";
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					response[j].innerHTML = "Drafting mail to jnandhakishore12@gmail.com";
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();
					break;

				case "exit":
					var footnote = document.createElement("p");
					footnote.innerHTML = credits;
					var madeBy = document.createElement("footer");
					madeBy.className = "credits";
					madeBy.innerHTML = love;
					cursor[j].className = "remove-anim cursor";
					document.getElementById("terminal").appendChild(footnote);
					document.getElementById("terminal").appendChild(madeBy);
					command[j].readOnly = true;
					break;

				case "":
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					j++;
					createNewCommandLine();
					break;

				default:
					response[j].style.display = "block";
					response[j].innerHTML = 'bash: ' + command[j].value + ': command not found';
					cursor[j].className = "remove-anim cursor";
					command[j].readOnly = true;
					bash_history[j] = usercommand[j].innerHTML;
					j++;
					createNewCommandLine();
					break;
			}
		} else if(e.keyCode == 37 || e.keyCode == 39) {
			setCaretPosition(command[j], command[j].value.length);
		} else if (e.keyCode == 38) {
			bash_history[j] = command[j].value;
			index--;
			if (index > -1)
				usercommand[j].innerHTML = bash_history[index];
			else
				index = 0;
		} else if (e.keyCode == 40) {
			bash_history[j] = command[j].value;
			index++;
			if (index < j + 1)
				usercommand[j].innerHTML = bash_history[index];
			else
				index = j;
		} else if (e.keyCode == 32 && command[j].value.charAt(command[j].value.length - 2) == ' ') {
			command[j].value -= ' ';
		} else {
			if (index == j) {
				usercommand[j].innerHTML = command[j].value;
				bash_history[j] = command[j].value;
			} else {
				command[j].value = bash_history[j];
			}
		}
	};

	command[j].onkeydown = function(e) {
		if (e.keyCode == 8 && index == j){ 
			usercommand[j].innerHTML = command[j].value;
		}
	};
}
