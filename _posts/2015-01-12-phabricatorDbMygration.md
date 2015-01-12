---
layout: post
title: Migrating Phabricator Database Server
---

The process is fairly simple but is not very well documented if you only want to migrate your db server (server upgrade or replacement).

Start by backing up all the phabricator databases (yes there are alot) using the command 

	./phabricator/bin/storage dump | gzip > backup.sql.gz

The command will use your phabricator settings so that you dont need to provide any login creds.

This uses an internal phabricator script to backup all the required data and gzip it for you.
With the data backed up copy it to the new server using scp or your choice or file transfer.

On the remote server run 

	gunzip -c backup.sql.gz | mysql -u <your user> -p

You will need to modify the mysql command to use your user/pass as needed , this can take a while so be patient. There is also no visible output from the restoration so patience is your friend.

The steps to this point are covered on the phabricator migration located [here](https://secure.phabricator.com/book/phabricator/article/configuring_backups/).

Once the db is restored, ensure that you create a new user for remote access and grant it access to all your phabricator db's. There is no simple way to grant access to all the db's, executing this script will generate the required sql for you which can then be executed to grant the required access.

	SELECT CONCAT('grant all privileges on ', SCHEMA_NAME, '.*  to <new user here>;') FROM `information_schema`.`SCHEMATA` WHERE SCHEMA_NAME LIKE 'phabricator_%';

Once you have the required access ensure that you can connect to the db server from your webserver, this is crucial as the app goes offline if it can not connect to the db server.

With the db sorted the following commands will change the phabricator config to use the new server.

	./phabricator/bin/config set mysql.host <remote host>
	./phabricator/bin/config set mysql.user <remote user>
	./phabricator/bin/config set mysql.pass <remote pass>

Restart the daemons and webserver 

	./phabricator/bin/phd restart
	service apache2 restart
	service mysql stop

Once these commands have executed your server will now be using the new db and your mysql db will be stopped, at this point its best to verify that the web interface is still functional. If not revert and try to fix depending on what failed.

Thats about it really :), enjoy the new server.