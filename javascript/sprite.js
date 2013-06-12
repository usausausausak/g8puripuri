var gamejs = require("gamejs");
var $h = require("helper");

var pos = null;
exports.Pos = function ()
{
	return pos;
}

// new Anime(wait_sec, "frame1", "frame2", "frame3"...);
var Anime = exports.Anime = function (interval)
{
	this.frames = [];
	for (var i = 1; i < arguments.length; ++i) {
		var images = (arguments[i]) ?
			$h.load_image(arguments[i]) : null;
		this.frames.push({ wait: interval, img: images } );
	}
	this.frame_current = 0;
	this.ms_pass = 0;
	this.end = false;
}

Anime.prototype.reset = function ()
{
	this.frame_current = 0;
	this.ms_pass = 0;
	this.end = false;
}

Anime.prototype.playing = function (ms_pass)
{
	this.ms_pass += ms_pass;
	// maybe skip
	while (this.ms_pass >= this.frames[this.frame_current].wait) {
		this.ms_pass -= this.frames[this.frame_current].wait;
		++this.frame_current;
		if (this.frame_current >= this.frames.length) {
			this.frame_current = this.frames.length - 1;
			this.end = true;
			break;
		}
	}
	return this.frames[this.frame_current].img;
}

Anime.prototype.looping = function (ms_pass)
{
	this.ms_pass += ms_pass;
	this.end = false;
	// maybe skip
	while (this.ms_pass >= this.frames[this.frame_current].wait) {
		this.ms_pass -= this.frames[this.frame_current].wait;
		++this.frame_current;
		if (this.frame_current >= this.frames.length) {
			this.frame_current = 0;
		}
	}
	return this.frames[this.frame_current].img;
}

var SpriteAnime = exports.SpriteAnime = function (layers)
{
	this.layers = layers;
	this.end = false;
}

SpriteAnime.prototype.reset = function ()
{
	this.end = false;
	for (var i in this.layers) {
		this.layers[i].reset();
	}
}

SpriteAnime.prototype.playing = function (ms_pass)
{
	var ret = {};
	this.end = true;
	for (var i in this.layers) {
		var layer = this.layers[i];
		if (!layer.end) {
			ret[i] = layer.playing(ms_pass);
			this.end = false;
		}
	}
	return ret;
}

var Sprite = exports.Sprite = function (display)
{
	var image = $h.image_map(
		"back_hair1", "back_hair2", "back_hair3", 
		"body1", "skirt1", "face1");
	var layer = {
		"back_hair": image.back_hair1,
		"body": image.body1,
		"skirt": image.skirt1,
		"face": image.face1,
		"top": null
	};
	pos = [$h.center_x(layer.body[0]), 0];
	this.flags = { "hair1": false };
	this.set_layer = function (lid, id)
	{
		layer[lid] = image[id];
	}
	this.get_layer = function (lid)
	{
		return (layer[lid]) ? layer[lid][1] : "";
	}
	this.draw = function (override)
	{
		this.draw_layer("back_hair", override);
		this.draw_layer("body", override);
		this.draw_layer("skirt", override);
		this.draw_layer("face", override);
		this.draw_layer("top", override);
	}
	this.draw_layer = function (lid, override)
	{
		if ((override) && (override[lid])) {
			display.blit(override[lid][0], pos);
		} else if (layer[lid]) {
			display.blit(layer[lid][0], pos);
		}
	}
	this.blit = function (image)
	{
		display.blit(image[0], pos);
	}
}
