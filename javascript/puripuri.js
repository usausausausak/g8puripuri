var gamejs = require("gamejs");
var $h = require("helper");
var $s = require("sprite");

exports.Action = function ()
{
	var left_rect = new gamejs.Rect(229, 202, 50, 60);
	var right_rect = new gamejs.Rect(418, 202, 50, 60);
	var hand_image = $h.misc_list("purih1");
	var image = $h.image_list("puri1face", "puri2face", "puri3face");
	var is_right = false;
	var mouse_start = [0, 0];
	this.active = false;
	this.start = function (sprite, mouse)
	{
		if (left_rect.collidePoint(mouse)) {
			$h.mouse_copy(mouse_start, mouse);
			is_right = false;
			return true;
		} else if (right_rect.collidePoint(mouse)) {
			$h.mouse_copy(mouse_start, mouse);
			is_right = true;
			return true;
		} else {
			return false;
		}
	}
	this.end = function ()
	{
		this.active = false;
		return null;
	}
	this.hover = function (display, sprite, mouse)
	{
		if (left_rect.collidePoint(mouse)) {
			display.blit(hand_image[0], $s.Pos());
		} else if (right_rect.collidePoint(mouse)) {
			display.blit(hand_image[0], $s.Pos());
		}
	}
	this.hint = function (display, sprite, mouse)
	{
		$h.draw_hints_rect(display, left_rect);
		$h.draw_hints_rect(display, right_rect);
	}
	this.update = function (display, sprite, mouse, ms_pass)
	{
		var diff = $h.mouse_diff(mouse, mouse_start);
		if (!is_right) diff.x = -diff.x;
		var level = parseInt(diff.x / 30);
		if (level > image.length - 1)
			level = image.length - 1;
		if (level < 0) level = 0;

		sprite.draw({ "face": image[level] });
		return true;
	}
}
