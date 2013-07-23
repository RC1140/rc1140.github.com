---
layout: post
title: Chrome Extension Analysis
---

# An analysis of a Chrome extension: 
* * * 

## Introduction: 

In this post I hope to give you an introduction into the process of analyzing a Chrome extension. To demonstrate this 
I will be analyzing a Chrome extension called hola unblocker. While the article will focus on reversing and analyzing the
hola unblocker extension the process can be generalized to analyze most Chrome extensions.

The high level structure for analyzing an extension is as follows: 

- [Acquire a copy of the extension](#getextension) either via direct download or via the Chrome store.
- [Extract the extension](#unpackextension) to get access to the files within the extension.
- [Analyze the manifest.json file](#manifestdetails) to determine what files the extension uses and what the files are used for.
- [Perform individual analysis of the JS files](#jsdetails) that were located in the manifest file.
- [Collect Results and build report](#fin).
- [Done](#forward).

## Getting started:
### Tools: 

In order to successfully analyze an extension, you will need the following tools:

- Good Text editor. Since a fair amount of the analysis requires reading code a good versatile editor is useful. I personally used sublime text 2, but notepad++ or vim could work just as well.
- Archive Manager. The archive manager will be needed to extract the zip file contents. Personal tool == 7zip, but anything that can handle zip files (including windows explorer) is ok.
- [Optional] [Node.js](http://nodejs.org/). This is purely optional and I use it to extract function names from scripts, if you want to use the same script you will need to have node.js installed.
- [Optional] Wget. Used to grab a copy of an extension from the Chrome store without requiring the extension be installed.

### Chrome Extension Internals: 

Chrome extensions are usually built either with HTML + JS (most common extension type) or native code. The native code can usually present
A fairly hard analysis as it would require the reversing of a compiled dll. The HTML + JS route on the other hand is a bit easier and thankfully follows a fairly structured means of execution.

### <a name="getextension"> Getting the extension </a>:

So to get this started the first thing that is needed is to get hold 
of the extension. This is not much of an issue when it is provided via direct link, but in the case
of a Chrome store extension (which is where most extensions are hosted) getting the extension is a bit tricky.

Note: For obvious reasons if the extension is malicious we would not want to install the extension. So I am going to
gloss over analyzing an already installed extension.

If we start by searching the Chrome store for 'hola unblocker' we will redirected to this 
URL (https://Chrome.google.com/webstore/detail/hola-unblocker/gkojfkhlekighikafcpjkiklfbnlmeio).
Note: At times the search didn't work for 'hola unblocker' and I had to use Google search instead to locate the link.

From this URL we can extract the ID of the extension. The ID is the last part of URL before the parameters which in our case would be:

ID: gkojfkhlekighikafcpjkiklfbnlmeio                                                   

Once we have the ID we want a direct download link for the extension. In order to get direct
download link, we insert the ID we obtained in the previous step into the URL below where is says `<ID Here>`.

Template: `https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D<ID Here>%26uc`                              

Result: `https://clients2.google.com/service/update2/crx?response=redirect&x=id%3Dgkojfkhlekighikafcpjkiklfbnlmeio%26uc`

This will allow us to perform a direct download of the URL without the need to install the extension.

### <a name="unpackextension">Unpacking the extension</a>:

Once the extension has been downloaded rename the extension from .crx to .zip since the extension is
simply a compressed zip file. Extract the file which we downloaded with your zip extraction tool of choice.

### Extension Structure:

Once extracting the extension, we will be faced with listing similar to the image below. 
Keep in mind that the folder structure may change depending on the developer's implementation. 
In any case, a manifest.json file will always exist in the extensions root directory.                                                                                                                                                      
![extensionListing](http://runawaycoder.co.za/images/extensionListing.png)

Firstly, the entry point for any extension is the manifest.json. This files allows Chrome to understand how
the extension is laid out, what files are included and where they should be loaded.                                                                                                           

Next, the background.js file is where any non UI code is usually located. The background.js will be loaded into
memory when the extension is loaded by Chrome and on any subsequent reloads. Keep in mind that the background.js file
does not execute any kind of startup function and is interpreted like a normal JS file, so as a developer all code
needs to be wrapped with functions to prevent auto execution. A background.js file is usually found in an extension that needs to access
the Chrome extension API. By default this access is blocked by scripts that are loaded in UI areas such as the pop-up and content
areas.

The content script (usually called content.js) is a JS file that is loaded into every page that matches a [pattern](http://developer.Chrome.com/extensions/content_scripts.html#match-patterns-globs)
provided by the author of an extension. These patterns make it easy to spot nefarious actions in an extension. For example if
a plugin advertises that it allows you to see how many unread gmail messages you have then it should not have a pattern that 
gives it access to yahoo.com. 

Content scripts are very powerful as they allow extension authors to access any DOM elements that are on the page they are hooked
into. A point worth noting is that if an extension author makes use of native API the permissions shown to the
user indicating the pages a content script would be loaded into are hidden. Instead the extension will request data
to all websites (which depending on the type of extension may or may not be suspicious).

Finally the popup.html is what is shown when a user clicks on the extension icon in Chrome. This can optionally 
load a JS file of its own. Optionally an extension may sometimes include an options.html with handles the saving of
options for an extension. This sometimes provides and interesting insight to where and what data is being stored.
 
## The Dive:

Before we dig into this I should mention that I suspected that the extension was using proxies to re route the traffic
and this analysis was just to see how exactly they implemented it.

When loading the hola unblocker manifest.json we see the following data:

     {
        "update_url":"http://clients2.google.com/service/update2/crx",
        "homepage_url" : "http://hola.org/unblocker.html",
        "permissions" : [
           "proxy",
           "webRequest",
           "webRequestBlocking",
           "<all_urls>",
           "storage",
           "tabs"
        ],
        "version" : "1.0.159",
        "background" : {
           "scripts" : [
              "scripts/jquery-1.8.3.min.js",
              "scripts/background.js"
           ]
        },
        "name" : "Hola Unblocker",
        "icons" : {
           "128" : "images/icon128.png",
           "16" : "images/icon16.png",
           "48" : "images/icon48.png"
        },
        "description" : "Access blocked content from any country in the world, free.",
        "browser_action" : {
           "default_popup" : "popup/popup.html",
           "default_title" : "Hola Unblocker",
           "default_icon" : "images/icon19_gray.png"
        },
        "minimum_Chrome_version" : "18.0.1025.168",
        "manifest_version" : 2
     }

### <a name="manifestdetails">Manifest break down</a>:
#### Initial URLs

    "update_url":"http://clients2.google.com/service/update2/crx",
    "homepage_url" : "http://hola.org/unblocker.html",

The initial URLs that we spot at the top of the manifest are fairly self-explanatory. But to break it down
the update URL is the location that will be checked to see if there is an updated required. The homepage
URL is a link to the home page of the company / developer. The home page is optional but can provide additional
information about the developer behind the extension (in case we only ever looked at the Chrome store).

#### Extension Permissions

    "permissions" : [
       "proxy",
       "webRequest",
       "webRequestBlocking",
       "<all_urls>",
       "storage",
       "tabs"
    ],

The extension permissions dictate what features of Chrome the extension has access to, from a developer perspective 
this should be kept to a minimum to limit the damage your extension can do if compromised.

When looking at the list of permissions from the top down, the author of extension is requesting access to Chromes
[proxy](http://developer.Chrome.com/extensions/proxy.html) ,[webRequest(Blocking)](http://developer.Chrome.com/extensions/webRequest.html) 
,[Programmatic Injection](http://developer.Chrome.com/extensions/content_scripts.html#pi)
,[storage](http://developer.Chrome.com/extensions/storage.html)
and finally [tabs](http://developer.Chrome.com/extensions/tabs.html). The explanation of each of the permissions
is explained in the pages linked to each permission.

The permissions I was most interested in was the proxy permission which is how the extension handles the traffic filtering. 
While the `<all_urls>` permission is a little worrying there is no evidence yet to suggest that it is being abused. The storage
and tabs permissions are usually linked to saving the users options and opening a new tab once the extension is installed
to let the user visit the authors home page.

At this stage there is no information explaining the inner workings of the extension and the analysis of the permissions
is based entirely on information provided by Google as a recommendation in their documentation.

#### HTML Pages and extension Meta data

        "version" : "1.0.159",
        "background" : {
           "scripts" : [
              "scripts/jquery-1.8.3.min.js",
              "scripts/background.js"
           ]
        },
        "name" : "Hola Unblocker",
        "icons" : {
           "128" : "images/icon128.png",
           "16" : "images/icon16.png",
           "48" : "images/icon48.png"
        },
        "description" : "Access blocked content from any country in the world, free.",
        "browser_action" : {
           "default_popup" : "popup/popup.html",
           "default_title" : "Hola Unblocker",
           "default_icon" : "images/icon19_gray.png"
        },
        "minimum_Chrome_version" : "18.0.1025.168",
        "manifest_version" : 2
        
Looking at the last bit of configuration from the top down we are dealing mostly with meta data for the extension. The extension  
version number is used when doing update checks. 

The background section indicates which script files are loaded into the background for later use. In the case of
hola unblocker it is simply a copy of jquery and its own background.js file which we will analyze later.

Next up is the name, icons and description that will be show for the extension in various locations.

Next the browser action section is defined. The [browser action](http://developer.Chrome.com/extensions/browserAction.html) loads
the badge for the extension into Chrome and also defines its icon and hover title. The popup.html that is defined
here is another file that is usually with investigating depending on the type of extension being analyzed. 

Finally the minimum Chrome version and manifest version indicate what version of Chrome the user needs to use. The minimum
version usually affects users that run version of Chrome that are installed from a repository like the ubuntu 
repositories. The [manifest version](http://developer.Chrome.com/extensions/manifestVersion.html) indicates that the extension supports many of the newer security features implemented
by Chrome XSS protections. It is usually a good sign when the manifest version is set to two, it should be noted that
manifest version one is being phased out slowly by Google so at some point all extensions will implement version two.

#### <a name="jsdetails">Background.js </a>

The background.js file is usually where the meat of most of extensions will be. Keep in mind though, that the functions
stored here are more akin to functions stored in a linked library. That is they are not executed unless called. This is 
due to the fact that only code in the background.js file can access various Chrome api's. As such the bulk of the functions 
that need API have to reside here, also since this is just a JS file with special access any code not located in 
A function will be automatically executed the first time the extension loads or is reloaded.

Depending on the length of the background.js file it is sometimes useful to get a high level overview of the functions
stored in the JS file. This allows us to pick targets with which to look at a little more specifically than reading
the entire JS file from top to bottom. To extract the functions from a file I wrote a small node.js script 
which parses a JS file and list all named functions. Now while I understand this script will not work in all cases 
it was enough for the current extension I am looking at and provides enough information to dig further.

The list below is generated from [this](https://github.com/RC1140/nodeJSScripts/blob/master/extractFunctionsFromJSFile.js) script:

__Command :__

    node .\extractFunctionsFromJSFile.js background.js

__Function List :__

    vercmp
    set_sites
    pac_url
    get_opt
    update_ui
    get_state
    set_state
    handle_auth_req
    set_saved_state
    client_cb
    check_client
    log
    clog
    handle_install
    
By scanning over the list there are already 2 functions that are of interest, the first is pac_url which thanks to some
prior googling points to the fact that the extension is using [pac config files](http://en.wikipedia.org/wiki/Proxy_auto-config). 
Pac configuration files for those not in the mood to Google it are simply __P__roxy __A__uto __C__onfig files. Now assuming
that wasn't self explanatory the configuration files will allow a browser to select a proxy dynamically based on a given URL 
and configuration.

The second function of interest to me is the handle_auth_req , which just from name tells us that it deals with some
level of authentication. Starting with the second function (because it sounds more interesting) we perform a quick 
search in the background.js file. This returns 2 results, the first is the function and the second is its usage.

     function handle_auth_req(details)
     {
         if (!details.isProxy || details.realm!=="Hola Unblocker")
             return {};
         return {
     	    authCredentials: {
     	      username: "proxy",
     	      password: "*************"
     	    }
         };
     }

Even though I wasn't looking for a fail we now find that they hard coded their user name and password for their proxy.
For a malicious user this provides plenty of fun , for us we just note it down and continue the analysis. The second
usage of the function is in the code that runs automatically when the background.js file is loaded (line 274). Looking
at the line above we see a comment indicating that they wanted to protect their proxy from automated scanners which
at least shows some effort to keep things kind of secure from their side.

Sadly when looking at the actual line of code we see the following:

    Chrome.webRequest.onAuthRequired.addListener(handle_auth_req,
        {urls: ["<all_urls>"]}, ["blocking"]);

We see that they setup a blocking request for any URL that requires authentication , the obvious badness in this is that while
using the extension any URL that is loaded goes through their proxy. This in turn will block all requests till the authentication request resolves.
Now we can assume that they only handle a select set of URLS (yet to be verified) which will mean not much of an 
inconvenience. But if they end up proxying all URLs by mistake, any url navigated to would be blocked until their listener finishes execution.

Now taking a step back and looking at the original function that might be of some interest was pac_url. Looking at the function in detail it doesnt really do anything particularly interesting, instead it generates the location where the pac file can be downloaded from. With some simple mental match we can work out what is that location that will be returned (which looks something like this)

      https://client.hola.org/proxy.pac_dev?browser=Chrome&ver=24

Navigating to that url will generate a proxy pac file that your browser will understand. As an aside for a browser to use the proxy pac file it needs to contain a JavaScript function with the following signature:

      function FindProxyForURL(url, host)

The hola extension provides this method and two basic other helper functions which it uses to do some neat little proxying. For example their code will not allow any calls to the following extensions ( gif|png|jpg|mp3|js|css|mp4|wmv|flv|swf|json) on the Pandora site to go through their proxy. This should save them the effort of having to proxy every single resource on a site they want to provide support to.

Another interesting and slightly worrying function that we come across buy reading through the file is the clog function. This function essentially makes a remote call to their remote servers with a message their choice + a uuid which I can only assume is to uniquely identify users.

This is an example of the get request that is made to the server:

    https://client.hola.org/proxy.pac?browser=Chrome&ver=1.0.173&uuid=001186cf98ad20743db252565a3fa7a9&id=123&info=123123&clog=1

The uuid is unique on my pc and the id / info are just parameters passed to the function. With this info sent as get requests it will be very easy to compile this data into a db and do analysis over time against users that use their service. This kind of data leakage is slightly worrying but if we have access to this source code (which you would if you have been following along with this blog post :) ), you can simply remove the call's we don't like and recompile the extension and it will work the same as before.

If we perform a quick read through the rest of the background.js file we will notice that there is not much more that is interesting in the file and aside from the code at the end of the file that sets up the blocking listeners the rest of the functions remain available but not used by the background file.


#### Popup.html + Popup.js 

The next part of the extension that we will be looking is the popup related files. These are popup.html which handles displaying of the UI the badge button is clicked and the popup.js which will handle an JS related calls since inline js is not allowed in version two of the extension manifest.

The popup.html is fairly simple as there is no UI related content for this extension, it simply contains a couple base images to display to the user. 

The popup.js file does not do too much either. It starts of by adding some dynamic html to the existing popup.html page so that a user can enable and disable the extension at will. It also adds some simple UI features such as making sure the dynamic links that are added actually open their respective web sites. Aside from these basic functions, there is not much more we can look at with these two files.

### <a name="fin">Fin</a>

With those being the last pages to look at there is not more that we can analyze with this current extension. Yes they do some weird things in their code and there are some issues that might worry a more security conscious user, but on a whole the extension is simple yet effective. If a person was so inclined it would be fairly easy to generate a custom pac file and extension that would use your own personal proxy server that you have more control over. This could then be distributed to people that you wish to share access with, this is a fair amount simpler than asking a user to setup various bits of configuration.

In conclusion the analysis of an extension is fairly structured. First grab a copy of the extension, then extract the extension to get a list of the files contained within. Next analyze the manifest.json to determine files which files are being used, where they are used and that they are used for. 

The next part of the analysis is a bit subject , depending on your style either analyze from the background up to the UI or analyze from the UI down to the background. The background first analysis usually tends to provide a more structured approach as the functions are usually stored in and easily parse-able state.

### <a name="forward">Cleanups and Forward</a>

So the question now is what happens after your analysis has been completed (as in the case now). My first plan is to automate the entire process.
While this means simply converting each of the steps into a script it takes a little time to test all this so I am putting it off for a bit. If on
the other hand you wish to build the script yourself please go ahead and build it, just let me know so that I don't duplicate work
that may be better than mine.

The other thing that I wanted to do now that I know what was wrong with the extension or rather what I didn't like I can patch the extension to work around
these issues. The two issues that I wanted to patch were the fairly open permissions and the constant logs to the authors remote servers. Patching the
remote server calls are pretty easy, simply delete the clog function and then remove any calls to the clog function as well. While I was at it I 
fixed a few tabbing issues to make things easier to read. 

So without further ado here is the diff file for my patch, https://gist.github.com/4676624. This diff removes the clog file as well as change the 
permissions within the extension. All these changes still allow the extension to function as normal. 

With that out of the way I am not sure if I missed anything in my analysis or if there is anything further that I could have done. If you feel I should
change anything or add more information please feel free to contact me.
