---
layout: default
---
# Ghetto Dynamic DNS

Story goes like so , I wanted Dynamic DNS with a custom domain but I didnt want to pay
the costs the dyndns etc were asking so I rolled by own with the help of Amazon Route53.

## How To

1. Register your domain in the Amazon Route 53 UI.
2. Update your domains records to point to the DNS servers given to you in step 1.
3. Wait for your changes to propergate 
4. Install the following python packages on your local machine (pystun and cirrus).
5. Updated your ACCESS key,SECRET key and domain in this [script](https://gist.github.com/3299314)
6. Run the script on the server/pc that is behind the dynamic IP
7. Maybe (if you want) add the script to cron and let it run automatically

This is not my finest scripting so feel free to poke and jeer (altough rather send me fixes). 
Someone is going to bring up the fact that you shouldnt store your keys in the script, if you
feel this way feel free to replace those 2 lines of code with

    access_id = os.environ['AWS_ACCESS_ID']
    secret_key = os.environ['AWS_SECRET_KEY']

Which will get your keys from your current bash/shell session.

Finally the code is fairly easy to read but ping me if you need help.
