---
layout: post
title: Zacon 2 - PowerShell Basics Part 2
---

The much delayed part 2 is finally here and the topic of the day is poking
the system. This is much like poking a bear but hopefully less painfull.
The purpose of poking the system is to go about showing how to interact with
with the underlying OS of choice.

### Getting Started :
* * * 

First of you need to have some basic powershell skills , my original post
can be found [here](http://superuser.co.za/?p=10). Its pretty simple and
follows on the video so you dont have to read to much if you dont want to.

Grab the script for this post from [here](https://github.com/RC1140/ZaCon/blob/master/poke-system.ps1).
Unlike the previous post I wont be explaining line by line , rather function by 
function.

### Get-Users :
* * * 

This is a rather simple but interesting example of working with WMI , it points out 2 things.

1. That you can get interesting system data via WMI

	+ We are able to get all the users in the system via WMI and while I am not familiar with using the normal windows shell to get this info , it can not be easier than this.

	+ The other fact that is not obvious is that you can use this on a remote system to get simliar results without much changes to the code

2. Also how you would get started using WMI

	+ It shows the basic syntax for making a WMI call, if it was not apprent you simply call gwmi with the name of the class you want data from. In this case the class is win32_useraccount. To get a list of classes that you can use `gwmi -list`.

### Get-Applications :
* * * 

This is a bit of a simpler example which just returns a list of applications installed on the users machine. It can be expanded alot more to do things such as simpler searching or even calling the untinstall method on a application of choice.

### Get-FirewallRules:
* * * 

