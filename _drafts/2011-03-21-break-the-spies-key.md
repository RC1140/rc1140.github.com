---
layout: post
title: Breaking the Spies Key 
---

## Intro
* * * 

Breaking the spies key is the first of many hackfortress challenges.
While it is not yet diving directly into reversing just yet it gives
you a good reason to want to learn C and gain a bit of understanding.

### Gettings Started
* * *

As stated above this challenge is fairly easy and doesnt require any
reversing knowledge just yet , instead it gets you introduced to static
analysis.

If you havent already got the files you can clone there from [here](https://github.com/peasleer/hackfortress.git)
with git.

What this means is that to gain the answer you need to look through 
the code file that is provided with the challenge. The first thing
that you need to do is gain a basic understanding of what the code
is doing , if you want you can even compile the code and let it run 
at least once. 

### Analysis
* * *

After a quick read through of the code the following becomes clear.
There are 3 function in the code.

{% highlight cpp %}
void getKey(int* key);
void xor(char* buf, const char* text, const int* key, int keylen);
int main(int argc,char** argv);
{% endhighlight %}

Looking at the functions based on when they appeared in the file
we first start looking for where each function is used. A quick
scan shows that the getKey is not used any except for its definition.
The xor function on the other hand is used in one place generate the
plaintext from the given key. Since no key was given to us up until now
we can assume that the getKey function was provided to us as a hint to
solving the challenge.



### Modifications 
* * *

At this point you have 2 options , either manually calculate the result of
the function or let the app calculate it for you. I decided to go for the
easier method and let the app calculate it for me. I did this by adding the
following lines of code.

{% highlight cpp %}
if( argc < 2 )
{
    printf("\n[ H A C K | F O R T R E S S ]\n\n");
    printf("We've intercepted a secret message, but can't decrypt it.\n");
    printf("If you provide us with the right key, we'll help your team!\n\n");
    //Changed below
    int mKey;
    getKey(&mKey);
    //End Change
    return;
}
{% endhighlight %}

and then

{% highlight cpp %}
void getKey(int* key)
{
    char buf[64];
    double approx = (double)22/7;
    snprintf(buf, 64, "%1.64f", approx);

    int i = 37;
    for( i; i < 41; i++ )
    {
        key[i-37] = buf[i]-48;
        //Changed below
        printf("%d", key[i-37]);
        //End Change
    }
    return;
}

{% endhighlight %}

Basically all I did was make a call the getKey function and then
print out each of the numbers that that is supposed to be stored
in the key variable. Running the app again shold print out the 
numbers 2935 , this is the key that will be used to decrypt the text.
To decrypt the text simply pass in the numbers we got above as the
first param of the application. Doing this will give you the following
piece of text '(metaphorical) ladykiller, (real) mankiller.'. 

Since the challenge indicates that you need to get a md5 hash for this
text we have one last task simply type.

{% highlight bash %}
echo '(metaphorical) ladykiller, (real) mankiller.' | md5
{% endhighlight %}

Note : md5 is the mac app that I call for hashing on linux you could
just as well use md5sum

This will produce a md5 hash that you can compare to the hash they 
give (61b7d4e5fc2ec41612dba5fae356e268)


