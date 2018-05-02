// Author : Ruiqi Yu
// Email: goodcolorpencils@gmail.com

/*
Note: technically speaking a map of 5 x 5 can only have coordinates from (0, 0) to (4, 4),
	but according to test input, in order to get desired result, the rover must
	be able to access points (0, y) and (5, y).
	Therefore I assume the valid coordinates on the map is from (0, 0) to (5, 5)
	for a 5 x 5 map
*/

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

Map.prototype.getRover = function(rv) {
	for (var i = 0; i < this.rvCount; i++) {
		var nrv = this.rvs[i];
		if (rv.x === nrv.x && rv.y === nrv.y) return i;
	}
}

Map.prototype.removeRover = function(n) {
	clearRover(land.rvs[n]);
	land.rvs.splice(n, 1);
	land.rvCount -= 1;
}

function Rover(px = 0, py = 0, facing = 'N') {
	this.x = parseInt(px);
	this.y = parseInt(py);
	this.o = facing[0];
}

Rover.prototype.move = function(cmd, map) {
	
	var pos = map.getRover(this);

	var crv = this;
	var i = 0;

	var delay = parseInt(document.getElementById('delay').value);
	function nestloop() {

		setTimeout(() => {
			clearRover(crv);
			var c = cmd.charAt(i);
			if (c === 'L' || c === 'R') {
				crv.o = turn[c][crv.o];
			} else if (c === 'M') {
				if (!crv.crashOnNextMove(map.rvs)) {
					if (crv.o === 'N') {
						crv.y = crv.y < map.ySize ? crv.y + 1 : crv.y;
					} else if (crv.o === 'E') {
						crv.x = crv.x < map.xSize ? crv.x + 1 : crv.x;
					} else if (crv.o === 'S') {
						crv.y = crv.y > 0 ? crv.y - 1 : crv.y;
					} else if (crv.o === 'W') {
						crv.x = crv.x > 0 ? crv.x - 1 : crv.x;
					}
				}
			}
			drawRover(crv, pos);
			markRover(pos);
			i++;
			if (i < cmd.length) nestloop();
		}, delay)
	}

	nestloop();

/*
for(var i = 0; i < cmd.length; i++) {
	clearRover(this);
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
	drawRover(this, pos);
}
*/
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
var currentRover = 0;
var b = 20;
var ofs = b / 2;
var bp = 10;

var gameArea = {
	canvas : document.createElement("canvas"),
	drawGrid : function(x = 5, y = 5) {
		land = new Map(x, y);
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if ((x + 1) * b * 2 + bp > 260 || (y + 1) * b * 2 + bp > 260) {
			this.canvas.width = (x + 1) * b * 2 + bp * 2;
			this.canvas.height = (y + 1) * b * 2 + bp * 2;
		}

		for (var i = x; i >= 0; i--) {
			this.context.fillText(i, (i + 1) * b * 2 - bp, (y + 1) * b * 2 + bp * 2);
			this.context.fillText(i, (i + 1) * b * 2 - bp, bp);
		}

		for (var i = 0; i <= y; i++) {
			this.context.fillText(i, 0, (y - i) * b * 2 + bp * 3);
			this.context.fillText(i, (x + 1) * b * 2 + bp, (y - i) * b * 2 + bp * 3);
		}

		for (var i = 0; i <= x; i++) {
			for (var j = 0; j <= y; j++) {
				drawOne(this.context, i * b * 2 + b + bp, j * b * 2 + b + bp);
			}
		}
	},
	start : function() {
		this.canvas.width = 260;
		this.canvas.height = 260;
		this.w = 5;
		this.h = 5;
		this.context = this.canvas.getContext("2d");
		document.querySelector("#game").appendChild(this.canvas);
		this.drawGrid(this.w, this.h);
	},
}

function drawOne(ctx, x, y) {
	ctx.beginPath();
	ctx.moveTo(x - b, y - b + ofs);
	ctx.lineTo(x - b, y - b);
	ctx.lineTo(x - b + ofs, y - b);
	ctx.stroke();
	
	ctx.moveTo(x - b, y + b - ofs);
	ctx.lineTo(x - b, y + b);
	ctx.lineTo(x - b + ofs, y + b);
	ctx.stroke();
	
	ctx.moveTo(x + b, y + b - ofs);
	ctx.lineTo(x + b, y + b);
	ctx.lineTo(x + b - ofs, y + b);
	ctx.stroke();
	
	ctx.moveTo(x + b, y - b + ofs);
	ctx.lineTo(x + b, y - b);
	ctx.lineTo(x + b - ofs, y - b);
	ctx.stroke();
	ctx.closePath();
}

function drawRover(rv, n) {
	var ctx = gameArea.context;

	ctx.beginPath();
	var x = rv.x * b * 2 + b + bp;
	var y = (land.ySize - rv.y) * b * 2 + b + bp;
	var rs = b / 2 - 2;
	var br = b - 5;

	clearRover(rv);

	ctx.strokeStyle = '#000000';
	ctx.moveTo(x - rs, y - rs);
	ctx.lineTo(x + rs, y - rs);
	ctx.lineTo(x + rs, y + rs);
	ctx.lineTo(x - rs, y + rs);
	ctx.lineTo(x - rs, y - rs);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.strokeStyle = '#FF0000';
	if (rv.o === 'N') {
		ctx.lineTo(x, y - br);
	} else if (rv.o === 'S') {
		ctx.lineTo(x, y + br);
	} else if (rv.o === 'E') {
		ctx.lineTo(x + br, y);
	} else if (rv.o === 'W') {
		ctx.lineTo(x - br, y);
	} 
	ctx.stroke();

	ctx.closePath();

	ctx.fillStyle = '#000000';
	ctx.fillText(n + 1, x - 2, y + 4);
}

function clearRover(rv) {
	var ctx = gameArea.context;

	var x = rv.x * b * 2 + b + bp;
	var y = (land.ySize - rv.y) * b * 2 + b + bp;
	var rs = b / 2 - 2;
	var br = b - 5;

	ctx.clearRect(x - b + 1, y - b + 1, (b - 1) * 2, (b - 1) * 2);
}

function markRover(n) {
	if (n > land.rvCount) return;
	currentRover = n;
	redoRover();
	var ctx = gameArea.context;
	ctx.fillStyle = '#00FF00';
	var x = land.rvs[n].x * b * 2 + b + bp;
	var y = (land.ySize - land.rvs[n].y) * b * 2 + b + bp;
	var rs = b / 2 - 2;
	//console.log(x + ', ' + y + ', ' + rs);
	ctx.fillRect(x - rs, y - rs, rs * 2, rs * 2);
	document.getElementById('rvid').value = n + 1;
	document.getElementById('recallid').value = n + 1;

	ctx.fillStyle = '#000000';
	ctx.fillText(n + 1, x - 2, y + 4);
}

function redoRover() {
	for(var i = 0; i < land.rvCount; i++) {
		drawRover(land.rvs[i], i);
	}
}

function alertMap(s) {
	console.log(s);
}

function alertRover(s) {
	console.log(s);
}

function updateGrid() {
	var x = document.querySelector('#mapwidth').value;
	var y = document.querySelector('#maplength').value;
	if (x.search(/^[0-9]+$/) > -1 && y.search(/^[0-9]+$/) > -1) {
		x = parseInt(x);
		y = parseInt(y);
		gameArea.drawGrid(x, y);
	} else {
		alertMap('Incorrect input, please input numbers only');
	}
}

function addRover() {
	var x = document.querySelector('#rvx').value;
	var y = document.querySelector('#rvy').value;
	var o = document.querySelector('#rvo').value;
	if (x.search(/^[0-9]+$/) > -1 && y.search(/^[0-9]+$/) > -1 && o.search(/^[NSEW]?$/) > -1) {
		addRover(x, y, o);
	} else {
		alertRover('Incorrect input, please make sure coordinates are numbers and facing only have values N W S E');
	}
}

function addRover(x, y, o = 'N') {
	x = parseInt(x);
	y = parseInt(y);
	console.log(x, y);
	if (x <= land.xSize && y <= land.ySize) {
		var rv = new Rover(x, y, o || 'N');
		if (!rv.crash(land.rvs)) {
			land.insertRover(rv);
			drawRover(rv, land.rvCount - 1);
		}
	} else {
		alertRover('Rover out of bound');
	}
}

function moveRover() {
	var rvid = parseInt(document.querySelector('#rvid').value);
	var mvs = document.querySelector('#rvmoves').value;
	if (!isNaN(rvid) && rvid <= land.rvCount) {
		rvid -= 1;
		land.rvs[rvid].move(mvs, land);
	}
}

function recallRover() {
	var rvid = parseInt(document.querySelector('#recallid').value);
	if (!isNaN(rvid) && rvid <= land.rvCount) {
		rvid -= 1;
		land.removeRover(rvid);
	}
}

document.getElementById('rvid').addEventListener('change', (e) => {
	var rvid = parseInt(document.getElementById('rvid').value);
	//console.log(rvid);
	if (!isNaN(rvid) && rvid <= land.rvCount) {
		rvid -= 1;
		markRover(rvid);
	} else {
		redoRover();
	}
}, false);

document.getElementById('recallid').addEventListener('change', (e) => {
	var rvid = parseInt(document.getElementById('recallid').value);
	//console.log(rvid);
	if (!isNaN(rvid) && rvid <= land.rvCount) {
		rvid -= 1;
		markRover(rvid);
	} else {
		redoRover();
	}
}, false);

gameArea.canvas.addEventListener('click', (e) => {
	var rect = gameArea.canvas.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	var px = Math.floor((x - bp) / b / 2);
	var py = land.ySize - Math.floor((y - bp) / b / 2);
	for (var i = 0; i < land.rvCount; i++) {
		var rv = land.rvs[i];
		if (rv.x === px && rv.y === py) {
			markRover(i);
			return;
		}
	}

	if (px >= 0 && py >= 0) addRover(px, py, 'N');

	//console.log(px + ', ' + py);
}, false);

gameArea.start();

window.onkeydown = function(e) {
	var code = e.keyCode ? e.keyCode : e.witch;
	if (code == 38) {
		var rv = land.rvs[currentRover];
		rv.o = 'N';
		rv.move('M', land);
	} else if (code == 37) {
		var rv = land.rvs[currentRover];
		rv.o = 'W';
		rv.move('M', land);
	} else if (code == 39) {
		var rv = land.rvs[currentRover];
		rv.o = 'E';
		rv.move('M', land);
	} else if (code == 40) {
		var rv = land.rvs[currentRover];
		rv.o = 'S';
		rv.move('M', land);
	}
}
