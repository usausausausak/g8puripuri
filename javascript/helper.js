var gamejs = require("gamejs");

var SCREEN_WIDTH = exports.SCREEN_WIDTH = 700;
var SCREEN_HEIGHT = exports.SCREEN_HEIGHT = 700;
var argv = exports.argv = {};

exports.mouse_diff = function (lhs, rhs)
{
	return { x: lhs[0] - rhs[0], y: lhs[1] - rhs[1] };
}

// lhs = rhs
exports.mouse_copy = function (lhs, rhs)
{
	lhs[0] = rhs[0];
	lhs[1] = rhs[1];
}

exports.center_x = function (img)
{
	return (SCREEN_WIDTH - img.rect.width) / 2;
}

exports.collide_any = function (rect, points)
{
	for (var i in points) {
		if (left_rect.collidePoint(points[i])) {
			return true;
		}
	}
	return false;
}

exports.misc_list = function ()
{
	var images = []
	for (var i in arguments) {
		var id = arguments[i];
		images.push(
			gamejs.image.load("./imagemisc/" + id + ".png")); 
	}
	return images;
}

exports.misc_map = function ()
{
	var images = {};
	for (var i in arguments) {
		var id = arguments[i];
		images[id] = 
			gamejs.image.load("./imagemisc/" + id + ".png"); 
	}
	return images;
}

var load_image = exports.load_image = function (id)
{
	if (argv.mono) {
		return gamejs.image.load("./image_m/" + id + ".png");
	} else {
		return gamejs.image.load("./image/" + id + ".png");
	}
}

exports.image_list = function ()
{
	var images = []
	for (var i in arguments) {
		images.push(load_image(arguments[i]));
	}
	return images;
}

exports.image_map = function ()
{
	var images = {};
	for (var i in arguments) {
		var id = arguments[i];
		images[id] = load_image(id);
	}
	return images;
}

var draw_hints_rect = exports.draw_hints_rect = function (display, rect)
{
	if (rect instanceof Array) {
		for (var i in rect) {
			draw_hints_rect(display, rect[i]);
		}
	} else if (rect instanceof gamejs.Rect) {
		gamejs.draw.rect(display, "rgba(255, 0, 0, 0.2)", rect);
	}
}

var args = document.location.hash.substr(1).split(/,/);
for (var i in args) {
	switch (args[i]) {
	case "hints": argv.show_hints = true; break;
	case "debug":
		argv.debug = true;
		argv.show_hints = true;
		break;
	case "mono": argv.mono = true; break;
	case "bg": argv.bg = true; break;
	}
}

