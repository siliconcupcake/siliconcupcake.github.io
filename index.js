var typewriter_index = 0;
var splash_index = 0;
var speed = 100;

var init_cmd = 'cat about_me.txt';
var bootup = 'Configuring ISA PNP,' +
	'Setting system time from the hardware clock (localtime),' +
	'Using /etc/random-seed to initialise /dev/urandom,' +
	'Initialising basic system settings,' +
	'Updating shared libraries,' +
	'INIT: entering runlevel: 4,' +
	'Starting system logger,' +
	'Initialising advanced hardware,' +
	'Setting up modules,' +
	'Initialising network,' +
	'Setting up localhost,' +
	'Setting up inet1,' +
	'Setting up fancy console,' +
	'Logging you in';

bootup = bootup.split(',');

var startBoot;

window.onload = matrixAnim;

function beginSplash() {
	document.getElementById("splash").className = "visible";
	startBoot = setInterval(bootSequence, 200);
}

function matrixAnim() {
	var c = document.getElementById("matrix-canvas");
	var ctx = c.getContext("2d");

	//making the canvas full screen
	c.height = window.innerHeight;
	c.width = window.innerWidth;

	//chinese characters - taken from the unicode charset
	var binary = "10";
	//converting the string into an array of single characters
	binary = binary.split("");

	var font_size = 10;
	var columns = c.width / font_size; //number of columns for the rain
	//an array of drops - one per column
	var drops = [];
	//x below is the x coordinate
	//1 = y co-ordinate of the drop(same for every drop initially)
	for (var x = 0; x < columns;) {
		drops[x] = 1;
		x += 2;
	}

	//drawing the characters
	function draw() {
		//Black BG for the canvas
		//translucent BG to show trail
		ctx.fillStyle = "rgba(0, 0, 0, 0.025)";
		ctx.fillRect(0, 0, c.width, c.height);

		ctx.fillStyle = "#0F0"; //green text
		ctx.font = font_size + "px arial";
		//looping over drops
		for (var i = 0; i < drops.length; i++) {
			//a random chinese character to print
			var text = binary[Math.floor(Math.random() * binary.length)];
			//x = i*font_size, y = value of drops[i]*font_size
			ctx.fillText(text, i * font_size, drops[i] * font_size);

			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if (drops[i] * font_size > c.height && Math.random() > 0.975)
				drops[i] = 0;

			//incrementing Y coordinate
			drops[i]++;
		}
	}

	var timer = setInterval(draw, 22);
	setTimeout(function () {
		clearInterval(timer);
		c.className = "hidden";
		beginSplash();
	}, 4000);
}

function bootSequence() {
	var splash = document.getElementById("boot-sequence");
	if (splash_index == bootup.length) {
		clearInterval(startBoot);
		setTimeout(function () {
			document.getElementById("splash").className = "hidden";
			document.getElementById("terminal").className = "visible";
			beginPage();
		}, 1000);
	}
	else {
		splash.innerHTML += bootup[splash_index] + " ...<br>";
		splash_index++;
		window.scrollTo(0, document.body.scrollHeight);
	}
}

function beginPage() {
	setTimeout(typeWriter, 1000);
}

function typeWriter() {

	var init_cursor = document.getElementById("init-cursor");
	var cmd_cursor = document.getElementById("cmd-cursor");

	init_cursor.className = "remove-anim";

	if (typewriter_index < init_cmd.length) {
		document.getElementById("init-cursor").innerHTML += init_cmd.charAt(typewriter_index);
		typewriter_index++;
		setTimeout(typeWriter, speed);
	}
	if (typewriter_index == init_cmd.length) {
		cmd_cursor.className = "animated";
		setTimeout(function () {
			document.getElementById("about").className = "visible";
			cmd_cursor.className = "remove-anim";
			let terminal = new shell(commands);
		}, 1000);
	}
}
