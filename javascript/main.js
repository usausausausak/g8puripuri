var gamejs = require("gamejs");
var $h = require("helper");
var $s = require("sprite");
var $a = {
	"Puripuri": require("puripuri").Action,
	"Nadenade": require("nadenade").Action,
	"Meguri": require("meguri").Action,
	"Dekopin": require("dekopin").Action,
	"PantsSawaru": require("pants_sawaru").Action
}

var $img_list = require("img_list");
var MOUSE_ID = "mouse";

var font = null;
var sprite = null;
var bg_sprite = null;
var futuu = null;
var all_action = [];
var argv = $h.argv;

var running = { id: "", mouse: [0, 0], action: null };
var mouse = [0, 0];

function Icon()
{
	var image = $s.image_map("back1", "back2", "back3", "top_n");
	var all_icon = {};
	var icons_line = "hair1 hair2 hair3,pero takusiage".split(/,/);
	for (var i = 0; i < icons_line.length; ++i) {
		var icons = icons_line[i].split(/ /);
		for (var j = 0; j < icons.length; ++j) {
			var id = icons[j];
			all_icon[id] = {
				img: $h.load_misc(id),
				pos: new gamejs.Rect(j * 55,
					520 + i * 60, 50, 50)
			};
		};
	}
	var hair_count = 0;

	var enable = function ()
	{
		for (var i in arguments) {
			var id = arguments[i];
			if (sprite.flags[id] != undefined) {
				sprite.flags[id] = true;
			}
		}
	}

	var disable = function ()
	{
		for (var i in arguments) {
			var id = arguments[i];
			if (sprite.flags[id] != undefined) {
				sprite.flags[id] = false;
			}
		}
	}

	var Peropero = function ()
	{
		var pero_anime = [
			new $s.Anime(300, "pero1top1", "pero1top2"),
			new $s.Anime(300, "pero2top1", "pero2top2"),
			new $s.Anime(300, "pero3top1", "pero3top2")];
		for (var i in pero_anime) {
			pero_anime[i].loop(true);
		}
		var sec_pass = 0;
		var pero = 0;
		var count = 0;
		var anime = pero_anime[0];
		this.id = "pero";
		this.reset = function ()
		{
			sec_pass = 0;
			pero = 0;
			anime = pero_anime[0];
			for (var i in pero_anime) {
				pero_anime[i].reset();
			}
		}
		this.playing = function (ms_pass)
		{
			sec_pass += ms_pass;
			if (sec_pass >= 2000) {
				if (++pero < pero_anime.length) {
					sec_pass = 0;
					anime = pero_anime[pero];
				} else {
					enable("pero", "takusiage");
					sprite.reset_layer("top");
					if (++count >= 5) {
						sprite.set_flags("takusiage");
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
	var pero_anime = new Peropero();
	var Takusiage = function ()
	{
		var sec_pass = 0;
		var anime = new $s.Image("takusiagebottom");
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
	var takusiae_anime = new Takusiage();

	this.click = function (mouse)
	{
		for (var id in all_icon) {
			if ((sprite.flags[id]) &&
				(all_icon[id].pos.collidePoint(mouse))) {
				this.start_flag(id);
				break;
			}
		}
	}

	this.update = function () { }

	this.start_flag = function (id)
	{
		sprite.flags[id] = false;
		if ((id.match(/hair/)) && (++hair_count >= 7)) {
			sprite.set_flags("hair3");
		}
		switch (id) {
		case "hair1":
			enable("hair2", "hair3");
			sprite.set_layer("back", image.back1);
			break;
		case "hair2":
			enable("hair1", "hair3");
			sprite.set_layer("back", image.back2);
			break;
		case "hair3":
			enable("hair1", "hair2");
			sprite.set_layer("back", image.back3);
			break;
		case "pero":
			pero_anime.reset();
			sprite.set_layer("top", pero_anime);
			// stop takusiage when pero give
			if (sprite.get_layer("bottom").match(
				/^takusiage/)) {
				enable("takusiage");
				sprite.reset_layer("bottom");
			}
			disable("takusiage");
			break;
		case "takusiage":
			takusiae_anime.reset();
			sprite.set_layer("top", image.top_n);
			sprite.set_layer("bottom", takusiae_anime);
			break;
		}
	}

	this.draw = function (display)
	{
		for (var id in all_icon) {
			var icon = all_icon[id];
			if (sprite.flags[id]) {
				$h.blit_image(display, icon.img, icon.pos);
			}
		}
	}
	this.enable_all = function (sprite)
	{
		for (var id in all_icon) {
			sprite.set_flags(id);
		}
	}
}

function Futuu()
{
	var icon = new Icon();
	this.active = false;
	this.start = function (sprite, mouse)
	{
		icon.click(mouse);
		return false;
	}
	this.end = function () { }
	this.hint = function (display, sprite, mouse) { }
	this.update = function (display, sprite, mouse, ms_pass)
	{
		sprite.playing(ms_pass);
		return true;
	}

	this.draw_icon = function (display)
	{
		icon.draw(display);
	}

	this.enable_all = function (sprite)
	{
		icon.enable_all(sprite);
	}
}

function EndAnime(sprite_anime)
{
	sprite_anime.reset();
	this.start = function (sprite, mouse) { return true; }
	this.end = function () {}
	this.update = function (display, sprite, mouse, ms_pass)
	{
		sprite.draw(sprite_anime.playing(ms_pass));
		return (!sprite_anime.end);
	}
}

function init_action()
{
	all_action.push(new $a.Puripuri());
	all_action.push(new $a.Nadenade());
	all_action.push(new $a.Meguri());
	all_action.push(new $a.Dekopin());
	all_action.push(new $a.PantsSawaru());
	all_action.push(futuu = new Futuu());
}

function draw_hint(display)
{
	for (var i in all_action) {
		var action = all_action[i];
		if (action.hover)
			action.hover(display, sprite, mouse);
	}
	if (argv.show_hints) {
		for (var i in all_action) {
			var action = all_action[i];
			action.hint(display, sprite, mouse);
		}
	}
}

function start_mouse(mouse_id, mouse)
{
	if (running.id) return;
	for (var i in all_action) {
		var action = all_action[i];
		if ((!action.active) && (action.start(sprite, mouse))) {
			action.active = true;
			running.id = mouse_id;
			running.action = action;
			$h.mouse_copy(running.mouse, mouse);
			break;
		}
	}
}

function update_mouse(mouse_id, pos)
{
	if (running.id != mouse_id) return;
	$h.mouse_copy(running.mouse, pos);
}

function end_mouse(mouse_id)
{
	if (running.id != mouse_id) return;
	var end_anime = running.action.end();
	running.action = (end_anime) ? new EndAnime(end_anime) : futuu;
	running.id = "";
}

function update_running(display, sprite, ms_pass)
{
	if (!running.action.update(display, sprite,
		running.mouse, ms_pass)) {
		end_mouse(running.id);
	}
}

function init_touch()
{
	var displayCanvas = document.getElementById("gjs-canvas");
	function getCanvasOffset () {
		var boundRect = displayCanvas.getBoundingClientRect();
		return [boundRect.left, boundRect.top];
	}
	function touch_start(ev){
		ev.preventDefault();
		var canvasOffset = getCanvasOffset();
		var touch = ev.touches[0];
		var mouse = [
			touch.clientX - canvasOffset[0],
			touch.clientY - canvasOffset[1]];
		start_mouse(touch.identifier, mouse);
	}
	function touch_end(ev){
		var touch = ev.changedTouches[0];
		end_mouse(touch.identifier);
	}
	function touch_move(ev){
		ev.preventDefault();
		var canvasOffset = getCanvasOffset();
		var touch = ev.touches[0];
		var mouse = [
			touch.clientX - canvasOffset[0],
			touch.clientY - canvasOffset[1]];
		update_mouse(touch.identifier, mouse);
	}
	document.addEventListener("touchstart", touch_start, false);
	document.addEventListener("touchend", touch_end, false);
	document.addEventListener("touchmove", touch_move, false);
}

function main()
{
	font = new gamejs.font.Font('20px monospace');

	var display = gamejs.display.setMode(
		[$h.SCREEN_WIDTH, $h.SCREEN_HEIGHT]);

	init_action();
	init_touch();
	gamejs.onEvent(function (event) {
		if (event.type === gamejs.event.MOUSE_MOTION) {
			$h.mouse_copy(mouse, event.pos);
			update_mouse(MOUSE_ID, event.pos);
		} else if (event.type === gamejs.event.MOUSE_DOWN) {
			start_mouse(MOUSE_ID, event.pos);
		} else if (event.type === gamejs.event.MOUSE_UP) {
			end_mouse(MOUSE_ID);
		}
	});

	sprite = new $s.Sprite(display);
	if (argv.bg) bg_sprite = gamejs.image.load("./imagemisc/bg.jpg");
	if (argv.debug) futuu.enable_all(sprite);

	var fps_sec = 0, fps = 0, fps_last = 0;
	running.action = futuu;
	gamejs.onTick(function (ms_pass) {
		// fps
		fps_sec += ms_pass;
		fps++;
		if (fps_sec >= 1000) {
			fps_last = fps;
			fps_sec = 0;
			fps = 0;
		}
		// update
		display.clear();
		if (bg_sprite) display.blit(bg_sprite);
		update_running(display, sprite, ms_pass);
		if (running.id == "") {
			draw_hint(display);
		}
		futuu.draw_icon(display);
		if (argv.debug) {
			display.blit(font.render("fps: " + fps_last));
			display.blit(font.render(running.mouse), [0, 20]);
			var pos = [0, 40];
			var a = "back,face,top,bottom,front".split(/,/);
			for (var i in a) {
				pos[1] += 20;
				var s = "+" + sprite.get_layer(a[i]);
				display.blit(font.render(s), pos);
			}
		}
	});
};

gamejs.preload((argv.mono) ? $img_list.mono : $img_list.color);
gamejs.ready(main);
