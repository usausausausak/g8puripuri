let gamejs = require("gamejs");
let $h = require("helper");
let $s = require("sprite");

exports.Action = function ()
{
    let rect = new gamejs.Rect(310, 100, 70, 70);
    let bar_rect = new gamejs.Rect(380, 70, 100, 20);
    let cur_rect = bar_rect.clone();

    let hand_image = $h.new_misc_list("dekoh1");
    let hair_anime = { back1: new $s.Anime(50, null, "deko2back1"),
                       back2: new $s.Anime(50, null, "deko2back2"),
                       back3: new $s.Anime(50, null, "deko2back3") };
    hair_anime.back1.frames[1].wait = 100;
    hair_anime.back2.frames[1].wait = 100;
    hair_anime.back3.frames[1].wait = 100;

    let anime = {
        face: new $s.Anime(50, "deko1face", "deko2face", "deko3face"),
        back: hair_anime.back1
    };
    anime.face.frames[1].wait = 100;
    anime.face.frames[2].wait = 300;

    let sprite_anime = new $s.SpriteAnime(anime);
    let sec_pass = 0;
    let hold_sec = 1000;

    let count = 0;

    this.title = "dekopin";
    this.active = false;

    this.report = function ()
    {
        return `${count}`;
    }

    this.start = function (sprite, device_pos)
    {
        return rect.collidePoint(device_pos);
    }

    this.end = function (sprite)
    {
        this.active = false;
        if (sec_pass >= hold_sec) {
            count++;
        }

        if (count >= 5) {
            sprite.enable_flag("pero");
        }

        let end_anime = (sec_pass >= hold_sec) ? sprite_anime : null;

        sec_pass = 0;
        cur_rect.width = 0;
        return end_anime;
    }

    this.hint = function (display, sprite, device_pos)
    {
        $h.draw_hints_rect(display, rect);
    }

    this.update = function (display, sprite, device_pos, ms_pass)
    {
        sec_pass += ms_pass;
        sprite.playing(ms_pass);
        $h.blit_image(display, hand_image[0], $s.DrawingPos());

        cur_rect.width = sec_pass / hold_sec * 100;
        gamejs.draw.rect(display, "rgba(0, 0, 255, 0.3)", bar_rect);
        gamejs.draw.rect(display, "rgba(0, 0, 255, 0.3)", cur_rect);

        // end
        if (sec_pass >= hold_sec) {
            sec_pass = hold_sec;

            let back = sprite.get_layer("back");
            anime.back = hair_anime[back];
            if (sprite.get_layer("bottom").match(/^takusiage/)) {
                sprite.reset_layer("top");
                sprite.reset_layer("bottom");
            }
        }

        return (sec_pass < hold_sec);
    }
}
/* vim: set et ts=4 sts=4 sw=4: */
