var gamejs = require("gamejs");
var $h = require("helper");

var pos = null;
exports.Pos = function ()
{
	return pos;
}

var image_list = exports.image_list = function ()
{
	var images = []
	for (var i in arguments) {
		images.push(new Image(arguments[i]));
	}
	return images;
}

var image_map = exports.image_map = function ()
{
	var images = {};
	for (var i in arguments) {
		var id = arguments[i];
		images[id] = new Image(id);
	}
	return images;
}

var Image = exports.Image = function (id)
{
	this.id = id;
	this.img = $h.load_image(id);
	this.end = false;
}

Image.prototype.reset = function () { }

Image.prototype.playing = Image.prototype.image = function ()
{
	return this.img;
}

// new Anime(wait_sec, "frame1", "frame2", "frame3"...);
var Anime = exports.Anime = function (interval)
{
	this.id = (arguments.length > 1) ? arguments[1] : "";
	this.frames = [];
	for (var i = 1; i < arguments.length; ++i) {
		var image = (arguments[i]) ?
			$h.load_image(arguments[i]) : null;
		this.frames.push({ wait: interval, img: image } );
	}
	this.frame_current = 0;
	this.ms_pass = 0;
	this.end = false;
	this.frame_last = this.frames.length - 1;
}

Anime.prototype.loop = function (flag)
{
	this.frame_last = (flag) ? 0 : this.frames.length - 1;
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
			this.frame_current = this.frame_last;
			this.end = (this.frame_current ==
				this.frames.length - 1);
			break;
		}
	}
	return this.frames[this.frame_current].img;
}

Anime.prototype.image = function ()
{
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
	var image = image_map(
		"back1", "top_b", "bottom1");
	var face_anime = new Anime(50, "face1", "face2", "face3");
	face_anime.frames[0].wait = 5000;
	face_anime.loop(true);
	var layer = {
		"back": image.back1,
		"face": face_anime,
		"top": image.top_b,
		"bottom": image.bottom1,
		"front": null
	};
	pos = [$h.center_x(layer.back.image()), 0];
	this.flags = { "hair1": false };
	this.set_layer = function (lid, image)
	{
		layer[lid] = image;
	}

	this.get_layer = function (lid)
	{
		return (layer[lid]) ? layer[lid].id : "";
	}

	this.playing = function (ms_pass, override)
	{
		this.playing_layer("back", ms_pass, override);
		this.playing_layer("face", ms_pass, override);
		this.playing_layer("top", ms_pass, override);
		this.playing_layer("bottom", ms_pass, override);
		this.playing_layer("front", ms_pass, override);
	}

	this.playing_layer = function (lid, ms_pass, override)
	{
		if ((override) && (override[lid])) {
			display.blit(override[lid], pos);
		} else if (layer[lid]) {
			display.blit(layer[lid].playing(ms_pass), pos);
		}
	}

	this.draw = function (override)
	{
		this.draw_layer("back", override);
		this.draw_layer("face", override);
		this.draw_layer("top", override);
		this.draw_layer("bottom", override);
		this.draw_layer("front", override);
	}

	this.draw_layer = function (lid, override)
	{
		if ((override) && (override[lid])) {
			display.blit(override[lid], pos);
		} else if (layer[lid]) {
			display.blit(layer[lid].image(), pos);
		}
	}
	this.blit = function (image)
	{
		display.blit(image.image(), pos);
	}
}
