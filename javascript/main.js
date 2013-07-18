var gamejs = require("gamejs");
var $h = require("helper");
var $s = require("sprite");
var $a = {
	"Puripuri": require("puripuri").Action,
	"Nadenade": require("nadenade").Action,
	"Meguri": require("meguri").Action,
	"Dekopin": require("dekopin").Action
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
	var misc = $h.misc_map("icon_h1", "icon_h2", "icon_h3",
		"icon_candy");
	var image = $s.image_map("back1", "back2", "back3");
	var pero_anime = new $s.Anime(300, "pero1top1", "pero2top1");
	pero_anime.loop(true);
	var all_icon = {};
	all_icon.hair1 = { img: misc.icon_h1,
		rt: new gamejs.Rect(5, 500, 50, 50) };
	all_icon.hair2 = { img: misc.icon_h2,
		rt: new gamejs.Rect(60, 500, 50, 50) };
	all_icon.hair3 = { img: misc.icon_h3,
		rt: new gamejs.Rect(120, 500, 50, 50) };
	all_icon.candy = { img: misc.icon_candy,
		rt: new gamejs.Rect(5, 560, 50, 50) };

	var enable = function ()
	{
		for (var i in arguments) {
			var id = arguments[i];
			if (sprite.flags[id] != undefined) {
				sprite.flags[id] = true;
			}
		}
	}
	this.click = function (mouse)
	{
		for (var id in all_icon) {
			if ((sprite.flags[id]) &&
				(all_icon[id].rt.collidePoint(mouse))) {
				this.start_flag(id);
				break;
			}
		}
	}

	this.update = function () { }

	this.start_flag = function (id)
	{
		sprite.flags[id] = false;
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
		case "candy":
			sprite.set_layer("top", pero_anime);
			break;
		}
	}

	this.draw = function (display)
	{
		for (var id in all_icon) {
			var icon = all_icon[id];
			if (sprite.flags[id]) {
				display.blit(icon.img, icon.rt);
			}
		}
	}
	this.enable_all = function (sprite)
	{
		for (var id in all_icon) {
			sprite.flags[id] = true;
		}
	}
}

function Futuu()
{
	var pero_anime = [
		new $s.Anime(300, "pero1top1", "pero2top1"),
		new $s.Anime(300, "pero1top2", "pero2top2"),
		new $s.Anime(300, "pero1top3", "pero2top3")];
	for (var i in pero_anime) {
		pero_anime[i].loop(true);
	}
	var icon = new Icon();
	this.active = false;
	this.start = function (mouse)
	{
		icon.click(mouse);
		var match = sprite.get_layer("top").match(/pero1top([0-9])/);
		if (match) {
			var pero = parseInt(match[1]) - 1;
		}
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
	this.start = function (mouse) { return true; }
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
		if ((!action.active) && (action.start(mouse))) {
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
