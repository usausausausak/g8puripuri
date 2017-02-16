let gamejs = require("gamejs");
let $h = require("helper");
let $s = require("sprite");

exports.Action = function ()
{
    let left_rect = new gamejs.Rect(229, 202, 50, 60);
    let right_rect = new gamejs.Rect(418, 202, 50, 60);

    let hand_image = $h.load_misc("purih1");
    let images = $h.new_image_list("puri1face", "puri2face", "puri3face");

    let is_right = false;
    let device_pos_start = [0, 0];

    this.active = false;
    this.max_time = 0;

    this.start = function (sprite, device_pos)
    {
        if (left_rect.collidePoint(device_pos)) {
            $h.pos_assign(device_pos_start, device_pos);
            is_right = false;
            return true;
        } else if (right_rect.collidePoint(device_pos)) {
            $h.pos_assign(device_pos_start, device_pos);
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

    this.hover = function (display, sprite, device_pos)
    {
        if (left_rect.collidePoint(device_pos)) {
            $h.blit_image(display, hand_image, $s.DrawingPos());
        } else if (right_rect.collidePoint(device_pos)) {
            $h.blit_image(display, hand_image, $s.DrawingPos());
        }
    }

    this.hint = function (display, sprite, device_pos)
    {
        $h.draw_hints_rect(display, left_rect);
        $h.draw_hints_rect(display, right_rect);
    }

    this.update = function (display, sprite, device_pos, ms_pass)
    {
        let diff = $h.pos_diff(device_pos, device_pos_start);
        if (!is_right) {
            diff.x = -diff.x;
        }

        let level = parseInt(diff.x / 30);
        if (level > images.length - 1) {
            level = images.length - 1;
        }
        if (level < 0) {
            level = 0;
        }

        sprite.draw({ "face": images[level] });
        return true;
    }
}
/* vim: set et ts=4 sts=4 sw=4: */
