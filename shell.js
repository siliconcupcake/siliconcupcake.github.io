class shell {
	constructor(commands, debug = false) {
		// Set up history
		this.history = [];
		this.current = 0;
		this.history_index = 0;

		// Misc stuff
		this.debug = true;
		this.utils = new utils();

		this.options = document.getElementById("default-options");
		this.setupCommandLine()

		if (this.utils.isEmpty(commands) || typeof commands != 'object') {
			this.utils.except("Commands must be an object and must not be empty!");
		}

		// Init command handler
		this.commands = new commandHandler(commands, this.utils);

	}

	setupCommandLine() {
		this.pwd = document.getElementsByClassName("pwd");
		this.command = document.getElementsByClassName("command");
		this.response = document.getElementsByClassName("response");

		this.response[this.current].className = "response hidden";
		this.response[this.current].innerHTML = "";
		this.pwd[this.current].className = "pwd visible";

		// Set up input handlers and focus
		this.input = this.command[this.current];
		this.input.value = "";
		this.input.addEventListener('keydown', this._keydown.bind(this));
		this.input.addEventListener('keyup', this._keyup.bind(this));
		this.input.removeAttribute('readOnly');
		this.input.focus();

		window.scrollTo(0, document.body.scrollHeight);
		window.addEventListener('click', function (e) {
			this.input.focus();
		}.bind(this));
	}

	createNewCommandLine() {
		this.current++;
		var clone = this.options.cloneNode(true);
		clone.id = "options" + this.current;
		document.getElementById("terminal").appendChild(clone);
		this.setupCommandLine()
	}

	call(user_command) {
		// Add to history
		if (this.history[0] !== user_command)
			this.history.unshift(user_command);

		// Separate command from args
		let args = user_command.split(' ');
		user_command = args.shift();

		// Check command exists, otherwise bottom out
		if (!this.commands.exists(user_command)) {
			this.stderr(`shell: command not found: ${user_command}`);
			return false;
		}

		// Call the command
		let cmd = this.commands.get(user_command);
		let callback = cmd.callback.bind(this);
		let response = callback(args);

		// Check for errors
		if (response === false) {
			return response;
		}

		if (response !== true) {
			this.stdout(response);
		}
		return true;
	}

	stdin() {
		return this.input.value;
	}

	stdout(msg) {
		this.response[this.current].className = "response visible";
		this.response[this.current].innerHTML += msg;
		this.response[this.current].style.color = "var(--terminal-green)";
	}

	stderr(msg) {
		this.response[this.current].className = "response visible";
		this.response[this.current].innerHTML += msg;
		this.response[this.current].style.color = "var(--terminal-red)";
	}

	clear() {
		this.input.readOnly = true;
		this.history_index = 0;
	}

	autocomplete(input) {
		let keys = this.commands.keys();
		let suggestions = [];

		keys.forEach(function (key) {
			if (key.substr(0, input.length) == input) {
				suggestions.push(key);
			}
		});

		return suggestions;
	}

	set_history() {
		this.input.value = this.history_index == 0 ? '' : this.history[this.history_index - 1];
		this.input.focus();
	}

	_keydown(e) {
		e.stopImmediatePropagation();
		if (e.which == 13) { // Enter
			let stdin = this.stdin();
			this.call(stdin);
			this.clear();

			if (stdin === "clear") {
				this.input.removeAttribute('readOnly');
				this.input.focus();
			}

			if (stdin !== "exit" && stdin !== "clear") {
				this.createNewCommandLine();
			}

			window.scrollTo(0, document.body.scrollHeight);
			e.preventDefault();
		} else if (e.which == 9) { // Tab
			// TODO: Autocomplete
			let suggestions = this.autocomplete(this.stdin());

			if (!this.utils.isEmpty(suggestions)) {
				this.input.value = suggestions[0];
			}

			e.preventDefault();
		}
	}

	_keyup(e) {
		e.stopImmediatePropagation();
		if (e.keyCode == 38) { // Key up
			if (this.history_index < this.history.length) {
				this.history_index++;
				this.set_history();
			}
			e.preventDefault();
		} else if (e.keyCode == 40) { // Key down
			if (this.history_index >= 1) {
				this.history_index--;
				this.set_history();
			}
			e.preventDefault();
		}
	}
}

class commandHandler {
	constructor(commands, utils = null) {
		this.commands = commands;
		this.utils = (utils == null) ? new utils() : utils;
	}

	keys() {
		return Object.keys(this.commands);
	}

	exists(property) {
		return this.utils.hasProperty(this.commands, property) &&
			this.utils.hasProperty(this.commands[property], 'callback') &&
			this.utils.isFunction(this.commands[property].callback);
	}

	get(property) {
		return this.commands[property];
	}

	set(property, object) {
		if (this.utils.isEmpty(object)) {
			this.utils.except('Can not set empty');
		}

		if (!this.utils.hasProperty(object, 'callback') || !this.utils.isFunction(object.callback)) {
			this.utils.except('Can not set without a callback function');
		}

		this.commands[property] = object;
	}

	remove(property) {
		delete this.commands[property];
	}
}

class utils {
	constructor() {
		this.logger = document.getElementById('log');
	}

	isEmpty(value) {
		if (['', null, 'null', undefined, 'undefined'].includes(value)) {
			return true;
		}

		if (value instanceof Array) {
			return value.length === 0;
		} else if (value.constructor.name == 'object') {
			for (var property in value) {
				if (value.hasOwnProperty(property)) {
					return false;
				}
			}

			return true;
		}
	}

	isFunction(value) {
		return (typeof value == 'function');
	}

	hasProperty(object, property) {
		if (this.isEmpty(object)) {
			return false;
		}

		return object.hasOwnProperty(property);
	}

	log(msg, log = false) {

		if (log) {
			this.debug(msg);
		}
	}

	debug(msg) {
		if (!this.isEmpty(this.logger)) {
			this.logger.innerHTML += `<p class="log-error">${msg}</p>`;
		}
	}

	except(msg, log = true) {
		if (log) {
			this.debug(msg);
		}
		throw msg;
	}
}
