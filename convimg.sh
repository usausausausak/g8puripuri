#!/bin/sh
only=none
function conv()
{
	cd raw
	while [[ -n "$1" ]]
	do
		only=$1
		shift
		make back_hair1.png bh1
		make back_hair2.png bh2
		make back_hair3.png bh bh3
		make body1.png b ^p
		make skirt1.png s
		make face1.png f1 h1 m1
		make face2.png f1 h1 m2
		make face3.png f1 h1 m3
		make puri1.png f1 h1 puri2m - purih1
		make puri2.png puri2f puri2h puri2m - purih2
		make puri3.png puri3f puri3h puri3m - purih3
		make nade1.png f1 h1 nade2m
		make nade2.png f1 nade2h nade3m
		make nade3.png f1 nade3h nade3m
		make meguri1skirt.png meguri1s - megurih1
		make meguri2skirt.png meguri2s - megurih2
		make meguri3skirt.png meguri3s - megurih3
		make meguri_left1skirt.png meguri1ls - megurihl1
		make meguri_left2skirt.png meguri2ls - megurihl2
		make meguri_left3skirt.png meguri3s - megurihl3
		make meguria1body.png meguria1b ^meguria1p
		make meguria2body.png meguria2b ^p
		make meguria1skirt.png meguria1s
		make meguria2skirt.png meguria2s
		make meguria3skirt.png meguria3s
		make deko1.png deko1f deko1h deko1m - dekoh2
		make deko2.png deko2f deko2h deko2m
		make deko3.png f1 h1 deko3m ^deko3a
		make deko2back_hair1.png deko2bh
		make deko2back_hair2.png deko2bh2
		make deko2back_hair3.png deko2bh deko2bh3
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
