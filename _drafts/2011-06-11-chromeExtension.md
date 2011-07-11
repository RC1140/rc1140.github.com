---
layout: post
title: Building a Chrome Extension with system level access
---

## Why 

We wanted to build a gpg chrome extension that would allow users
to encrypt/decrypt their gmail message in the browser. Since there
is no api in the browser for this we have to get to the system level
to get the functionality we wanted.

## How

Getting and using os level code is not impossible its just not really
well documented. Getting access to the os level is done via [NPAPI](http://en.wikipedia.org/wiki/NPAPI).
Just looking at the name should explain just how far back this goes (back to the netscape days),
So I wasnt expecting alot from it.

Various frameworks that have prung up to make using npai easier to work with. 
By far the best framework is [FireBreath](http://www.firebreath.org/display/documentation/FireBreath+Home)
which allows you to develop cross browser and cross platform plugins.


