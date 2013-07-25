var gamejs = require("gamejs");
var $h = require("helper");
var $s = require("sprite");

exports.Action = function ()
{
	var rect = new gamejs.Rect(310, 100, 70, 70);
	var bar_rect = new gamejs.Rect(380, 70, 100, 20);
	var cur_rect = bar_rect.clone();
	var hand_image = $h.misc_list("dekoh1");
	var hair_anime = {
		back1: new $s.Anime(50, null, "deko2back1"),
		back2: new $s.Anime(50, null, "deko2back2"),
		back3: new $s.Anime(50, null, "deko2back3"),
		};
	hair_anime.back1.frames[1].wait = 100;
	hair_anime.back2.frames[1].wait = 100;
	hair_anime.back3.frames[1].wait = 100;
	var anime = {
		face: new $s.Anime(50,
			"deko1face", "deko2face", "deko3face"),
		back: hair_anime.back1
		};
	anime.face.frames[1].wait = 100;
	anime.face.frames[2].wait = 300;
	var sprite_anime = new $s.SpriteAnime(anime);
	var sec_pass = 0;
	var hold_sec = 1000;
	var mouse_start = [0, 0];
	var count = 0;
	this.active = false;
	this.start = function (mouse)
	{
		$h.mouse_copy(mouse_start, mouse);
		return rect.collidePoint(mouse);
	}
	this.end = function ()
	{
		this.active = false;
		var ret = (sec_pass >= hold_sec) ? sprite_anime : null;
		sec_pass = 0;
		cur_rect.width = 0;
		return ret;
	}
	this.hint = function (display, sprite, mouse)
	{
		$h.draw_hints_rect(display, rect);
	}
	this.update = function (display, sprite, mouse, ms_pass)
	{
		sec_pass += ms_pass;
		if (sec_pass >= hold_sec) {
			sec_pass = hold_sec;
			var back = sprite.get_layer("back");
			anime.back = hair_anime[back];
			if ((sprite.flags.candy == undefined) && (++count >= 5)) {
				sprite.flags.candy = true;
			}
		}
		cur_rect.width = sec_pass / hold_sec * 100;
		sprite.playing(ms_pass);
		display.blit(hand_image[0], $s.Pos());
		gamejs.draw.rect(display, "rgba(0, 0, 255, 0.3)", bar_rect);
		gamejs.draw.rect(display, "rgba(0, 0, 255, 0.3)", cur_rect);
		return (sec_pass < hold_sec);
	}
}
