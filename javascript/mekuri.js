let gamejs = require("gamejs");
let $h = require("helper");
let $s = require("sprite");

exports.Action = function ()
{
    let right_rects = [
        null,
        new gamejs.Rect(355, 612, 120, 50),
        new gamejs.Rect(325, 482, 120, 130),
        new gamejs.Rect(229, 312, 200, 170)
    ];
    let left_rects = [
        null,
        new gamejs.Rect(245, 612, 110, 50),
        new gamejs.Rect(275, 482, 120, 130),
        new gamejs.Rect(291, 312, 200, 170)
    ];

    let left_images = $h.new_image_list("mekuriL1bottom",
                                       "mekuriL2bottom",
                                       "mekuriL3bottom");
    let right_images = $h.new_image_list("mekuriR1bottom",
                                        "mekuriR2bottom",
                                        "mekuriR3bottom");

    let anime = {
        top: new $s.Anime(370, "top_l"),
        bottom: new $s.Anime(70, "mekuriE1bottom", "mekuriE2bottom", null),
        front: new $s.Anime(70, "mekuriE1front", "mekuriE2front")
    };
    anime.bottom.frames[2].wait = 230;
    anime.front.frames[1].wait = 300;
    let sprite_anime = new $s.SpriteAnime(anime);

    let rects = null;
    let images = null;
    let hold_times = [10000, 200, 300];

    let hold_pass = 0;
    let last_level = 0;
    let in_stop_anime = false;

    let in_rects = function (device_pos)
    {
        for (let i = 1; i < rects.length; ++i) {
            let rect = rects[i];
            if (rect.collidePoint(device_pos)) {
                return i;
            }
        }
        return 0;
    }

    let count = 0;

    this.title = "mekuri";
    this.active = false;

    this.report = function ()
    {
        return `${count}`;
    }

    this.start = function (sprite, device_pos)
    {
        if (sprite.get_layer("bottom").match(/^takusiage/)) {
            return false;
        } else if (right_rects[1].collidePoint(device_pos)) {
            rects = right_rects;
            images = right_images;
            return true;
        } else if (left_rects[1].collidePoint(device_pos)) {
            rects = left_rects;
            images = left_images;
            return true;
        } else {
            return false;
        }
    }

    this.end = function (sprite)
    {
        this.active = false;
        if (last_level >= hold_times.length) {
            count++;
        }

        let end_anime = (in_stop_anime) ? sprite_anime : null;

        hold_pass = 0;
        last_level = 0;
        in_stop_anime = false;
        return end_anime;
    }

    this.hint = function (display, sprite, device_pos)
    {
        if (!sprite.get_layer("bottom").match(/^takusiage/)) {
            $h.draw_hints_rect(display, left_rects);
            $h.draw_hints_rect(display, right_rects);
        }
    }

    this.update = function (display, sprite, device_pos, ms_pass)
    {
        hold_pass += ms_pass;

        let level = in_rects(device_pos);
        if (last_level != level) {
            hold_pass = 0;
            last_level = level;
        }

        if (!level) {
            sprite.draw();
            return false;
        } else {
            --level;
            in_stop_anime = (hold_pass > hold_times[level]);
            if (sprite.get_layer("top").match(/^pero/)) {
                in_stop_anime = false;
            }

            sprite.playing(ms_pass, { "bottom": images[level] });
            return (!in_stop_anime);
        }
    }
}
/* vim: set et ts=4 sts=4 sw=4: */
