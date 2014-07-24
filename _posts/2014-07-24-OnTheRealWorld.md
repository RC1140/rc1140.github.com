---
layout: post
title: On the Real World
---

# Random thoughts on Hello World Projects
* * *

"Hello World", probably one of the first pieces of text one will output as 
a developer learning a new language. While it's admirable that many people are able to get to this point, I have noticed a fair number of demo projects in the .net space that cant seem to get past it.

To be fair, this usually occurs when a new project/framework is being shown off by someone that is not the projects original author. 
It is this need to get the smallest possible piece of code shown off to the rest of the world that tends to grind my gears and is what led me to tweet :

  ["Sick of hello world demo's , do something non trivial"](https://twitter.com/RC1140/status/488762947016347648)

The basis for this tweet came from trying to find a decent introductory project that demonstrated how OWIN could be implemented non trivially(I had an existing project I wanted to convert). Sadly pretty much every OWIN demo stops after they are able to write "hello world" to the response. I assume that I was probably just looking in the wrong places, but it's horribly annoying trying to understand the capabilities of a system when  the only code you have access to never goes beyond printing two words to the screen. In the end, reading through some documentation that seemed  to be a spec of sorts, provided most of the answers I was looking for (which is that you can't easily run your existing ASP.net project on any of the existing OWIN implementations).

After giving up on my plans to change the world with OWIN and sending out my previously mentioned tweet, I got a reply stating that people tend to gravitate towards hello world projects because they lack ideas for decent green field projects (see : 'the need' in the follow up tweet). Personally I feel this is an excuse that devs tend to use when they don't want to put in the extra effort to build something fully fleshed out.

I say that because I was one of those devs that would constantly complain about never having anything to build. However, that complaint is quite hollow nowadays due to the abundance of possible projects from various sources. Personally, I have found the three options that allow me to build stuff when I don't have anything in my personal dev queue. First and probably the easiest (though not the most original) is just re-implementing existing projects. Github is filled with tons of open source projects in just about every language, so if you want to show how a new framework works then go ahead and pick one of the projects and re-implement it using the framework you are trying to show off.

This will do two things, firstly you will either be able to re implement the project faster, in which case you show off the current use case as a bonus, or you will have the same issues as the original author of the project you are trying to re-implement. Regardless of which scenario  encounter, you will come out of the experience better equipped to demo your project. At the very end if you never finish re-implementing  the project, you will at least know where the shortfalls exist in your project and how you could possibly work at fixing them.

So lets assume that you don't want to start a new project from scratch but you still want to learn a new language/framework. At the point where you would normally write up your hello world and move on, why not look one of the many open source projects that need bugs fixed? To name a few that I like: Bountysource, codetriage and github. These have some really easy to use implementations which already make things easy for you by tagging/grouping projects by difficulty and language. This way, all you need to do is filter to a project that uses a language/framework you want to work with and help them out. To me, this is better than a "hello world" demo because you get to see the issues that people encounter when building usable projects.

Lastly, if you want to learn a new language/framework and don't want to write any code, then go ahead and review an existing project on any of the sites that I mentioned above. While this is probably the most passive means of learning, you still get to learn how another developer was able to tackle a real world problem, which you could possibly use later. As always this is all my opinion, so feel free to disagree with anything I say.
