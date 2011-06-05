---
layout: post
title: Harvesting the collective
---

   
## Intro
* * * 

I tend to spend alot of time in the [#zacon](http://zacon.org.za/) channel mostly because its
really cool place to hang out but also because I learn alot from the
people there. Sadly I cant be there all the time of every single day. 
A little while back I noticed that I was missing really 
interesting URLs that people has posted while I was away, now while I could look back 
through the logs for the previous day/night, this started to become a little tedious.
Also it doesnt help that other people also had this problem.

So the solution I present is the zaconURL watcher, a bot written in 
[Node.js](http://nodejs.org/) that sits in the channel and silently logs all URLs that are
pasted. Simple idea with a simple implementation , thankfully with a
bit of feedback from guys in the channel I got to add a few more 
features such as a RSS feeds (Per person or the entire channel) and
tagging for each of the URLs.

### App Stack
* * *

Building this was mostly to learn [Node.js](http://nodejs.org/) and get 
a app out in a single day for a framework I have never used (This probably
shows in the code so please be gentle).

The various libs that were used are listed below.

Bot :
[Node.js](http://nodejs.org/)
- IRC 
- Mongoose

General :
[MongoDB](http://www.mongodb.org/)

Web:
[Django](https://www.djangoproject.com/)
pymongo

### The End 
* * *

Thats it really there is nothing more that I think can be said.
If you need specifics on something feel free to shout , I will 
drop the code for the bot [online](https://github.com/RC1140/zaconURLWatcher) sometime soon if anyone cares 
to check it out.

Also if you feel so inclined check out the site and all data captured so 
far at [urls.runawaycoder.co.za](http://urls.runawaycoder.co.za/)
