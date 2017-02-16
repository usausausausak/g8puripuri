let gamejs = require("gamejs");
let $img_list = require("img_list");

let SCREEN_WIDTH = exports.SCREEN_WIDTH = 700;
let SCREEN_HEIGHT = exports.SCREEN_HEIGHT = 700;
let SPRITE_WIDTH = 500;
exports.CENTER_X = (SCREEN_WIDTH - SPRITE_WIDTH) / 2;

exports.pos_diff = function (lhs, rhs)
{
    return { x: lhs[0] - rhs[0], y: lhs[1] - rhs[1] };
}

// lhs = rhs
exports.pos_assign = function (lhs, rhs)
{
    lhs[0] = rhs[0];
    lhs[1] = rhs[1];
}

let image_cachaes = {};
function get_image(img_file)
{
    if (!image_cachaes[img_file]) {
        let img = gamejs.image.load(img_file);
        image_cachaes[img_file] = img;
    }
    return image_cachaes[img_file];
}

exports.blit_image = function (display, image, pos)
{
    display.blit(image.img, pos, image.rt);
}

let load_misc = exports.load_misc = function (id)
{
    // TODO: don't use fallback
    if (!$img_list.misc_data[id]) {
        let file = "./imagemisc/" + id + ".png";
        let img = get_image(file);
        let size = img.getSize();
        return { img: img,
                 rt: new gamejs.Rect(0, 0, size[0], size[1]) };
    } else {
        let data = $img_list.misc_data[id];
        return { img: get_image(data.file),
                 rt: new gamejs.Rect(data.rt) };
    }
}

exports.new_misc_list = function (...ids)
{
    return ids.map(id => load_misc(id));
}

exports.new_misc_map = function (...ids)
{
    let images = {};
    for (let id of ids) {
        images[id] = load_misc(id);
    }
    return images;
}

exports.misc_rt = function (id)
{
    return $img_list.misc_rt[id];
}

let load_image = exports.load_image = function (id)
{
    if (!$img_list.image_data[id]) {
        console.log(`helper.load_image: "${id}" not found`);
        return null;
    } else {
        let data = $img_list.image_data[id];
        return { img: get_image(data.file),
                 rt: new gamejs.Rect(data.rt) };
    }
}

exports.new_image_list = function (...ids)
{
    return ids.map(id => load_image(id));
}

exports.new_image_map = function (...ids)
{
    let images = {};
    for (let id of ids) {
        images[id] = load_image(id);
    }
    return images;
}

let draw_hints_rect = exports.draw_hints_rect = function (display, rect)
{
    if (rect instanceof Array) {
        for (let rt of rect) {
            draw_hints_rect(display, rt);
        }
    } else if (rect instanceof gamejs.Rect) {
        gamejs.draw.rect(display, "rgba(255, 0, 0, 0.2)", rect);
    }
}
/* vim: set et ts=4 sts=4 sw=4: */
