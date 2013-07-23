---
layout: post
title: Basic application reversing and 041414141.com Challenge Two (Spoiler)
---

One of the many things that has interested me in the past
is binary reverse engineering. Whether your reasons are
nefarious or not its always fun to see how things work
in the back ground.

First of you will not be learning how to crack anything so
if that is what you wanted you can leave now. Secondly if 
you are doing the 0x41414141.com challenges on your own 
then first give them a try yourself before getting the answer
here.

A spoiler of the first challenge can be found <a href="http://www.zonbi.org/?p=310" >here</a> (thanks z0nbi)
if you havent already completed it. Its a interesting challenge 
and what got me started on this whole thing.

So first of grab the binary for the challenge from the site by
completing the first part of the challenge (the spoiler is above).
Next grab the free version of <a href="http://www.ollydbg.de/odbg110.zip">OllDbg</a> 
from the site.

At this point in a bigger project I would normally check the exe 
for string resources. But since the app is a whole 2Kb I am going 
to jump straight into debugging the app.

Start of by launching Olly, next load up the exe (File -> Open).
Lets get into this ,hit F9 or Debug -> Run. This will start the
app in debug mode and pause the at the first piece of code that 
will be executed. If you have some C experience this is your 
main() function, i.e. the entry point for the application.

I am not going to be explaining every single asm function and
what ever piece of code does because I have no idea how long
this post will end up running. So if you dont understand something
or think I have done something wrong feel free to correct me.

If you have done everything as I have stated , you should be
at 00401020 (check this in the extreme right column). At the 
same time you should see a text string telling you that the 
return value of the function is the email address for the
next challenge.

With this in mind you have 2 option , you can take the quick route
and run to the point after the function call and then check
the eax register Or you can step into the function and see
what it is doing. I personally prefer to step into the function
so that I can get a understanding of what is going on , it
doesnt speed up anything it just help me to understand the app.

So hit F8 6 times to get just past the function call , at this
point if you look at the eax register it should read 0007AB00.
This is the return value from the function, the reason we can 
check the register so easily is because its up to the main function
to handle the cleaning up of the registers.

The alternate option is to add a breakpoint at 00401035 (click on 
the line and hit F2) then hit F9 to run to the code. You can at this
point re examine the register and get the value from the function.

As you may have guess the email address for the challenge is 0x0007AB00@therest.com
Replace the rest .com with the address from the first challenge.
You will know you got the right address if you get a reply with
the source code for the application that you are working on.

Update : @z0nbi has posted a [follow up to this article](http://www.zonbi.org/2011/01/28/basic-application-reversing-a-companion/) , if you feel 
that you are still new to RE please vist this site to get extra
information that will clear up quite a few things (also he has pretty 
pictures)
