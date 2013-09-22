exports.color = exports.mono = [
"./image/back.png", "./image/meguri_right.png", 
"./image/bottom.png", "./image/nade_face.png", 
"./image/deko_back.png", "./image/pero_top.png", 
"./image/deko_face.png", "./image/puri_face.png", 
"./image/face.png", "./image/takusiage_bottom.png", 
"./image/meguri_end.png", "./image/top.png", 
"./image/meguri_left.png", 
"./imagemisc/bg.jpg", "./imagemisc/hand.png", "./imagemisc/icon.png"
];
var img_data = exports.image_data = {};
var misc_data = exports.misc_data = {};
gen_image_rect(img_data,
	"./image/back.png back1 back2 back3", 500, 700);
gen_image_rect(img_data,
	"./image/face.png face1 face2 face3", 500, 700);
gen_image_rect(img_data,
	"./image/top.png top_n top_b top_l", 500, 700);
gen_image_rect(img_data,
	"./image/bottom.png bottom1", 500, 700);
gen_image_rect(img_data,
	"./image/puri_face.png puri1face puri2face puri3face", 500, 700);
gen_image_rect(img_data,
	"./image/nade_face.png nade1face nade2face nade3face", 500, 700);
gen_image_rect(img_data,
	"./image/meguri_left.png meguriL1bottom meguriL2bottom meguriL3bottom", 500, 700);
gen_image_rect(img_data,
	"./image/meguri_right.png meguriR1bottom meguriR2bottom meguriR3bottom", 500, 700);
gen_image_rect(img_data,
	"./image/meguri_end.png meguriE1front meguriE2front meguriE1bottom meguriE2bottom", 500, 700);
gen_image_rect(img_data,
	"./image/deko_face.png deko1face deko2face deko3face", 500, 700);
gen_image_rect(img_data,
	"./image/deko_back.png deko2back1 deko2back2 deko2back3", 500, 700);
gen_image_rect(img_data,
	"./image/pero_top.png pero1top1 pero2top1 pero3top1 pero1top2 pero2top2 pero3top2", 500, 700);
gen_image_rect(img_data,
	"./image/takusiage_bottom.png takusiagebottom takusiageE1bottom takusiageE2bottom", 500, 700);
gen_image_rect(misc_data,
	"./imagemisc/hand.png nadeh1 nadeh2 nadeh3 purih1 dekoh1 pantssawaruh1", 500, 700);
gen_image_rect(misc_data,
	"./imagemisc/icon.png hair1 hair2 hair3 pero takusiage", 50, 50);

function gen_image_rect(list, img_data, cell_width, cell_height)
{
	var data = img_data.split(/ /);
	var img_file = data[0];
	var ids = data.slice(1);
	for (var i = 0; i < ids.length; ++i) {
		var id = ids[i];
		list[id] = { file: img_file,
			rt: [ cell_width * i, 0, cell_width, cell_height ]};
	}
}
