---
layout: post
title: Building a bejewled bot
---
   
## Because I can
* * * 

I love building stuff and one of the many things that fascinates me is
seeing the many bots that have been built to play various MMORG games.

While these bots are usually built to aid people in farming either currency 
or items they are an impressive feat of programming. So recently while 
discussing latest news about various farming techniques on #zacon with [@Hypn](http://twitter.com/hypn) , 
I wondered what would it take to build a bot that played a game for you.

As it turns out , even the simplest of bots is not all that simple. Before jumping
straight into building a MMORPG level bot I figured I would start small. If anything
this would allow me to get to know some of the basics of building a bot that plays a game
before trying a large project and getting entirely lost.

## Goals and decisions
* * * 

The goal then was to build a bot for bejewled on the windows platform using the autoit
scripting language as soon as possible. 

A secondary goal was that once the bot was completed in autoit it should possibly be re written in another
language. This would allow us to use the logic from auto it and apply it to the new selected language.

Bejewled was chosen for 2 reasons , first there was no monetary
attachment with winning and secondly its a fairly simple game to play. With it being
a simple game it would mean building a rule set for the bot would be easier.

Windows was chosen simply because majority of games are built for windows and using windows as 
a base would mean that any knowledge gained could be applied going forward to subsequent bots.

Autoit was selected as the scripting language because even though its a simple programming language
it gives you access to pretty advanced features.Mostly importantly it allows you to control the mouse and
 keyboard with really simple api calls which allows you to mimic what a human can do easily. 
While the use of other languages such as python/ruby/cpp would have been more cooler the time 
it would take to get the api to do what we wanted would have taken to long. 

## Research 
* * * 

To those that are not aware what Bejeweled is , read the following article on wikipedia http://en.wikipedia.org/wiki/Bejeweled.
The game has a fair amount of history and has been ported to pretty much every platform possible.

The information we needed in the beginning to get started was the following :

    * The location of the top left corner of the board
    * The size of each block
    * The location within each block where we could find a pixel that would indicate the color of the block.
    * The hex/decimal value of each color to be used for matching (This is statically scraped and stored)


Alot (read 'all' even though he will deny it) of the initial research into the information above for building the bot was done by [@Hypn](http://twitter.com/hypn).

## Implementation
* * * 

### Step 1 : Acquiring the board co-ords

Acquiring the co-ords of the boards top left corner is important as we use it as an offset when calculating anything else on the board.

The first possible way of getting the start co-ords is by asking the use to click on a specific location. The is inaccurate and depending
on the user is iffy at best.

So we get the starting possition by using a nifty function provided by autoit called PixelSearch. PixelSearch works by asking for a specific color
in the hex format and then searching within a bounding box. The bounding box is indication by a top left position and a bottom right position.

Research by [@Hypn](http://twitter.com/hypn) found that the starting position of the board could be found by looking for a pixel with the color 0x37372C. Of course the 
problem with search for colors on screen is that if something else with a matching color is found your offsets will be totally off. It is therefor
recommended that you run the game in full screen to avoid any conflicts.

To grab the starting co-ords using the information above we run the following piece of code before anything else.

       Local $coord = PixelSearch(0, 0, 1440, 900, 0x37372C)

This will store the co ordiantes of the pixel found using the function in the $coord variable. The X and Y values can be accessed by
accessing the variable as an array. This would mean that $coord[0] == X and $coord[1] == Y.

### Step 2 : Build colored memory map

Now that we have acquired the coords of the board we need to build a representation of the board in memory. This will allow us to solve
matches by looking for specific patterns instead of brute forcing every square and hoping that a match is found.

The building up of the map is not really that complex.
We do this by first creating a 8x8 2 dimension array which 
represents rows and columns on the board. We then run a 2 
level loop which calculates the exact coord of each pixel 
where we want to scrape the color from each block. During
each iteration when we have calculated the X and Y coord we use a 
function provided by autoit called PixelGetColor to get the color for each block.

Each pixel is converted into a color word which will be used
and stored for comparison at a later stage. 

### Step 3 : Solving a colored map

The solver function takes as input a color map which was generated
in the previous step. With this input it iterates though each of the
colors in the map and performs various checks.

Unfortunately my autoit skills kinda suck and I was not able to make this
part of the code generic enough. As such each of the check functions is
mostly a copy and paste template with various parts of the rules modified.

#### Anatomy of a rule  
#### Rule Checks 

The check function consists of the following steps. First depending on the rule
we are checking we need to make sure that there is enough space to the left
and right of the current block depending on what the rules dictate.

For example to check the following rule :

    O
    XOOO

X is an invalid square and the current square         
O is a valid square.        

To solve the check above we need to swap the invalid square with the square 
above it. Before this rule can be run it needs to be run in a generic way.
As such we need to ensure that there is a square above the current square 
and 3 to the right of the current square. We perform this check by checking if
X is less than 4. We also need to check that Y is greater than 0. If these checks
all execute correctly then we can perform a click on the respective squares.

#### Rule Solutions

In this case the check would execute code to click on the current square and then
execute code to click on the square above. The clicking code is fairly generic
but unfortunately I did not realize this early on in the project so there is a fair
amount of duplicate code.

### Step 4 : End Game

Once all the above is in place the code executes till 
the board is cleared and we get the end game message. 

The end game check is run before everything to prevent the bot
from trying to play an extra round that would not be needed.

For debugging purposes I only ran the bot for 10 runs , but at the
the bot could safely run with a 'While True' and not go into a weird
state that could annoy the user.

## Conclusion

Building the bot was quite fun and once I got past the initial learning
curve it the development was pretty easy. Sadly though there are still
some wholes in the bot which I dont feel like fixing atm. 

The first is that there is a rule or 2 that is missing and as such there
are times when it will seem like the game does nothing. If this happens solve
a match and it will continue as normal.

The current search area for the game is currently working on my screen res. This
should be changed to be a bit more dynamic and look at the users current screen res.
I know that [@Hypn](http://twitter.com/hypn) has code that will do this but I didnt bother adding it at this stage.

There are probably other things that I have not done as perfectly as should have
been done but if you feel the need to please fix them and let me know.
