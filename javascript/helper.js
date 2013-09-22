var gamejs = require("gamejs");
var $img_list = require("img_list");

var SCREEN_WIDTH = exports.SCREEN_WIDTH = 700;
var SCREEN_HEIGHT = exports.SCREEN_HEIGHT = 700;
var SPRITE_WIDTH = 500;
exports.CENTER_X = (SCREEN_WIDTH - SPRITE_WIDTH) / 2;

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

exports.collide_any = function (rect, points)
{
	for (var i in points) {
		if (left_rect.collidePoint(points[i])) {
			return true;
		}
	}
	return false;
}

var all_image = {};
function get_image(img_file)
{
	if (!all_image[img_file]) {
		var img = gamejs.image.load(img_file);
		all_image[img_file] = img;
	}
	return all_image[img_file];
}

exports.blit_image = function (display, image, pos)
{
	display.blit(image.img, pos, image.rt);
}

var load_misc = exports.load_misc = function (id)
{
	// TODO: don't use fallback
	if (!$img_list.misc_data[id]) {
		var file = "./imagemisc/" + id + ".png";
		var img = get_image(file);
		var size = img.getSize();
		return {
			img: img,
			rt: new gamejs.Rect(0, 0, size[0], size[1]) };
	} else {
		var data = $img_list.misc_data[id];
		return {
			img: get_image(data.file),
			rt: new gamejs.Rect(data.rt) };
	}
}

exports.misc_list = function ()
{
	var images = []
	for (var i in arguments) {
		var id = arguments[i];
		images.push(load_misc(id));
	}
	return images;
}

exports.misc_map = function ()
{
	var images = {};
	for (var i in arguments) {
		var id = arguments[i];
		images[id] = load_misc(id);
	}
	return images;
}

exports.misc_rt = function (id)
{
	return $img_list.misc_rt[id];
}

var load_image = exports.load_image = function (id)
{
	// TODO: don't use fallback
	if (!$img_list.image_data[id]) {
		alert(id);
	} else {
		var data = $img_list.image_data[id];
		return {
			img: get_image(data.file),
			rt: new gamejs.Rect(data.rt) };
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

var argv = exports.argv = {};
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

