---
layout: post
title: Tunneling to freedom
---

### With great power comes great ...
* * * 

Everyone knows the deal use what you know for good etc. etc.

With that in mind this is going to be a really quick intro on using ssh tunnels.

The reason for the header is this , if you want to do this at your 
company with out permission don't do it .People really don't like it when
you disobey the rules and breaching a outgoing firewall can really
make some people angry (including me). If you want to do this at home to 
learn stuff then please read on

This has been talked about alot in the past but this is my post on it.

### Why :
* * * 

There are many times when perimeter firewalls can just get in the way
of things and as a admin it might be simpler to just tunnel through 
them. 

Another example would be accessing a server that is not directly
connected to the net. This can be done by using the ssh server as 
a proxy.

Finally its a good security practice to tunnel insecure protocols(vnc 
is the most common example) over a tunnel so that they are less likely
to be sniffed.

### How :
* * * 

The following examples can be used on any OS of choice , all that is need
is to have a ssh program of your choosing and a remote ssh server.

I will be running the examples via the command line on MacOS X but if you 
have access to another linux/unix install this will work in the exact same 
way.

#### Punching through firewalls
* * * 
<img src="/images/straight.png"></img>
This is probably the simplest , if all you want to do is simply browse with
without being monitored etc.

The following command does this : 

ssh rc1140@localhost -D 8080

Of course you need replace localhost with the name of your remote server.
This will open up a dynamic port on port 8080 , to use this for browsing
or any other application simply set it as a socks proxy in
the config for the relevant application (e.g. firefox).

#### Making internal resources accessible to the outside
* * * 

Again doing this with ssh is really very simple but requires a bit more
explanation.

The Command : 

ssh rc1140@remoteserver -R 8080:localhost:80

This creates a remote bind on port 8080 on the remote server that connects
back to port 80 on the localhost.Note that the connection needs to remain 
open at all times if you wish to use the local resources (in this case port 
80 on the local machine)

This command is especially useful in a scenario where the outside party cant
ssh into your server but you can ssh out. Think of a remote support staff that
needs to get access to resources on your network while the vpn is down , while
they cant get in. You can most surely get out and setup and temp forward for
them to use.

#### Making remote resources available locally
* * * 

This is the opposite of the example above.

The Command : 

ssh rc1140@remoteserver -L 8800:localhost:80

This creates a bind locally on port 8800 and forwards all calls to the remote
port and host , in this case it forwards all requests on port 8800 to port
80 on localhost of the remote server. While this doesn't accomplish much since you 
can already ssh into why not just browse to it directly. But you can replace localhost
with for example the IP of your home router (assuming you can access it from the remote server).

This is also used in the case where you want to use the tunnel to secure your connection
when using something like vnc.

Example : 

ssh rc1140@remoteserver -L 5900:localhost:5900

Now instead of connecting to the remote server directly you would instead
connect to the localhost (make sure you don't already have a local vnc server running).
This will ensure that all your communication over vnc is secure.

I tried to cover all the important base's with ssh tunnels but please do let me know
if I have missed anything

