var gamejs = require("gamejs");
var $h = require("helper");
var $s = require("sprite");

exports.Action = function ()
{
	var rect = new gamejs.Rect(275, 522, 160, 60);
	var hand_image = $h.misc_list("pantssawaruh1");
	var anime = {
		top: new $s.Anime(300, "top_n"),
		bottom: new $s.Anime(70,
			"takusiageE1bottom", "takusiageE2bottom"),
	};
	anime.bottom.frames[1].wait = 230;
	var sprite_anime = new $s.SpriteAnime(anime);
	this.active = false;
	this.start = function (sprite, mouse)
	{
		if (!sprite.get_layer("bottom").match(/^takusiage/)) {
			return false;
		} else if (rect.collidePoint(mouse)) {
			return true;
		} else {
			return false;
		}
	}
	this.end = function ()
	{
		this.active = false;
		return sprite_anime;
	}
	this.hover = function (display, sprite, mouse)
	{
		if ((sprite.get_layer("bottom").match(/^takusiage/)) &&
			(rect.collidePoint(mouse))) {
			display.blit(hand_image[0], $s.Pos());
		}
	}
	this.hint = function (display, sprite, mouse)
	{
		if (sprite.get_layer("bottom").match(/^takusiage/)) {
			$h.draw_hints_rect(display, rect);
		}
	}
	this.update = function (display, sprite, mouse, ms_pass)
	{
		sprite.reset_layer("top");
		sprite.reset_layer("bottom");
		sprite.draw();
		return false;
	}
}
