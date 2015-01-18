---
layout: post
title: Running MovesCount on Windows 8.*
---

The moves count application which is used to transfer data from the suunto watches has a fairly major bug which prevents it from launching. This is quite an issue since the application is the only means of transfering data to the MovesCount.com site which is the only method of accessing the watch data for further analysis (there are proprietary files that are dumped to the users home folder but thats a post for another day). 

To fix this issue the app needs to run as an administrator to access a couple of registry keys. Unfortunately because of the weird way the app was developed and published, simply right clicking an app and selecting "Run As Administrator" does not work. To get the app to work, create a batch file with the following content and save the file :

	"C:\Users\<Your UserName>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Suunto\Moveslink2.appref-ms"

Once that is done right click the batch file and select "Run As Administrator" to get the app to launch correctly.

Done :) 