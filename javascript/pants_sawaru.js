let gamejs = require("gamejs");
let $h = require("helper");
let $s = require("sprite");

exports.Action = function ()
{
    let rect = new gamejs.Rect(275, 522, 160, 60);

    let hand_image = $h.load_misc("pantssawaruh1");

    let anime = {
        top: new $s.Anime(300, "top_n"),
        bottom: new $s.Anime(70, "takusiageE1bottom", "takusiageE2bottom"),
    };
    anime.bottom.frames[1].wait = 230;

    let sprite_anime = new $s.SpriteAnime(anime);

    this.active = false;
    this.count = 0;

    this.start = function (sprite, device_pos)
    {
        if (!sprite.get_layer("bottom").match(/^takusiage/)) {
            return false;
        } else if (rect.collidePoint(device_pos)) {
            return true;
        } else {
            return false;
        }
    }

    this.end = function ()
    {
        this.active = false;
        this.count++;
        return sprite_anime;
    }

    this.hover = function (display, sprite, device_pos)
    {
        if ((sprite.get_layer("bottom").match(/^takusiage/)) &&
            (rect.collidePoint(device_pos))) {
            $h.blit_image(display, hand_image, $s.DrawingPos());
        }
    }

    this.hint = function (display, sprite, device_pos)
    {
        if (sprite.get_layer("bottom").match(/^takusiage/)) {
            $h.draw_hints_rect(display, rect);
        }
    }

    this.update = function (display, sprite, device_pos, ms_pass)
    {
        sprite.reset_layer("top");
        sprite.reset_layer("bottom");
        sprite.draw();
        return false;
    }
}
/* vim: set et ts=4 sts=4 sw=4: */
