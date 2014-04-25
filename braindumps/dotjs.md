---
layout: post
title:  "Dotjs Extension Read through"
date:   2014-04-24 
---

Background
--------------
as a dev this is one of those things that i have been meaning to do for ages.
While watching this talk given by Richard Hamming (link talk here) , I felt
inspired to get this project going. While it was tempting to build a entire
system to make this easy I figure I should get the process going and build
a system once I have some data to work around. As a side note one of the 
few devs whose work I enjoy following does regular series of code reviews
where he does deep dives into various code bases (mostly game engines). If you dont already know who I am talking about
then you should go have a look at fabien sanglard's blog http://fabiensanglard.net/
, I hope that one day I can provide the same level of insight as he does.

Why
--------------

Selected as a projet from githubs trending projects for productivity
as well as its a chrome extension. Further the plugin seems to tackle
a problem that i tried to solve recently in a very clean manner.

Where
--------------

Project is located on github @ https://github.com/defunkt/dotjs.git


Down the rabbit hole
--------------

So cloning the project results in the following 
file listing 

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

It seems the core repo i am looking at is only meant for OSX which would 
explain the plist file i saw earlier. Will continue looking into this repo
and switch to a windows repo when i need to actually test it.

Its also nice that the readme includes direct links to the ports.

Rakefile
-----------------

As expected the code in the rakefile is ruby and is supprisingly easy to read.
The file contains a number of tasks that are split up neatly as listed below

    task :all => [ :prompt, :daemon, :create_dir, :agent, :chrome, :done ]  

The task above executes all the tasks in the rake file and provides a nice 
index to the list of tasks in the file.

The author has split up the tasks quite neatly and each task encapsulates
each bit of functionality very nicely.

Not sure if i should should analyze every single task.
The following tasks a grouped under a namespace :install , this
means that all the tasks  listed below will be executed when running
the install task

### :prompt 

Simply prompts the user to confirm what the rake file overall task will execute.

### :done

This is a neat little task which checks if the entire process completed successfully 
buy curling the local end point. I assume there is probably a http library that
rake/ruby could use but by using curl it simplyfies things a fair amount since
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

simply prints the message that the user should install the extension and link to the
extension that should be installed.

There are a bunch of tasks grouped under the :uninstall namespace. Wont be covering
this since it just does the reverse of the tasks i just looked at.

djsd
-----------------

This is the core service that is setup by the rakefile. running the command

    file djsd

Tells us that the file is not a binary but rather a ruby script which means
I can now inspect this using a text editor.

Opening the file and going from top to bottom tells us the following. The
script does some basic argument checking. It checks for the help param 
which prints the usage commands for the script. It also checks for the version
flag whihc just prints the version and exits.

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
file instead of script the script. Although this self encasulation is reasonably
usefull.

I will also need to do more testing to determine why the author chose to use
ssl when hosting the server since the cert is distributed with the extension
changing the cert is easy enough.




