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
    let hold_pass = 0; // time of no moving
    let total_pass = 0;
    let last_level = 0;
    let device_pos_start = [0, 0];

    let max_time = 0;

    this.title = "puripuri";
    this.active = false;

    this.report = function ()
    {
        return `${max_time / 1000}sec`;
    }

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

        hold_pass = 0;
        total_pass = 0;
        last_level = 0;
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
        hold_pass += ms_pass;
        total_pass += ms_pass;

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

        if (last_level !== level) {
            last_level = level;
            hold_pass = 0;
        }

        if (hold_pass >= 400) {
            hold_pass = 0;
            total_pass = 0;
        }

        if (total_pass > max_time) {
            max_time = total_pass;
        }

        sprite.draw({ "face": images[level] });
        return true;
    }
}
/* vim: set et ts=4 sts=4 sw=4: */
