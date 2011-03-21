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
There are 3 function in the code 
{% highlight cpp %}
void getKey(int* key);
void xor(char* buf, const char* text, const int* key, int keylen);
int main(int argc,char** argv);
{% endhighlight %}
