let gamejs = require("gamejs");
let $h = require("helper");
let $s = require("sprite");
let $a = {
    "Puripuri": require("puripuri").Action,
    "Nadenade": require("nadenade").Action,
    "Mekuri": require("mekuri").Action,
    "Dekopin": require("dekopin").Action,
    "PantsSawaru": require("pants_sawaru").Action
}

let $img_list = require("img_list");

let DEVICE_ID_NONE = "no-device";
let DEVICE_ID_MOUSE = "mouse";

let sprite = null;
let futuu = null;
let actions = [];

let setting = new Map();
let running = { device_id: DEVICE_ID_NONE, device_pos: [0, 0], action: null };

function Parts()
{
    let image_map = $s.new_image_map("back1", "back2", "back3", "top_n");

    let icon_map = {};
    let icon_lines = "hair1 hair2 hair3,pero takusiage".split(/,/);
    for (let i = 0; i < icon_lines.length; ++i) {
        let icons = icon_lines[i].split(/ /);
        for (let j = 0; j < icons.length; ++j) {
            let id = icons[j];
            icon_map[id] = {
                img: $h.load_misc(id),
                pos: new gamejs.Rect(j * 55, 520 + i * 60, 50, 50)
            };
        };
    }

    this.counts = {"hair": 0,
                  "pero": 0,
                  "takusiage": 0};

    // only enable/disable parts if it is set
    let enable = function (...ids)
    {
        let v = ids.filter(id => sprite.is_flag_visible(id));
        sprite.set_flag.apply(sprite, v);
    }

    let disable = function (...ids)
    {
        let v = ids.filter(id => sprite.is_flag_visible(id));
        sprite.unset_flag.apply(sprite, v);
    }

    // like a Anime
    let Peropero = function ()
    {
        let pero_animes = [
            new $s.Anime(300, "pero1top1", "pero1top2"),
            new $s.Anime(300, "pero2top1", "pero2top2"),
            new $s.Anime(300, "pero3top1", "pero3top2")
        ];
        pero_animes.forEach(a => a.loop(true));

        let sec_pass = 0;
        let pero = 0;
        let count = 0;
        let anime = pero_animes[0];

        this.id = "pero";

        this.reset = function ()
        {
            sec_pass = 0;
            pero = 0;
            anime = pero_animes[0];
            pero_animes.forEach(a => a.reset());
        }

        this.playing = function (ms_pass)
        {
            sec_pass += ms_pass;
            if (sec_pass >= 2000) {
                if (++pero < pero_animes.length) {
                    sec_pass = 0;
                    anime = pero_animes[pero];
                } else {
                    enable("pero", "takusiage");
                    sprite.reset_layer("top");
                    sprite.set_metama_move(true);
                    if (++count >= 3) {
                        sprite.enable_flag("takusiage");
                    }
                }
            }
            return anime.playing(ms_pass);
        }

        this.image = function ()
        {
            return anime.image();
        }
    }
    let pero_anime = new Peropero();

    // like a Anime
    let Takusiage = function ()
    {
        let sec_pass = 0;
        let anime = new $s.Image("takusiagebottom");

        this.id = "takusiage";

        this.reset = function ()
        {
            sec_pass = 0;
        }

        this.playing = function (ms_pass)
        {
            sec_pass += ms_pass;
            if (sec_pass >= 10000) {
                enable("takusiage");
                sprite.reset_layer("top");
                sprite.reset_layer("bottom");
            }
            return anime.playing(ms_pass);
        }

        this.image = function ()
        {
            return anime.image();
        }
    }
    let takusiae_anime = new Takusiage();

    this.update = function () { }

    this.change = function (id)
    {
        sprite.unset_flag(false, id);
        switch (id) {
        case "hair1":
            this.counts.hair++;
            enable("hair2", "hair3");
            sprite.set_layer("back", image_map.back1);
            break;
        case "hair2":
            this.counts.hair++;
            enable("hair1", "hair3");
            sprite.set_layer("back", image_map.back2);
            break;
        case "hair3":
            this.counts.hair++;
            enable("hair1", "hair2");
            sprite.set_layer("back", image_map.back3);
            break;
        case "pero":
            this.counts.pero++;
            pero_anime.reset();
            sprite.set_layer("top", pero_anime);
            sprite.set_metama_move(false);

            // stop takusiage when pero give
            if (sprite.get_layer("bottom").match(/^takusiage/)) {
                enable("takusiage");
                sprite.reset_layer("bottom");
            }
            disable("takusiage");
            break;
        case "takusiage":
            this.counts.takusiage++;
            takusiae_anime.reset();
            sprite.set_layer("top", image_map.top_n);
            sprite.set_layer("bottom", takusiae_anime);
            break;
        }

        if (this.counts.hair >= 7) {
            sprite.enable_flag("hair3");
        }
    }

    this.click = function (device_pos)
    {
        let ids = Object.keys(icon_map).filter(id => sprite.is_flag_set(id));
        for (let id of ids) {
            let icon = icon_map[id];
            if (icon.pos.collidePoint(device_pos)) {
                this.change(id);
                break;
            }
        }
    }

    this.draw_icons = function (display)
    {
        for (let id in icon_map) {
            let icon = icon_map[id];
            if (sprite.is_flag_set(id)) {
                $h.blit_image(display, icon.img, icon.pos);
            }
        }
    }

    this.enable_all = function (sprite)
    {
        for (let id in icon_map) {
            sprite.enable_flag(id);
        }
    }
}

function Futuu()
{
    let parts = new Parts();

    let metama_level_x = [0, 100, 197, 487, 563];
    let metama_level_y = [0, 75, 157, 472, 600];

    this.active = false;

    this.start = function (sprite, device_pos)
    {
        parts.click(device_pos);
        return false;
    }

    this.end = function () { }
    this.hint = function (display, sprite, device_pos) { }

    this.update = function (display, sprite, device_pos, ms_pass)
    {
        let level = {x: 0, y: 0};
        metama_level_x.forEach((x, l) => {
            if (device_pos[0] >= x) {
                level.x = l;
            }
        });
        metama_level_y.forEach((y, l) => {
            if (device_pos[1] > y) {
                level.y = l;
            }
        });
        sprite.set_metama_level(level);

        sprite.playing(ms_pass);
        return true;
    }

    this.draw_icons = function (display)
    {
        parts.draw_icons(display);
    }

    this.enable_all = function (sprite)
    {
        parts.enable_all(sprite);
    }

    this.report_parts = function ()
    {
        return parts.counts;
    }
}

function EndAnime(sprite_anime)
{
    sprite_anime.reset();
    this.start = function (sprite, device_pos) {
        return true;
    }

    this.end = function () {}

    this.update = function (display, sprite, device_pos, ms_pass)
    {
        sprite.draw(sprite_anime.playing(ms_pass));
        return (!sprite_anime.end);
    }
}

function init_actions()
{
    futuu = new Futuu();
    actions.push(new $a.Puripuri());
    actions.push(new $a.Nadenade());
    actions.push(new $a.Mekuri());
    actions.push(new $a.Dekopin());
    actions.push(new $a.PantsSawaru());
    actions.push(futuu);
}

function draw_hint(display, device_pos, show_hints)
{
    for (let action of actions) {
        if (action.hover) {
            action.hover(display, sprite, device_pos);
        }
    }
    if (show_hints) {
        for (let action of actions) {
            action.hint(display, sprite, device_pos);
        }
    }
}

function input_start(device_id, device_pos)
{
    if (running.device_id !== DEVICE_ID_NONE) {
        return;
    }

    for (let action of actions) {
        if ((!action.active) && (action.start(sprite, device_pos))) {
            action.active = true;
            running.device_id = device_id;
            running.action = action;
            $h.pos_assign(running.device_pos, device_pos);
            break;
        }
    }
}

function input_update(device_id, device_pos)
{
    if ((running.device_id === DEVICE_ID_NONE) ||
        (running.device_id === device_id)) {
        $h.pos_assign(running.device_pos, device_pos);
    }
}

function input_end(device_id)
{
    if (running.device_id !== device_id) {
        return;
    }

    let end_anime = running.action.end(sprite);
    running.action = (end_anime) ? new EndAnime(end_anime) : futuu;
    running.device_id = DEVICE_ID_NONE;
}

function init_touch()
{
    let displayCanvas = document.getElementById("gjs-canvas");

    function getCanvasOffset () {
        let boundRect = displayCanvas.getBoundingClientRect();
        return [boundRect.left, boundRect.top];
    }

    function touch_start(ev){
        ev.preventDefault();
        let canvasOffset = getCanvasOffset();
        let touch = ev.touches[0];
        let pos = [touch.clientX - canvasOffset[0],
                   touch.clientY - canvasOffset[1]];
        input_start(touch.identifier, pos);
    }

    function touch_end(ev){
        let touch = ev.changedTouches[0];
        input_end(touch.identifier);
    }

    function touch_move(ev){
        ev.preventDefault();
        let canvasOffset = getCanvasOffset();
        let touch = ev.touches[0];
        let pos = [touch.clientX - canvasOffset[0],
                   touch.clientY - canvasOffset[1]];
        input_update(touch.identifier, pos);
    }

    document.addEventListener("touchstart", touch_start, false);
    document.addEventListener("touchend", touch_end, false);
    document.addEventListener("touchmove", touch_move, false);
}

function change_setting()
{
    setting.clear();

    let argv = document.location.hash.substr(1).split(/,/);
    for (let v of argv) {
        switch (v) {
            case "hints":
                setting.set("show_hints", true);
                break;
            case "report":
                setting.set("show_report", true);
                break;
            case "debug":
                setting.set("debug", true);
                setting.set("show_hints", true);
                setting.set("show_report", true);
                break;
            case "mono":
                setting.set("mono", true);
                break;
            case "bg":
                setting.set("bg", true);
                break;
        }
    }
}


function main()
{
    init_actions();

    init_touch();
    let display = gamejs.display.setMode([$h.SCREEN_WIDTH,
                                          $h.SCREEN_HEIGHT]);

    sprite = new $s.Sprite(display);
    let bg_sprite = gamejs.image.load("./imagemisc/bg.jpg");

    running.action = futuu;

    gamejs.onEvent(function (event) {
        if (event.type === gamejs.event.MOUSE_MOTION) {
            input_update(DEVICE_ID_MOUSE, event.pos);
        } else if (event.type === gamejs.event.MOUSE_DOWN) {
            input_start(DEVICE_ID_MOUSE, event.pos);
        } else if (event.type === gamejs.event.MOUSE_UP) {
            input_end(DEVICE_ID_MOUSE);
        }
    });

    // main loop
    let font = new gamejs.font.Font('20px monospace');
    let fps_sec = 0, fps = 0, fps_last = 0;
    let reports = actions.filter(action => action.report);
    gamejs.onTick(function (ms_pass) {
        // update
        if (setting.get("bg")) {
            display.blit(bg_sprite);
        } else {
            display.clear();
        }

        // running
        if (!running.action.update(display, sprite,
                                   running.device_pos, ms_pass)) {
            input_end(running.device_id);
        }
        if (running.device_id === DEVICE_ID_NONE) {
            draw_hint(display, running.device_pos, setting.get("show_hints"));
        }

        // draw parts icons
        futuu.draw_icons(display);

        // report
        if (setting.get("show_report")) {
            let p = [0, 0];
            for (let action of reports) {
                let s = `${action.title}: ${action.report()}`;
                display.blit(font.render(s), p);
                p[1] += 20;
            }

            let parts_report = futuu.report_parts();
            for (let id in parts_report) {
                p[1] += 20;
                let s = `${id}: ${parts_report[id]}`;
                display.blit(font.render(s), p);
            }
        }

        // debug
        if (setting.get("debug")) {
            futuu.enable_all(sprite);

            // fps
            fps_sec += ms_pass;
            fps++;
            if (fps_sec >= 1000) {
                fps_last = fps;
                fps_sec = 0;
                fps = 0;
            }
            display.blit(font.render("fps: " + fps_last),
                         [$h.SCREEN_WIDTH - 80, $h.SCREEN_HEIGHT - 35]);
            display.blit(font.render(running.device_pos),
                         [$h.SCREEN_WIDTH - 200, $h.SCREEN_HEIGHT - 35]);


            let p = [$h.SCREEN_WIDTH - 120, 0];
            // metama info
            let m = sprite.get_metama_level();
            display.blit(font.render(`+${m.x}, ${m.y}`), p);

            // parts info
            let v = "back,face,top,bottom,front".split(/,/);
            for (let part of v) {
                p[1] += 20;
                let s = `+${sprite.get_layer(part)}`;
                display.blit(font.render(s), p);
            }
        }
    });
};

// init setting
change_setting();
window.addEventListener("hashchange", change_setting, false);

gamejs.preload((setting.get("mono")) ? $img_list.mono : $img_list.color);
gamejs.ready(main);
/* vim: set et ts=4 sts=4 sw=4: */
