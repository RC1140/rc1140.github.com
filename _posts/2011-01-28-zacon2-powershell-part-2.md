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

This takes what we have learnt up until now a little further. First of all it takes in a parameter of the users choice, but it also provides
a default option so that if the user does not provide one the function will not crash.

Also this functions shows you how to work with com objects in powershell. The reason we do this is because there is no simple
public WMI interface and the com interface is alot simpler to work with. The function also shows how you do inline filtering
by using the powershell where command ( either ? or where will work )

### Get-ADComputers :
* * * 

This uses a little more complex functionality , but its nothing that would not 
have been covered in the previous functions. The 2 major differences between
the previous functions is :

1. That the function casts the string "objectcategory=computer" to a Active Directory 
Searcher object. The searcher is a little bit complex for this post
so I wont go into detail about how it works. For now just know that it allows you to 
performa AD searches via the commmandline and more specifically powershell.

2. How to loop over each object that the search returns, if you are a coder with
previous experiance then the loop is the equivalent to a foreach loop. If it hasnt
become apprent already this is the loop `%{([adsi]$_.path).cn + $_.properties.operatingsystemversion} `.
You can use either % or ForEach-Object , what ever is between the {} is executed 
on each step. If you need access to the object that is being access you need to
use the $_ variable.

### Get-LocalOsVersion :
* * * 

This method does nothing new really except that it specifies which columns need 
to be returned since the default data can be a bit much. Use this when a object
has properties that you need access to.

While I hope that covers the script a bit more in depth than what I managed to 
talk about in the video. If there is anything that has not been covered in
enough detail or has been covered incorrectly please let me know so what I can
correct it.
