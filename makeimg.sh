#!/bin/sh
tmp=/tmp/makeg8img
test ! -d $tmp && mkdir $tmp
make_only=none
make=no
function make_img()
{
	make=$1
	shift
	while [[ -n "$1" ]]
	do
		make_only=$1
		shift
		make back.png "back1 back2 back3"
		make face.png "face1 face2 face3"
		make metama.png "metama1l metama1r"
		make top.png "top_n top_b top_l"
		make bottom.png "bottom1"
		make puri_face.png "puri1face puri2face puri3face"
		make nade_face.png "nade1face nade2face nade3face"
		make mekuri_left.png "mekuriL1bottom mekuriL2bottom mekuriL3bottom"
		make mekuri_right.png "mekuriR1bottom mekuriR2bottom mekuriR3bottom"
		make mekuri_end.png "mekuriE1front mekuriE2front mekuriE1bottom mekuriE2bottom"
		make deko_face.png "deko1face deko2face deko3face"
		make deko_back.png "deko2back1 deko2back2 deko2back3"
		make pero_top.png "pero1top1 pero2top1 pero3top1 pero1top2 pero2top2 pero3top2"
		make takusiage_bottom.png "takusiagebottom takusiageE1bottom takusiageE2bottom"
	done
}

function make()
{
	local file=$1
	if [[ "$make_only" == "all" || "$file" == $make_only* ]]
	then
		test "$make" == "make" && do_make "$file" "$2" || \
			do_print "$file" "$2"
	fi
}

function do_make()
{
	echo make $1 $2
	local makecmd="convert"
	pushd raw &> /dev/null
	for s in $2
	do
		conv_img $s
		makecmd="$makecmd $tmp/$s.png"
	done
	popd
	makecmd="$makecmd +append ./image/$1"
	echo $makecmd
	$makecmd
}

function do_print()
{
	cat << DOC
gen_image_rect(img_data,
	"./image/$1 $2", 500, 700);
DOC
}

conv_only=$1
function conv_img()
{
	while [[ -n "$1" ]]
	do
		conv_only=$1
		shift
		conv back1.png bh
		conv back2.png bh2
		conv back3.png bh bh3
		conv top_n.png t ^tp st
		conv top_b.png tl tr t ^tp stl str st
		conv top_l.png tl t ^tp stl st
		conv bottom1.png b ^bp sb
		conv face1.png fb f1 e1 h1 m1
		conv face2.png fb f1 e2 h1 m1
		conv face3.png fb f1 e3 h1 m1
		conv metama1l.png metama1l
		conv metama1r.png metama1r
		conv puri1face.png fb f1 h1 puri2m - purih1
		conv puri2face.png fb puri2f puri2h puri2m - purih2
		conv puri3face.png fb puri3f puri3h puri3m - purih3
		conv nade1face.png fb f1 h1 nade2m
		conv nade2face.png fb f1 nade2h nade3m
		conv nade3face.png fb f1 nade3h nade3m
		conv mekuriR1bottom.png b ^bp mekuri1rsb - mekurih1
		conv mekuriR2bottom.png b ^bp mekuri2rsb - mekurih2
		conv mekuriR3bottom.png b ^bp mekuri3sb - mekurih3
		conv mekuriL1bottom.png b ^bp mekuri1lsb - mekurihl1
		conv mekuriL2bottom.png b ^bp mekuri2lsb - mekurihl2
		conv mekuriL3bottom.png b ^bp mekuri3sb - mekurihl3
		conv mekuriE1front.png mekuria1fr mekuria1sfr
		conv mekuriE2front.png mekuria2fr mekuria2sfr
		conv mekuriE1bottom.png b ^bp mekuria1sb
		conv mekuriE2bottom.png b ^bp mekuria2sb
		conv deko1face.png fb deko1f deko1h deko1m - dekoh2
		conv deko2face.png fb deko2f deko2h deko2m
		conv deko3face.png fb f1 h1 deko3m ^deko3a
		conv deko2back1.png deko2bh
		conv deko2back2.png deko2bh2
		conv deko2back3.png deko2bh deko2bh3
		conv pero1top1.png tr t ^tp str st pero1fr1 ^pero1sfr1 pero1t pero1st
		conv pero2top1.png tr t ^tp str st pero1fr1 ^pero1sfr2 pero1t pero1st
		conv pero3top1.png tr t ^tp str st pero1fr1 ^pero1sfr3 pero1t pero1st
		conv pero1top2.png tr t ^tp str st pero2fr1 ^pero2sfr1 pero2t pero2st
		conv pero2top2.png tr t ^tp str st pero2fr1 ^pero2sfr2 pero2t pero2st
		conv pero3top2.png tr t ^tp str st pero2fr1 ^pero2sfr3 pero2t pero2st
		conv takusiagebottom.png b ^bp mekuri3sb takusiagefr takusiagesfr
		conv takusiageE1bottom.png b ^bp takusiagea1sb takusiagea1fr takusiagea1sfr - pantssawaruh2
		conv takusiageE2bottom.png b ^bp sb takusiagea1fr takusiagea1sfr
	done
}

function conv()
{
	local file=$1
	shift
	if [[ "$file" == $conv_only* ]]
	then
		do_conv color $tmp/$file "$@"
#do_conv mono ../image_m/$file "$@"
	fi
}

function do_conv()
{
	local mono=""
	local color_postfix=".png"
	if [[ "$1" == "mono" ]]
	then
		mono="-level 0,0"
		color_postfix="c.png"
	fi
	shift

	local file=$1
	shift

	cmd="convert"
	next=""
	while [[ -n "$1" ]]
	do
		test "$1" == "-" && break
		local f=${1#^}
		if [[ -z "$mono" && "$1" == ^* ]]
		then
# only use color layer if not mono
			cmd="$cmd ${f}c.png $mono $next"
		elif [[ -e "${f}c.png" ]]
		then
			cmd="$cmd ${f}c.png $mono $next ${f}.png -composite"
		else
			cmd="$cmd ${f}.png $next"
		fi
		next="-composite"
		shift
	done
	cmd="$cmd -resize 500x700!"
	if [[ "$1" == "-" ]]
	then
		shift
		while [[ -n "$1" ]]
		do
			cmd="$cmd ../rawmisc/${1}.png -composite"
			shift
		done
	fi
	echo $cmd $file
	$cmd $file
}

hand_list="nadeh1 nadeh2 nadeh3 purih1 dekoh1 pantssawaruh1"
function make_hand()
{
	local cmd="convert"
	for s in $hand_list
	do
		cmd="$cmd ./rawmisc/$s.png"
	done
	cmd="$cmd +append ./imagemisc/hand.png"
	echo $cmd
	$cmd
}

icon_list="hair1 hair2 hair3 pero takusiage"
function make_icon()
{
	local cmd="convert"
	for s in $icon_list
	do
		cmd="$cmd ( ./rawmisc/icon_bg.png ./rawmisc/icon_$s.png"
		cmd="$cmd -composite ./rawmisc/icon_b.png -composite -resize 50 )"
	done
	cmd="$cmd +append ./imagemisc/icon.png"
	echo $cmd
	$cmd
}

function print_preload()
{
	echo '/* Auto generated file */'
#echo 'exports.mono = ['
#ls -CQ ./image_m/* | sed 's/\s\s*/, /g;s/$/, /'
#ls -CQ ./imagemisc/* | tac | sed 's/\s\s*/, /g;2,$s/$/, /' | tac
#echo '];'
	echo 'exports.color = exports.mono = ['
	ls -CQ ./image/* | sed 's/\s\s*/, /g;s/$/,/'
	ls -CQ ./imagemisc/* | tac | sed 's/\s\s*/, /g;2,$s/$/,/' | tac
	echo '];'
	cat << DOC
var img_data = exports.image_data = {};
var misc_data = exports.misc_data = {};
DOC
	make_img "print" "all"
	cat << DOC
gen_image_rect(misc_data,
    "./imagemisc/hand.png $hand_list", 500, 700);
gen_image_rect(misc_data,
    "./imagemisc/icon.png $icon_list", 50, 50);

function gen_image_rect(list, img_data, cell_width, cell_height)
{
    let data = img_data.split(/ /);
    let img_file = data[0];
    let ids = data.slice(1);
    for (let i = 0; i < ids.length; ++i) {
        let id = ids[i];
        list[id] = {file: img_file,
            rt: [ cell_width * i, 0, cell_width, cell_height ]};
    }
}
/* vim: set et ts=4 sts=4 sw=4: */
DOC

}

case "$1" in
"")
	print_preload
	;;
"hand")
	make_hand
	;;
"icon")
	make_icon
	;;
*)
	make_img "make" $@
	;;
esac

