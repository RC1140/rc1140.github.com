---
layout: post
title:  "Dotjs Extension Read through"
date:   2014-04-24 
---

Background
--------------
As a developer we are constantly told by our peers (at least I am) that opensource
projects are made of unicorns. You get to see the code behind projects that you are 
interested in and even make contributions when you find a problem. Sadly when asked
how many projects they have contributed to many people default to 0 contributions.
It may be argued that contributing to a new project is a leap that is not easy to 
take, it should then be a given that people at least read and review their favorite
open source projects. Again when asked about this many people are content to use
a open source library or application assuming someone else has checked it out.

In the same line of thought while watching this talk given by [Richard Hamming](https://www.youtube.com/watch?v=a1zDuOPkMSw), I felt
inspired to get a long delayed project going. Calling it a project may be overkill
but the idea is fairly simple. As Hamming suggests reading and reviewing papers weekly
I have wanted to read and review opensource projects. On its own the idea is simple
but has a number of benefits for me, I get to learn about a new cool project that
I can always refer back to for inspiration , I get to learn about how a language is
used (depends on the language the project uses) and finally I get learn about new 
ways to solve problems that other developers have fixed. 

While it was tempting to build a entire
system to make this process easy I figure I should get going and build
a system once I have some data to work around. As a side note one of the 
few devs whose work I enjoy following, does regular series of code reviews
where he does deep dives into various code bases (mostly game engines). If you don't already know who I am talking about
then you should go have a look at fabien sanglard's [blog](http://fabiensanglard.net/).

Why
--------------

Selected a project from githubs trending projects for productivity also
since it was a chrome extension it would provide a good brush up on chrome
dev techniques.Further the plugin seems to tackle a problem that i tried 
to solve recently (loading custom code easily into a domain) in a very clean manner.

Where
--------------

Project is located on github @ https://github.com/defunkt/dotjs.git


Down the rabbit hole
--------------

So cloning the project results in the following file listing 

    -rw-r--r-- 1 rc1140 users 3.9K Apr 24 20:20 Rakefile                                            
    -rw-r--r-- 1 rc1140 users 2.8K Apr 24 20:20 README.markdown                                     
    -rw-r--r-- 1 rc1140 users 1.1K Apr 24 20:20 LICENSE                                             
    -rw-r--r-- 1 rc1140 users  218 Apr 24 20:20 HACKING                                             
    drwxr-xr-x 2 rc1140 users 4.0K Apr 24 20:20 ext                                                 
    -rw-r--r-- 1 rc1140 users  498 Apr 24 20:20 com.github.dotjs.plist                              
    drwxr-xr-x 2 rc1140 users 4.0K Apr 24 20:20 bin                                                 

A few things seem to stand out , there is a rake file which 
probably means that ruby is involved. Author has also taken
the time to include a hacking file so modifications are expected
to occur or have already happened in the past to warrant this.

Next there is a plist file which is mac/ios file used in apps 
for those operating systems , this either means this plugin is 
aimed @ mac/iOS users or the file got forgotten behind ?

The rest of the project seems to be split into the extension and
a binary folder. This should prove interesting as it may explain
how the extension accesses the file system (which is usually prohibited by chrome)

README.markdown
-----------------

Since the project includes a readme starting with this should provide
some directions.

Readme gives a nice intro into how the extension works and why you would
want to use it. It also gives a example script very early in the file 
so that you can try stuff out.

It seems the core repo I am looking at is only meant for OSX which would 
explain the plist file I saw earlier. Will continue looking into this repo
and switch to a windows repo when I need to actually test it.

Its also nice that the readme includes direct links to the ports.

Rakefile
-----------------

As expected the code in the rakefile is ruby and is surprisingly easy to read.
The file contains a number of tasks that are split up neatly as listed below

    task :all => [ :prompt, :daemon, :create_dir, :agent, :chrome, :done ]  

The task above executes all the tasks in the rake file and provides a nice 
index to the list of tasks in the file.

The author has split up the tasks quite neatly and each task encapsulates
each bit of functionality very nicely.

Not sure if I should should analyze every single task.
The following tasks a grouped under a namespace :install , this
means that all the tasks  listed below will be executed when running
the install task

### :prompt 

Simply prompts the user to confirm what the rake file overall task will execute.

### :done

This is a neat little task which checks if the entire process completed successfully 
buy curling the local end point. I assume there is probably a http library that
rake/ruby could use but by using curl it simplifies things a fair amount since
the input string would never be changed. Potential errors could be that curl is
not installed

### :agent

This is the task that sets up the script to run as  a system service and is what 
the plist file is used for.

What is slightly interesting is that instead of using the system cp command to copy
the plist file to the required dir it uses the ruby file api to read and write to the required  location.

### :daemon

This task copies the binary that the extension requires to the default setup location.
The system agent will execute this binary when it starts up.
I assume that the read and write method of copying the file was not used because it
was a binary file.

### :create_dir

Heh , as expected this creates the .js directory from which the extension takes its name.

### :chrome

Simply prints the message that the user should install the extension and link to the
extension that should be installed.

There are a bunch of tasks grouped under the :uninstall namespace. Wont be covering
this since it just does the reverse of the tasks I just looked at.

bin/djsd
-----------------

This is the core service that is setup by the rakefile. Running the command

    file djsd

Tells us that the file is not a binary but rather a ruby script which means
I can now inspect this using a text editor.

Opening the file and going from top to bottom tells us the following. The
script does some basic argument checking. It checks for the help param 
which prints the usage commands for the script. It also checks for the version
flag which just prints the version and exits.

Once the flag checking is complete a class called dotjs is created. The
class is fairly basic and see to be more a interceptor/handler class.
The class builds a body for a html request , as well as origin detection.

Further details on how this class is used will be noted when it is encountered 
in the code again (it should be encountered otherwise it can be removed)

After the class is setup a ssl cert is created and a basic set of options
are passed to the web brick http server. Whats interesting is that the cert
exists after the last line of code , I am not sure what the __END__ does
but I will provide details later.

Finally when starting the server we now notice the dotjs class being
passed as the handler for the index request.

Reading back a little bit we notice that all that the class does is 
serve a js file called default.js. The server also handles terminations
cleanly.

While the script is fairly clean and short i really think that it could 
have been implemented a bit cleaner by loading the ssl cert from an external
file instead of script the script. Although this self encapsulation is reasonably
useful.

I will also need to do more testing to determine why the author chose to use
ssl when hosting the server since the cert is distributed with the extension
changing the cert is easy enough.

This ends the files in the bi folder , as usual its pretty clean and efficient.

Extension folder
-------------------

The ext folder contains the core files required  required to build a chrome extension.
This folder as with the rest of the repo is clean and straight to the point as seen
below.

    -rw-r--r-- 1 rc1140 users  380 Apr 24 20:20 manifest.json
    -rw-r--r-- 1 rc1140 users  91K Apr 24 20:20 jquery.js   
    -rw-r--r-- 1 rc1140 users 2.3K Apr 24 20:20 icon48.png  
    -rw-r--r-- 1 rc1140 users 6.6K Apr 24 20:20 icon128.png 
    -rw-r--r-- 1 rc1140 users  253 Apr 24 20:20 dotjs.js    

The core of this folder is the manifest.json file which is used to tie a chrome
extension together. Aside from that we have a couple of icon which chrome requires
for an extension. The last file is the main js file that the extension injects
into every page. Once this file is injected it then makes a ajax request to the
local service for the js file associated with the current site. Once this file
is loaded it is then eval'd so that it runs in the correct domain. 

This is a pretty neat way to dynamically load the js files without needing to 
setup any mappings between a js file and a website and get it executed on the
correct page.

Random Notes
--------------

There are a few other things that I noticed about the project which were semi
interesting to me. There were a number of outstanding pull requests which
seem reasonably easy to merge,  I think it would be useful to either decline
them or push them forward to clean up the outstanding list (some of the pull 
requests are really old which really makes one wonder why they weren't accepted).
The has resulted in a huge number of forks (nothing wrong with that) but it would
have been cool to have some of the feature in the core repo or least have the 
pull requests purged. This same issue is visible in the issues section (too many 
open issues), granted a bunch of them are related to the pull requests. I should
mention that this is a fairly common issue with project on github (since they
are the only people that make this data easily accessible) and I am just as
guilty of having a bunch of hanging issues that i have never gotten to working on.

TODO : As a side note it would be interesting to pull data from github showing the
average number of issues/pull requests open for overall projects listed on github.

Lastly it seems that the p3lim repo is the most updated version of all the forks
but has changed the core to work a little differently where there is no local web
server involved , instead the files are all hosted in the extension.

Done 
------------

I have to say that after reading through the code and seeing how it pulls everything
together in a simple package I think it would make a nice base for future projects
where you need simple coms between a desktop and the browser.
