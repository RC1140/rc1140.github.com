---
layout: post
title: Must installs for django 
---

I have recently started using django alot more and must say that I am
really enjoying it. As such I thought I should share some info that I
have come across while learning the basics.

One of the first addons that you should install for djano is the 
South plugin. Doing this is pretty simple (all examples are for 
ubuntu).

Simply run the following command :
	{% highlight bash %}
	sudo easy_install South
	{% endhighlight %}

Next edit your settings.py and add 'South' to your installed apps list.

Finally run a ./manage syncdb and you should be ready to go. As to the 
basics of using South there isnt really much to it.

Run the following commands to get started :
	{% highlight bash %}
	./manage schemamigration <yourappname> --initial
	./manage migrate <yourappname>
	{% endhighlight %}

That will crete the inital migration file and as long as you havent
created the tables manually it will setup the tables in your DB.

Anytime that you change something in your models.py simply run :
	{% highlight bash %}
	./manage schemamigration <yourappname> --auto 
	{% endhighlight %}

This sets up the the migration changes but does not apply them yet.
To apply the changes run the migrate command again :
	{% highlight bash %}
	./manage migrate <yourappname>
	{% endhighlight %}

Thats as simple as it gets , there is alot more information and
advanced things that South can do , to get more info go to 
http://south.aeracode.org/docs/
