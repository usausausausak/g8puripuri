let gamejs = require("gamejs");
let $h = require("helper");

let drawing_pos = null;
exports.DrawingPos = function ()
{
    return drawing_pos;
}

//
let Image = exports.Image = function (id)
{
    this.id = id;
    this.img = $h.load_image(id);
    this.end = false;
}

Image.prototype.reset = function () { }

Image.prototype.playing = Image.prototype.image = function ()
{
    return this.img;
}

let new_image_list = exports.new_image_list = function (...ids)
{
    return ids.map(id => new Image(id));
}

let new_image_map = exports.new_image_map = function (...ids)
{
    let images = {};
    for (let id of ids) {
        images[id] = new Image(id);
    }
    return images;
}

// new Anime(wait_sec, "frame1", "frame2", "frame3"...);
let Anime = exports.Anime = function (interval, ...ids)
{
    this.id = (ids.length > 0) ? ids[0] : "";

    this.frames = [];
    for (let id of ids) {
        let image = (id !== null) ? $h.load_image(id) : null;
        this.frames.push({ wait: interval, img: image } );
    }

    this.frame_current = 0;
    this.frame_last = this.frames.length - 1;

    this.ms_pass = 0;
    this.end = false;
}

Anime.prototype.loop = function (flag)
{
    this.frame_last = (flag) ? 0 : this.frames.length - 1;
}

Anime.prototype.reset = function ()
{
    this.frame_current = 0;
    this.ms_pass = 0;
    this.end = false;
}

Anime.prototype.playing = function (ms_pass)
{
    this.ms_pass += ms_pass;
    // maybe skip
    while (this.ms_pass >= this.frames[this.frame_current].wait) {
        this.ms_pass -= this.frames[this.frame_current].wait;
        ++this.frame_current;
        if (this.frame_current >= this.frames.length) {
            this.frame_current = this.frame_last;
            this.end = (this.frame_current == this.frames.length - 1);
            break;
        }
    }
    return this.frames[this.frame_current].img;
}

Anime.prototype.image = function ()
{
    return this.frames[this.frame_current].img;
}

// for override
let SpriteAnime = exports.SpriteAnime = function (layers)
{
    this.layers = layers;
    this.end = false;
}

SpriteAnime.prototype.reset = function ()
{
    this.end = false;
    for (let i in this.layers) {
        this.layers[i].reset();
    }
}

SpriteAnime.prototype.playing = function (ms_pass)
{
    let ret = {};
    this.end = true;
    for (let i in this.layers) {
        let layer = this.layers[i];
        if (!layer.end) {
            ret[i] = layer.playing(ms_pass);
            this.end = false;
        }
    }
    return ret;
}

//
let Sprite = exports.Sprite = function (display)
{
    let image_map = new_image_map("back1", "top_b", "bottom1");

    let face_anime = new Anime(50, "face1", "face2", "face3");
    face_anime.frames[0].wait = 5000;
    face_anime.loop(true);

    let layer = {
        "back": image_map.back1,
        "face": face_anime,
        "top": image_map.top_b,
        "bottom": image_map.bottom1,
        "front": null
    };

    let layer_base = {
        "back": image_map.back1,
        "face": face_anime,
        "top": image_map.top_b,
        "bottom": image_map.bottom1,
        "front": null
    };

    drawing_pos = new gamejs.Rect([$h.CENTER_X, 0, 500, 700]);
    this.flags = new Map();
    this.flags.set("hair1", false);

    this.set_layer = function (lid, image)
    {
        layer[lid] = image;
    }

    this.reset_layer = function (lid)
    {
        layer[lid] = layer_base[lid];
    }

    this.get_layer = function (lid)
    {
        return (layer[lid]) ? layer[lid].id : "";
    }

    let playing_layer = function (lid, ms_pass, override)
    {
        let img = null;
        if ((override) && (override[lid])) {
            img = override[lid];
        } else if (layer[lid]) {
            img = layer[lid].playing(ms_pass);
        }

        if (img) {
            display.blit(img.img, drawing_pos, img.rt);
        }
    }

    this.playing = function (ms_pass, override)
    {
        playing_layer("back", ms_pass, override);
        playing_layer("face", ms_pass, override);
        playing_layer("top", ms_pass, override);
        playing_layer("bottom", ms_pass, override);
        playing_layer("front", ms_pass, override);
    }

    let draw_layer = function (lid, override)
    {
        let img = null;
        if ((override) && (override[lid])) {
            img = override[lid];
        } else if (layer[lid]) {
            img = layer[lid].image();
        }

        if (img) {
            display.blit(img.img, drawing_pos, img.rt);
        }
    }

    this.draw = function (override)
    {
        draw_layer("back", override);
        draw_layer("face", override);
        draw_layer("top", override);
        draw_layer("bottom", override);
        draw_layer("front", override);
    }

    this.enable_flag = function (...ids)
    {
        let v = ids.filter(id => !this.flags.has(id));
        for (let id of v) {
            this.flags.set(id, true);
        }
    }

    this.set_flag = function (...ids)
    {
        for (let id of ids) {
            this.flags.set(id, true);
        }
    }

    this.unset_flag = function (...ids)
    {
        for (let id of ids) {
            this.flags.set(id, false);
        }
    }

    this.is_flag_set = function (id)
    {
        return ((this.flags.has(id)) && (this.flags.get(id)));
    }

    this.is_flag_visible = function (id)
    {
        return this.flags.has(id);
    }
}
/* vim: set et ts=4 sts=4 sw=4: */
