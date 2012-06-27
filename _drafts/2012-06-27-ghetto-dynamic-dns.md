---
layout: default
published: false
---
# Ghetto Dynamic DNS

With great power comes great responsibilty , As a developer one best things is being able to build what ever you can imagine (within reason). This almost always means that when I am not happy with a service online I can most probably build it myself in the way I like it. With the joy that is open source code you can even get away with not build stuff from scratch.

So while DNS is something that everyone needs it is also something that not everyone wants to pay for. Personally I never need to update my various DNS entries more than once every couple of months so paying more than $5 a month is a bit more than I care to spend. At the same time  everytime I build a web app I want to give it a nice DNS name so that things look a bit nicer. In the past all this was covered thanks to everydns which was donation based DNS provider.

During my entire time with everydns I never really had any issues with them but sometime last year they got bought out by dyndns. Since I was an existing customer when I was migrated to DynDNS I got a reduced price for couple of months. This reduced price was still more than i was willing to pay but I had close to 10 domains with them and I was just not in the mood at the time to migrate to another service. Then roughly 3-4 months ago DynDNS ended my reduced pricing and started charging me the full rate for their service that I had been migrated to which costs $30. 

This was now the straw that broke the camels back. I quickly setup a dns server to manage my various domains. After much help from @tgenov the server worked just as I wanted. The only thing holding me back from cancelling my DynDNS account was the fact that I needed Dynamic DNS for one of my domains. At the time I could not work out a free or really cheap way to hookup dynamic DNS with a custom domain. The cost for dynamic DNS from DynDNS is $30 a year for a single domain. This is also pretty close to what other providers like NoIP charge as well. In the end this is still more than I was willing to spend and it would mean that I would need to split my hosting over multiple providers. 

Finally I really did not want to hack up my own dynamic DNS with bash and sed scripts. I finally got distracted by other work and promptly forgot about my little project until couple of days ago when reconciling my expenses I realized how much I was spending for DNS. Having finally launched signalnoi.se I decided to take a look again and see what my options were. Turns out there is a pretty simple solution in the form of Amazons Route 53. The best part with Route 53 is that they have an API to control everything. So now with 2 scripts I can grab my external IP address and then fire off a call to the Route 53 API to make change to my domains record. I should mention that the cost for hosting a domain with Amazon is $0.50 per domain. This means that for the cost of hosting with DynDNS I could host 60 domain with Amazon. 

## How To

1. Register your domain in the Amazon Route 53 UI.
2. Update your domains records to point to the DNS servers given to you in step 1.
3. Wait for your changes to propergate 
4. Install the following python packages (pystun and cirrus).
5. Export your ACCESS and SECRET keys from the console 
6. Finally execute update_host.py "domain name here" -a "IP here" with the name and IP address of your domain. This will update the A record for your domain to point to the new IP address you provided.

