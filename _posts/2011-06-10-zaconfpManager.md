---
layout: post
title: Building a IRC bot with node.js
---

   
## Intro - What is node.js
* * * 

Node.js is a event based server side JS application. The reason that I refer to node
as a application not a framework is because you write JavaScript not node. Node simply 
parses and runs your JavaScript while at the same time providing users with some core
libraries with which to build applications with. In the background node uses the v8 JavaScript
engine to extract the maximum performance out of JavaScript.

Server side JavaScript is nothing new , mozilla has been doing it for a [while](http://www.mozilla.org/rhino/) but it has never
this accessible. Writing server side JavaScript means that you use JavaScript in a the way
you would use any other programming language but for a function that it is really good at (dealing with events and callbacks). 
But the most important difference between normal browser based JavaScript and node is that you
dont have a browser dom to work with , so familiar variables like `window` do not exist , instead
you are given a new variables like `process` which gives you information about the current running
node process. While you do no work with the browser it does not mean you can not work with web pages. 
There are a good few libraries that provide this functionality (more on this later).

Getting started with node.js is pretty easy if you are familiar with the unix way of building applications from source.
If not this [article](https://github.com/joyent/node/wiki/Installation) should get you going pretty quickly,
the basics are get the source, configure , build , build install. There are distribution for windows but it
lags slightly behind the latest version , you could of course build it from source if you wanted to. Although
you should keep in mind that unix is the preferred dev/working environment.

Once you have node up and running , you can check that everything is working by simply typing 
node at the command line. This will launch the node.js repl interpreter which is extremely useful
for testing small chunks of code as you are working. To run a node script type `node script.js` at
the console and node will execute your script.js file.

A simple console hello world can be seen below
![console example](/images/console.jpg)

One of the things that many people find hard to grasp is the non-blocking aspect of node. Non blocking is simply the concept of fire and forget in such a way that it never waits for a response from a line of code. An example of this is listed below.

    var fs = require('fs');

    fs.writeFile('/tmp/1.txt', 'some content that takes long to write', function() {
        console.log('done writing file');
    });

console.log('some other message');

The code above does 2 things , it writes to messages to the console and writes a file to the disk. When you run the code because writeFile is non blocking it fire of the text writing code and immediately print ‘here I am’ , once the file is finished writing it will print ‘done writing file’. In a synchronous language we would typically write it something like this :

    file.writeText(‘some text’)
    print ‘done writing file’
    print ‘some other message’

Because line 2 would only print once the code is finished writing the text to file in contrast if we had to write the same code the ‘done writing file’ would fire before the file was finished writing to disk

The code below is a example of a node hello world application. You can paste this into the node
interpreter or save it to a js file. If executing it from a js file run , node <filename.js> wher
filename is the name of the file you saved the text into

Hello World Server

    var http = require('http');
    http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Hello World\n');
            }).listen(1337, "127.0.0.1");
    console.log('Server running at http://127.0.0.1:1337/');

This example creates and hosts a web server on port 1337 , when ever a client connects to it (with a web browser,curl,wget)
it will return the words Hello World. Something to be kept in mind is that this is all non blocking
so when the code runs it doesn't halt and the createServer line and wait for input. Rather it hooks
up a callback to the request that will be executed every time a user requests the url. This is important
because until a user hits the server the pc is not doing anything it is simply idling and waiting for
a request on the web server.

So why would you want to use node over any other language , well there is no magic bullet
with node , you simply have to evaluate it to see if it makes sense to use node or not to use it.
For example are you happy that its still in development , do you need to be able
to handle multiple concurrent connections , what is the size of your project. These are
just some of the questions that you need to ask.

If you want a better explanation of the ups and downs of node and how it handles processing I highly suggest reading 
[this article by Felix Geisendorger](http://debuggable.com/posts/understanding-node-js:4bd98440-45e4-4a9a-8ef7-0f7ecbdd56cb)

## Give me the code already
* * *

(Not just yet scroll down a bit more)

Trying to explain this can be difficult at the best of time by the best of people and since I am neither
I am going to rather try and do this with a example in the form of a IRC client for our local hacker
community.

For the past few months we have been running a game in the channel called fp. The idea and premise around
it is pretty simple , the first person to say the word 'fp' after the local channel bot (hiro) calls start.
If a user won a game it was recorded and a local leader board was started.

As you can imagine someone decided it would be fun to build a bot that could win the game for 
them (I cant remember who was the first). But this escalated the game (to beat the bots) in small increments to the point 
where users had to verify a captcha from the bot , the capctchas were simply a list of urls or questions
with a predefined answer.

While this slowed down some of the bots , in the end a bot developed by @tgenov was pretty much 
un beatable (unless you beat a race condition bug it had). At this point the game stopped and 
the game was put on hold till some new dev could be done.

So I humbly present the new FP Manager bot , the reason for all the back story is so that you 
know what the new manager has to deal with.

### Things the bot needs to do :
Thing 0 : Connect to the IRC server 

    var client = new irc.Client(config.IRC.server, 'fpm', {
        userName : 'fp Master',
        realName : 'Manager of the fp',
        autoRejoin : true,
        channels: [config.IRC.channel],
    });

There is not much code to show when it comes to connecting , you simply 
pass in the correct parameters and the library handles connecting to
the server automatically. You can prevent this but its simpler to
work this way.

One of the things that make node very nice to work with is the amount 
of libs that are out there for use. In our case we did not have to
write a library to connect to the server we simply used the existing
IRC lib that was created for node. Libraries are currently installed
via various different node package managers, the most used and in my
humble opinion the best is npm. 

Installing a lib with npm is easy enough , simply type `npm install irc`
to install the irc client. One good thing that this does is install the
lib in a local node_modules folder. This ensure that if you move your 
app around the libs that it requires move as well. There is a option
to install it globally if required.

Thing 1 : Load up the manager and let the room know things are online 

    client.addListener('registered', function () {
        fpManager.setupNextFpOpen(client);
        setTimeout(function(){
            client.say(confir.IRC.channel,'Next FP starts at : ' + fpManager.ttNFp.toString() + ' seconds ');
            },10000);
        formManager.loadAndInit(client);
    });

What this does is hook up a anonymous function to the registered IRC event. This will cause the anonymous 
function above to be executed once it is registered with the IRC server it is connecting to. The important
thing to keep in mind here is that from the time the code above is run till the bot registers with the IRC
server the node application is idling (not sleeping and their by blocking the process).

When the call back is executed we perform a few extra things such as setup the service fp service
setup a timeout to delay the posting of a message to the channel. The form initiation is the last thing
to be setup and is the part of application that host the website you will see later.

The initiation procedure also sets the timeout for then the fp announce occurs.

Thing 2 : Open and announce the fp

    client.addListener('message', function (from, to, message) {
            var fpCatch = /^([f][p])$/i
            if(fpManager.fpOpen && message.match(fpCatch)){
            fpManager.fpOpen = false;
            fpManager.currentHash = hashlib.md5(Date.now().toString() + from);
            client.say(from,config.hostingURL+fpManager.currentHash+'/');
            client.say(config.IRC.channel,from +' has won the challenge , awaiting humanity challenge.');
            fpManager.fpCurrentWiningUser = from;
            setTimeout(function(){
                if(fpManager.currentHash != ''){
                client.say(config.IRC.channel,fpManager.fpCurrentWiningUser +' has lost the challenge, better luck next time.');
                fpManager.currentHash = '';
                fpManager.fpCurrentWiningUser = '';
                fpMan.setupNextFpOpen(client);
                }
                },60000);
            }else{
            if (fpManager.fpCurrentWiningUser != '' && message.match(fpCatch)){
            client.say(config.IRC.channel,fpManager.fpCurrentWiningUser +' is is currently being verified.');
            }else if(message.match(fpCatch)){
            client.say(config.IRC.channel,'Next FP starts at : ' + fpManager.ttNFp.toString() + ' seconds ');
            };
            }
    });

Again we hook up a anonymous JavaScript function to the message event, this will be called
when ever a user posts a message to the room. This could happen a lot so we add a check to
only execute the code if the fp is open (the time out has expired). 

If we find that the fp is actually open we then ensure that the user has entered the word fp
and only fp. Finally we go through the verification , setup , tear down processes. This
occurs in the following order.

1) Close the fp so no more messages are processed.
2) Build a unique hash that will be used to for human verification.
3) Send the url to the person that won , record their name and finally set a timeout.

If the user does not verify within the timeout period they will loose the round.

Thing 3 : Handle the human verification process

At this point the IRC code is not required and continues idling. The web module (express) takes
over at the point when the user clicks the link that was sent to them.

    formManager.loadAndInit = function(ircClient){
        client = ircClient;
        //Setup the url handles and start listening
        app.post('/:hash', handleHumanVerification);
        app.get('/:hash',initialDisplayForUser );
        app.listen(8080);
    };

The code above sets up the urls that need to be handled by the web server, this is basically
setting up route handling. The express module allows methods to pass in variables very similar
to how the ruby on rails framework does.

Unlike previous cases we done use anonymous functions to handle the post and gets for each of
the urls. 

    var initialDisplayForUser = function(req, res) {
        if (req.params.hash == fpMan.currentHash){
            var recaptcha = new Recaptcha(config.recaptcha.PUBLIC_KEY, config.recaptcha.PRIVATE_KEY);

            res.render('form.jade', {
                layout: false,
                locals: {
                    recaptcha_form: recaptcha.toHTML()
                }
            });
        }else{
            res.send('Invalid URL or timeout expired');
        };
    };

The initialDisplayForUser function above simply renders the form `form.jade` to the web response.
In the example above we were lucky enough that another user had already created a recaptcha module
that we could pass to the form which is rendered to the user. The module doesn't do to much, but it
does handle the correct generation of the html and linking of your public and private keys correctly.

I am not going to paste the entire handleHumanVerification method since it is a bit long , but the
core bit which is what executes when recaptcha verifies that a user is human is laid out below.

    fpMan.currentHash = '';
    res.send('You have won this FP , you are hopefully human thanks for helping');
    client.say(config.IRC.channel,fpMan.fpCurrentWiningUser +' has won the fp.');
    fpMan.userHasWon(fpMan.fpCurrentWiningUser);
    fpMan.fpCurrentWiningUser = '';
    fpMan.setupNextFpOpen(client);

What the code above does is let the user know via the web page that they have won and also 
announce on the channel that the user has been verified and won (while verification and winning 
is one step here , it can be broken up into more steps if a bot beats the process).

Finally we execute some tear down code to record that the user has won in a db ,clear out
any used variables and finally re start the fp process.

While I know that I may have been overly verbose its meant to give you a better understanding
and to show that writing a app in JavaScript is doable and quite fun. While the fp manager
doesn't handle tons of requests it was able to get prototyped extremely fast using node. After
running for a few days including handling user requests it used a mere 700kb of mem and is
idle 99% of the time which is pretty good for a bot , if I had to optimize things a bit I 
am sure you could bring down the mem usage even more.

Last but not least the [code repo](https://github.com) , feel free to bash my code and
style as needed I prefer to learn from the wisdom of others.
