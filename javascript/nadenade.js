let gamejs = require("gamejs");
let $h = require("helper");
let $s = require("sprite");

exports.Action = function ()
{
    let rect = new gamejs.Rect(191 + 99, 33, 110, 44);

    let hand_images = $h.new_misc_list("nadeh2", "nadeh1", "nadeh3");
    let images = $h.new_image_list("nade2face", "nade1face", "nade3face");

    let face = 1;
    let hand = 1;
    let hold_pass = 0; // time of no moving
    let total_pass = 0;
    let device_pos_start = [0, 0];

    this.active = false;
    this.max_time = 0;

    this.start = function (sprite, device_pos)
    {
        $h.pos_assign(device_pos_start, device_pos);
        return rect.collidePoint(device_pos);
    }

    this.end = function (sprite)
    {
        this.active = false;
        if (total_pass > this.time) {
            this.time = total_pass;
        }

        face = 1;
        hand = 1;
        hold_pass = 0;
        total_pass = 0;
        return null;
    }

    this.hover = function (display, sprite, device_pos)
    {
        if (rect.collidePoint(device_pos)) {
            $h.blit_image(display, hand_images[1], $s.DrawingPos());
        }
    }

    this.hint = function (display, sprite, device_pos)
    {
        $h.draw_hints_rect(display, rect);
    }

    this.update = function (display, sprite, device_pos, ms_pass)
    {
        hold_pass += ms_pass;
        total_pass += ms_pass;

        let diff = $h.pos_diff(device_pos, device_pos_start);
        if ((hand > 0) && (diff.x < -30)) {
            device_pos_start[0] = device_pos[0];
            hold_pass = 0;
            hand--;
            if (face > 0) {
                face--;
            }
        } else if ((hand < hand_images.length - 1) && (diff.x > 30)) {
            device_pos_start[0] = device_pos[0];
            hold_pass = 0;
            hand++;
            if (face < images.length - 1) {
                face++;
            }
        }

        if (hold_pass >= 400) {
            hold_pass = 0;
            total_pass = 0;
        } else if (hold_pass > 50) {
            face = 1;
        }

        sprite.draw({ "face": images[face] });
        $h.blit_image(display, hand_images[hand], $s.DrawingPos());

        if (total_pass >= 3000) {
            sprite.enable_flag("hair2");
        }
        return true;
    }
}
/* vim: set et ts=4 sts=4 sw=4: */
