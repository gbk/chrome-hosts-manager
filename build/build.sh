#!/bin/sh

BASE=$(cd "$(dirname "$0")";pwd)
echo $BASE
YUI="$BASE/yuicompressor-2.4.7.jar"
MAIN="../main"
RELEASE="../release"

rm -rf "$RELEASE"
cp -r "$MAIN" "$RELEASE"
rm -rf "$RELEASE/scripts"
rm -rf "$RELEASE/styles"

doCompress () {
  echo $1
  mkdir "$RELEASE/$1"
  SOURCE="$MAIN/$1"
  TARGET="$RELEASE/$1"
  for i in `ls -1p $SOURCE | grep -v "/$"`
  do
    java -jar "$YUI" --charset=utf-8 -o "$TARGET/$i" "$SOURCE/$i"
  done
}

doCompress "scripts"
doCompress "scripts/handle"
doCompress "scripts/model"
doCompress "scripts/util"
doCompress "styles"
cp -r "$MAIN/scripts/lib" "$RELEASE/scripts"

echo finish
