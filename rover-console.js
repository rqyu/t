// Author : Ruiqi Yu
// Email: goodcolorpencils@gmail.com

/*
Note: technically speaking a map of 5 x 5 can only have coordinates from (0, 0) to (4, 4),
	but according to test input, in order to get desired result, the rover must
	be able to access points (0, y) and (5, y).
	Therefore I assume the valid coordinates on the map is from (0, 0) to (5, 5)
	for a 5 x 5 map
*/


var readline = require('readline');

function Map(width = 1, length = 1) {
	this.xSize = parseInt(width);
	this.ySize = parseInt(length);
	this.rvs = [];
	this.rvCount = 0;
}

Map.prototype.insertRover = function(rv) {
	this.rvs.push(rv);
	this.rvCount += 1;
}

function Rover(px = 0, py = 0, facing = 'N') {
	this.x = parseInt(px);
	this.y = parseInt(py);
	this.o = facing[0];
}

Rover.prototype.move = function(cmd, map) {
	for(var i = 0; i < cmd.length; i++) {
		var c = cmd.charAt(i);
		if (c === 'L' || c === 'R') {
			this.o = turn[c][this.o];
		} else if (c === 'M') {
			if (!this.crashOnNextMove(map.rvs)) {
				if (this.o === 'N') {
					this.y = this.y < map.ySize ? this.y + 1 : this.y;
				} else if (this.o === 'E') {
					this.x = this.x < map.xSize ? this.x + 1 : this.x;
				} else if (this.o === 'S') {
					this.y = this.y > 0 ? this.y - 1 : this.y;
				} else if (this.o === 'W') {
					this.x = this.x > 0 ? this.x - 1 : this.x;
				}
			}
		}
	}
	console.log(this.x + ' ' + this.y + ' ' + this.o);
};

Rover.prototype.crashOnNextMove = function(rvs) {
	var colx = this.x;
	var coly = this.y;
	if (this.o === 'N') coly += 1;
	else if (this.o === 'S') coly -= 1;
	else if (this.o === 'E') colx += 1;
	else if (this.o === 'W') colx -= 1;
	for (var i = 0; i < rvs.length; i++) {
		if (rvs[i].x === colx && rvs[i].y === coly) return true;
	}
	return false;
};

Rover.prototype.crash = function(rvs) {
	var colx = this.x;
	var coly = this.y;
	for (var i = 0; i < rvs.length; i++) {
		if (rvs[i].x === colx && rvs[i].y === coly) return true;
	}
	return false;
};

var turn = {'L':{'N':'W', 'E':'N', 'S':'E', 'W':'S'}, 'R':{'N':'E', 'E':'S', 'S':'W', 'W':'N'}};
var land = new Map();
var moveRover = false;

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

rl.on('line', (l) => {
	var n = l.toString().trim().split(' ');
	if (n.length == 2) {
		if (isNaN(n[0]) || isNaN(n[1])) {
			console.log("Wrong input: please enter in form: [1-9]+ [1-9]+");
		} else if (parseInt(n[0]) < 0 || parseInt(n[1]) < 0) {
			console.log('Wrong input: map size cannot be negative');
		} else {
			land = new Map(n[0], n[1]);
		}
	} else if (n.length == 3) {
		if (isNaN(n[0]) || isNaN(n[1])) {
			console.log("Wrong input: please enter in form: [0-9]+ [0-9]+ [NSWE]");
		} else if (parseInt(n[0]) > land.xSize || parseInt(n[1]) > land.ySize) {
			console.log("Wrong input: rover out of boundary");
		} else {
			var rv = new Rover(n[0], n[1], n[2]);
			if (!rv.crash(land.rvs)) {
				land.insertRover(rv);
				moveRover = true;
			} else {
				console.log("Position (" + n[0] + ", " + n[1] + ") has rover")
			}
		}
	} else if (moveRover) {
		if (l.search(/[^LRM]/) > 0) {
			console.log('Command contains characters other than L, R or M. Only L R M will be recognized and executed');
		}
		land.rvs[land.rvCount - 1].move(l, land);
		moveRover = false;
	}
});

rl.on('close', () => {
	land = new Map();
});
