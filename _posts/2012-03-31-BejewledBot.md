---
layout: post
title: Building a Bejeweled bot
---
   
## Because I can
* * * 

I love building stuff and one of the many things that fascinates me is
seeing the many bots that have been built to play various MMORG games.

While these bots are usually built to aid people in farming either currency 
or items they are an impressive feat of programming. So recently while 
discussing the latest news about various farming techniques on #zacon with [@Hypn](http://twitter.com/hypn), 
I wondered what would it take to build a bot that played a game for you.

As it turns out, even the simplest of bots is not all that simple. Before jumping
straight into building a MMORPG level bot I figured I would start small. If anything
this would allow me to get to know some of the basics of building a bot that plays a game
before trying a large project and getting entirely lost.

## Goals and decisions
* * * 

The goal then was to build a bot for Bejeweled on the Windows platform using the AutoIt
scripting language in minimal time. 

A secondary goal was that once the bot was completed in AutoIt it should possibly be re-written in another
language. This would allow us to use the logic from AutoIt and apply it to the new selected language.

Bejeweled was chosen for 2 reasons: first, there was no monetary
attachment with winning and secondly it's a fairly simple game to play. With it being
a simple game, it was hoped that building a rule set for the bot would be easier.

Windows was chosen simply because the majority of games are built for Windows and any knowledge gained could be applied in writing future bots.

AutoIt was selected to script the interface because its simple language hides a number of pretty advanced features. 
Mostly importantly it allows you to control the mouse and keyboard, which allows you to mimic what a human can do easily. 

## Research 
* * * 

If you haven't played Bejeweled, Wikipedia's entry (http://en.wikipedia.org/wiki/Bejeweled) is a reasonable introduction.
The game has a long history and has been ported to a huge number of platforms.

The information we needed in the beginning to get started was the following:

    * The location of the top left corner of the board.
    * The size of each block.
    * The location within each block where we could find a pixel that would indicate the color of the block.
    * The hex/decimal value of each color to be used for matching (this is statically scraped and stored.)

Each of these bits of information can now be found in the [README](https://github.com/hypn/BejeweledBot/blob/master/readme.txt)

## Implementation
* * * 

### Step 1 : Acquiring the board co-ordinates

Acquiring the co-ordinates of the board's top left corner is important as we use it as an offset when calculating anything else on the board.

The first possible way of getting the start co-ords is by asking the user to click on a specific location. The is inaccurate and, depending
on the user, subject to error.

Instead, we find the starting position by using a nifty function provided by AutoIt called PixelSearch. PixelSearch works by asking for a specific color
in the hex format and then searching within a bounding box. The bounding box is indication by a top left position and a bottom right position.

Research by [@Hypn](http://twitter.com/hypn) found that the starting position of the board could be found by looking for a pixel with the color 0x37372C. Of course, the 
problem with this kind of heuristic is that any pixel with the same color could introduce a false positive to the heuristic, and throw subsequent calculations off. While one could extend the heuristic to include a search for additional known pixels, we recommended that you run the game in full screen to avoid any conflicts.

To grab the starting co-ords using the information above we run the following piece of code before anything else.

       Local $coord = PixelSearch(0, 0, 1440, 900, 0x37372C)

This will store the co-ordinates of the magic pixel in the $coord variable. The X and Y values can be accessed by
accessing the variable as an array. This would mean that $coord[0] == X and $coord[1] == Y.

### Step 2 : Build colored memory map

Now that we have acquired the coords of the board ( which is stored in $coord ) we need to build a 
representation of the board in memory. This will allow us to solve matches by looking for specific 
patterns instead of brute forcing every square and hoping that a match is found.

    Func buildColorMap()
       Local $ucm[8][8]
       ;X and Y relate to the x-axis and y-axis
       For $y = 0 To 7 Step 1
          For $x = 0 To 7 Step 1
           $ucm[$y][$x] = PixelGetColor ( $coord[0]  + 18 +( $x* 37), $coord[1] + ( ($y +1) * 37) - 11 )
          Next
       Next
       Return $ucm
    EndFunc

    Local $ucm[8][8]

In the piece of code above we start of by  first creating 
a 8x8 2-dimensional array which represents rows and columns 
on the board. 

   For $y = 0 To 7 Step 1
      For $x = 0 To 7 Step 1
       $ucm[$y][$x] = PixelGetColor ( $coord[0]  + 18 +( $x* 37), $coord[1] + ( ($y +1) * 37) - 11 )
      Next
   Next

We then run a 2 level loop which calculates the exact coord 
of each pixel where we want to scrape the color from each block. 

During each iteration when we have calculated the X and Y coord we use a 
function provided by AutoIt called PixelGetColor to get the color for each block.
This is stored in the relevant position in the array for access later.

#### Converting coords to words

 Local $coloredMap[8][8]
   for $i = 0 To UBound($crd) - 1
      For $x = 0 To 7 Step 1
         Switch $crd[$i][$x]
            Case 16775956,16776960
               $coloredMap[$i][$x] = "Yellow"
            Case 16206352,16471568 ; we also match 15* as red in most cases
               $coloredMap[$i][$x] = "Red"
            Case 16777215,16514043
               $coloredMap[$i][$x] = "Silver"
            Case 12749289,12885488,11902199 ,13021688,12029936,12157930
               $coloredMap[$i][$x] = "Purple"
            Case 5420321,4303909
               $coloredMap[$i][$x] = "Green"
            Case 16675594
               $coloredMap[$i][$x] = "Orange"
            Case 6220025,5565436,8249328,5892858,4911103,6353407,6547447,7921905,6874614,7202036
               $coloredMap[$i][$x] = "Blue"
            Case Else
               ;If the color code is not matched above then we do a rough check
               ;This may be wrong so we mark with a * (note this has yet to match a wrong color)
               $checker = StringLeft(StringFormat("%i",$crd[$i][$x]),2)
               Switch $checker
               Case "16"
                     $coloredMap[$i][$x] = "Orange"
                  Case "15"
                     $coloredMap[$i][$x] = "Red"
                  Case "52","75"
                     $coloredMap[$i][$x] = "Blue"
                  Case Else
                     $coloredMap[$i][$x] = $checker
               EndSwitch
         EndSwitch
      Next
 Next

The conversion of a pixel to a word is done in the code above and sadly is quite messy.
We start by kicking of a 2 level for loop to itterate through each of the blocks in the 
grid. We then extract the decimal value from the original array variable and run it through
a switch statement. 

Each of the cases in the switch statement was manually extracted by
me running the game multiple times and extracting the value for each square in its various 
forms and then saving it.

In each of the switch case statements saves the word to an array which will be used later to
solve the game.

While writing this it just occured to me that this second step is probably not needed and could
have been done originally when the map was first scraped.

### Step 3 : Solving a colored map

The solver function takes as input a color map which was generated
in the previous step. With this input it iterates though each of the
colors in the map and performs various checks.

Unfortunately my AutoIt skills kinda suck and I was not able to make this
part of the code generic enough. As such each of the check functions is
mostly a copy/paste template with various parts of the rules modified.

#### Anatomy of a rule  
#### Rule Checks 

The check function consists of the following steps. First, depending on the rule
we are checking we need to make sure that there is enough space to the left
and right of the current block depending on what the rule dictate.

For example to check the following rule :

    O
    XOO

X is an invalid square (and, in this case, the one being checked)         
O is a valid square.        

To solve the check above we need to swap the invalid square with the square 
above it. Before this rule can be run it needs to be run in a generic way.
As such we need to ensure that there is a square above the current square 
and 2 to the right of the current square. We perform this check by checking if
X is less than 3. We also need to check that Y is greater than 0. If these checks
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

Building the bot was quite fun and, once I got past the initial learning
curve, the development was pretty easy. Sadly though there are still
some holes in the bot which I don't feel like fixing currently. 

The first is that there are a couple of rules that are missing and as such there
are times when it will seem like the game does nothing. If this happens solve
a match and it will continue as normal.

The current search area for the game is currently working on my screen resolution. This
should be changed to be a bit more dynamic and look at the users current screen res.
I know that [@Hypn](http://twitter.com/hypn) has code that will do this but I have yet to add it.

It's still a work-in-progress; if you like it, or have comments, let me know.
