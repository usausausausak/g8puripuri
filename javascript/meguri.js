var gamejs = require("gamejs");
var $h = require("helper");
var $s = require("sprite");

exports.Action = function ()
{
	var right_rects = [
		null,
		new gamejs.Rect(355, 612, 120, 50),
		new gamejs.Rect(325, 482, 120, 130),
		new gamejs.Rect(229, 312, 200, 170)
	];
	var left_rects = [
		null,
		new gamejs.Rect(245, 612, 110, 50),
		new gamejs.Rect(275, 482, 120, 130),
		new gamejs.Rect(291, 312, 200, 170)
	];
	var right_image = $h.image_list(
		"meguri1skirt", "meguri2skirt", "meguri3skirt");
	var left_image = $h.image_list(
		"meguri_left1skirt", "meguri_left2skirt",
		"meguri_left3skirt");
	var anime = {
		body: new $s.Anime(70, "meguria1body", "meguria2body"),
		skirt: new $s.Anime(70,
			"meguria1skirt", "meguria2skirt", "meguria3skirt")
	};
	anime.body.frames[1].wait = 300;
	anime.skirt.frames[2].wait = 230;
	var sprite_anime = new $s.SpriteAnime(anime);
	var rects = null;
	var image = null;
	var hold = [10000, 200, 3000];
	var hold_pass = 0;
	var last_level = 0;
	var in_anime = false;
	var mouse_start = [0, 0];
	function in_rects(mouse)
	{
		for (var i = 1; i < rects.length; ++i) {
			var rect = rects[i];
			if (rect.collidePoint(mouse)) {
				return i;
			}
		}
		return 0;
	}
	this.active = false;
	this.start = function (mouse)
	{
		if (right_rects[1].collidePoint(mouse)) {
			$h.mouse_copy(mouse_start, mouse);
			rects = right_rects;
			image = right_image;
			return true;
		} else if (left_rects[1].collidePoint(mouse)) {
			$h.mouse_copy(mouse_start, mouse);
			rects = left_rects;
			image = left_image;
			return true;
		} else {
			return false;
		}
	}
	this.end = function ()
	{
		this.active = false;
		var ret = (in_anime) ? sprite_anime : null;
		hold_pass = 0;
		in_anime = false;
		return ret;
	}
	this.hint = function (display, sprite, mouse)
	{
		$h.draw_hints_rect(display, left_rects);
		$h.draw_hints_rect(display, right_rects);
	}
	this.update = function (display, sprite, mouse, ms_pass)
	{
		hold_pass += ms_pass;
		var diff = $h.mouse_diff(mouse, mouse_start);
		var level = in_rects(mouse);
		if (last_level != level) {
			hold_pass = 0;
			last_level = level;
		}
		if (!level) {
			sprite.draw();
			return false;
		} else {
			--level;
			in_anime = (hold_pass > hold[level]);
			sprite.draw({ "skirt": image[level] });
			return (!in_anime);;
		}
	}
}
