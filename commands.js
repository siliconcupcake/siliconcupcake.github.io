var url_t = 'https://twitter.com/nandhakishorej';
var url_fb = 'https://www.facebook.com/profile.php?id=100006145142052';
var url_lin = 'https://www.linkedin.com/in/nandha-kishore-j';
var url_git = 'https://github.com/siliconcupcake';
var url_mail = 'mailto:jnandhakishore12@gmail.com';

var credits = 'Please refresh to begin another session.';

let commands = {
    resume: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;resume<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Take a look at my resume.<br>';
        },

        callback: function (args) {
            if (args.length !== 0) {
                this.stderr("<span style=\"color:var(--terminal-red);\">Incorrect Usage</span><br>");
                return this.commands.get("resume").help();
            }

            this.stdout("Compiling project list...<br>Opening resume.pdf");
            window.open('resume.pdf', '_blank');
            return true;
        }
    },
    github: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;github<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Visit my github profile.<br>';
        },

        callback: function (args) {
            if (args.length !== 0) {
                this.stderr("<span style=\"color:var(--terminal-red);\">Incorrect Usage</span><br>");
                return this.commands.get("github").help();
            }

            this.stdout("Redirecting to " + url_git);
            window.open(url_git, '_blank');
            return true;
        }
    },
    contact: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;contact METHOD<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Contact me through any of the following methods.<br>' +
                '<table class=man-table>' +
                '<tr><td>-lin&emsp;&emsp;&emsp;</td><td>LinkedIn</td></tr>' +
                '<tr><td>-t&emsp;&emsp;&emsp;</td><td>Twitter</td></tr>' +
                '<tr><td>-fb&emsp;&emsp;&emsp;</td><td>Facebook</td></tr>' +
                '<tr><td>-m&emsp;&emsp;&emsp;</td><td>Mail</td></tr>' +
                '</table>';
        },

        callback: function (args) {
            let site = args[0];
            if (args.length !== 1 || site[0] !== '-') {
                this.stderr("<span style=\"color:var(--terminal-red);\">Incorrect Usage</span><br>");
                return this.commands.get("contact").help();
            }

            site = site.slice(1);
            switch (site) {
                case "fb":
                    this.stdout("Redirecting to " + url_fb);
                    window.open(url_fb, '_blank');
                    break;
                case "t":
                    this.stdout("Redirecting to " + url_t);
                    window.open(url_t, '_blank');
                    break;
                case "lin":
                    this.stdout("Redirecting to " + url_lin);
                    window.open(url_lin, '_blank');
                    break;
                case "m":
                    this.stdout("Drafting mail to jnandhakishore12@gmail.com");
                    window.open(url_mail, '_blank');
                    break;
                default:
                    this.stderr("error: unsupported method");
                    break;
            }
            return true;
        },
    },
    blog: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;blog<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Visit my blog.<br>';
        },

        callback: function (args) {
            if (args.length !== 0) {
                this.stderr("<span style=\"color:var(--terminal-red);\">Incorrect Usage</span><br>");
                return this.commands.get("blog").help();
            }

            this.stderr("error: blog still under construction");
            return true;
        }
    },
    showerthought: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;showerthought<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Display a random r/ShowerThoughts post<br>';
        },

        callback: function (args) {
            if (args.length !== 0) {
                this.stderr("<span style=\"color:var(--terminal-red);\">Incorrect Usage</span><br>");
                return this.commands.get("showerthought").help();
            }

            return "Random shower thought";
        }
    },
    rm: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;rm [OPTIONS] FILE<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Remove the specified file.<br>';
        },

        callback: function (args) {
            if (args.length === 0) {
                this.stderr("<span style=\"color:var(--terminal-red);\">Incorrect Usage</span><br>");
                return this.commands.get("rm").help();
            }

            let file = args[args.length - 1];
            let opts = args.slice(0, -1);

            if (file == "/" && (opts.includes('-rf') || (opts.includes('-r') && opts.includes('-f')))) {
                this.stderr("I see what you did there.");
                return false;
            }

            this.stderr("You do not have sufficient permissions for the specified action.");
            return true;
        }
    },
    help: {
        callback: function (args) {
            let keys = this.commands.keys();
            let stdout = '<strong>COMMAND LIST:</strong><br>';

            for (var i in keys) {
                stdout += `${keys[i]},&emsp;`;
            };

            stdout = stdout.slice(0, -7);
            return stdout + "<br>";
        }
    },
    man: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;man [COMMAND]<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;A refence manual to give information about a specific command.<br>';
        },

        callback: function (args) {
            let stdin = args[0];
            let stdout = '';

            if (this.utils.isEmpty(stdin)) {
                this.stderr("<span style=\"color:var(--terminal-red);\">Incorrect Usage</span><br>");
                return this.commands.get("man").help();
            }

            // If command not in keys
            if (this.commands.exists(stdin)) {
                let command = this.commands.get(stdin);

                if (this.utils.hasProperty(command, 'help')) {
                    stdout += command['help']();
                } else {
                    console.log("man");
                    this.stderr(`No manual entry for ${stdin}`);
                    return false;
                }
            } else {
                this.stderr(`No manual entry for ${stdin}`);
                return false;
            }

            return stdout;
        }
    },
    exit: {
        help: function (args) {
            return '<strong>USAGE:</strong>' +
                '&nbsp;&nbsp;exit<br>' +
                '<strong>DESCRIPTION:</strong>' +
                '&nbsp;&nbsp;Exit from the current shell.<br>';
        },

        callback: function (args) {

            if (args.length !== 0) {
                this.stderr("<span style=\"color:var(--terminal-red);\">Incorrect Usage</span><br>");
                return this.commands.get("exit").help();
            }

            var footnote = document.createElement("p");
            footnote.id = "footnote";
            footnote.innerHTML = credits;
            document.getElementById("terminal").appendChild(footnote);
            return true;
        }
    }
}