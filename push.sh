#!/bin/bash

VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')


git commit -m "$VERSION" package* src/ config/* data/* *.md push.sh;
git push bibucket master;
git push github master;
git tag $VERSION;
git push bibucket $VERSION;
git push github $VERSION;

