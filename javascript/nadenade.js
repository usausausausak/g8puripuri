var gamejs = require("gamejs");
var $h = require("helper");
var $s = require("sprite");

exports.Action = function ()
{
	var rect = new gamejs.Rect(191 + 99, 33, 110, 44);
	var hand_image = $h.misc_list("nadeh2", "nadeh1", "nadeh3");
	var image = $h.image_list("nade2face", "nade1face", "nade3face");
	var face = 1;
	var hand = 1;
	var sec_pass = 0;
	var hold_pass = 0;
	var mouse_start = [0, 0];
	this.active = false;
	this.start = function (sprite, mouse)
	{
		$h.mouse_copy(mouse_start, mouse);
		return rect.collidePoint(mouse);
	}
	this.end = function ()
	{
		this.active = false;
		face = 1;
		hand = 1;
		sec_pass = 0;
		hold_pass = 0;
		return null;
	}
	this.hover = function (display, sprite, mouse)
	{
		if (rect.collidePoint(mouse))
			display.blit(hand_image[1], $s.Pos());
	}
	this.hint = function (display, sprite, mouse)
	{
		$h.draw_hints_rect(display, rect);
	}
	this.update = function (display, sprite, mouse, ms_pass)
	{
		sec_pass += ms_pass;
		hold_pass += ms_pass;
		var diff = $h.mouse_diff(mouse, mouse_start);
		if ((hand > 0) && (diff.x < -30)) {
			mouse_start[0] = mouse[0];
			sec_pass = 0;
			hand--;
			if (face > 0) face--;
		} else if ((hand < hand_image.length - 1) && (diff.x > 30)) {
			mouse_start[0] = mouse[0];
			sec_pass = 0;
			hand++;
			if (face < image.length - 1) face++;
		}
		if (sec_pass >= 400) {
			sec_pass = 0;
			hold_pass = 0;
		} else if (sec_pass > 50) {
			face = 1;
		}

		sprite.draw({ "face": image[face] });
		display.blit(hand_image[hand], $s.Pos());

		if (hold_pass >= 3000) {
			sprite.set_flags("hair2");
		}
		return true;
	}
}
