#!/bin/sh
only=none
function conv()
{
	cd raw
	while [[ -n "$1" ]]
	do
		only=$1
		shift
		make back1.png bh
		make back2.png bh2
		make back3.png bh bh3
		make top_b.png t ^tp st
		make top_l.png tl ^tp stl
		make bottom1.png b ^bp sb
		make face1.png fb f1 h1 m1
		make face2.png fb f1 h1 m2
		make face3.png fb f1 h1 m3
		make puri1face.png fb f1 h1 puri2m - purih1
		make puri2face.png fb puri2f puri2h puri2m - purih2
		make puri3face.png fb puri3f puri3h puri3m - purih3
		make nade1face.png fb f1 h1 nade2m
		make nade2face.png fb f1 nade2h nade3m
		make nade3face.png fb f1 nade3h nade3m
		make meguriR1bottom.png b ^bp meguri1rsb - megurih1
		make meguriR2bottom.png b ^bp meguri2rsb - megurih2
		make meguriR3bottom.png b ^bp meguri3sb - megurih3
		make meguriL1bottom.png b ^bp meguri1lsb - megurihl1
		make meguriL2bottom.png b ^bp meguri2lsb - megurihl2
		make meguriL3bottom.png b ^bp meguri3sb - megurihl3
		make meguriE1front.png meguria1fr meguria1sfr
		make meguriE2front.png meguria2fr meguria2sfr
		make meguriE1bottom.png b ^bp meguria1sb
		make meguriE2bottom.png b ^bp meguria2sb
		make deko1face.png fb deko1f deko1h deko1m - dekoh2
		make deko2face.png fb deko2f deko2h deko2m
		make deko3face.png fb f1 h1 deko3m ^deko3a
		make deko2back1.png deko2bh
		make deko2back2.png deko2bh2
		make deko2back3.png deko2bh deko2bh3
		make pero1top1.png tr ^tp str pero1fr1 ^pero1sfr1 pero1t pero1st
		make pero2top1.png tr ^tp str pero1fr1 ^pero1sfr2 pero1t pero1st
		make pero3top1.png tr ^tp str pero1fr1 ^pero1sfr3 pero1t pero1st
		make pero1top2.png tr ^tp str pero2fr1 ^pero2sfr1 pero2t pero2st
		make pero2top2.png tr ^tp str pero2fr1 ^pero2sfr2 pero2t pero2st
		make pero3top2.png tr ^tp str pero2fr1 ^pero2sfr3 pero2t pero2st
	done
	return 0
}

function make()
{
	local file=$1
	shift
	if [[ "$only" == "all" || "$file" == $only* ]]
	then
		do_make color ../image/$file "$@"
		do_make mono ../image_m/$file "$@"
	fi
}

function do_make()
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
	cmd="$cmd -resize x700"
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

function print_preload()
{
	echo 'exports.mono = ['
	ls -CQ ./image_m/* | sed 's/\s\s*/, /g;s/$/, /'
	ls -CQ ./imagemisc/* | tac | sed 's/\s\s*/, /g;2,$s/$/, /' | tac
	echo '];'
	echo 'exports.color = ['
	ls -CQ ./image/* | sed 's/\s\s*/, /g;s/$/, /'
	ls -CQ ./imagemisc/* | tac | sed 's/\s\s*/, /g;2,$s/$/, /' | tac
	echo '];'
}

test -z "$1" && print_preload "$1" || conv $@
