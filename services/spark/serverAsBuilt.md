# spark: AWS Server as-built
Node Express MongoDB Apache  server build for Spark on AWS.

## AWS Setup
1. Use Amazon’s lightsail and spin up a debian 10 linux server.
2. Configure the instance name and networking to assign a static IP Address.
3. Create a new SSH keypair and download your pc if you have not already done so.

## SSH Test
using your favourite terminal use the following command to start a session:
```
sudo ssh -i [your pem file.pem admin@[your static IP Address or Domain]
```
This should connect you to the server instance.

*Note: change directory to where your pem file is or enter the path and file name!*

## Install NodeJS & NPM
Double check the debian version
```
lsb_release -a
```

If the above version check does not work then you can install lsb-release.
```
sudo apt-get install lsb-release
```

Enter a super user session:
```
sudo -s
```
*Note: sometimes the installation executes a command without sudo and crashed the installation. sudo -s, places the terminal into a super user (root #) state.*

Download and install the packages:
```
sudo curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -

sudo apt-get install -y nodejs

curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

sudo apt install nodejs
```

Check the version numbers are as expected
```
node --version

npm --version
```

##Install MongoDb
Download and install the package:
```
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/5.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/6.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

sudo apt-get update

sudo apt-get install mongodb-org mongodb-org-server mongodb-org-database mongodb-org-mongos mongodb-org-shell mongodb-org-tools -y
```

Check the version number is as expected (> 5.0 for time series data)
```
mongod --version
```
Setup the daemon Mongod and check it is running:
```
sudo systemctl start mongod

sudo systemctl enable mongod

sudo systemctl status mongod
```


Set Up MongoDb admin user by starting a mongosh session and switching to the admin db:
```
Mongosh

use admin
```
Create the db administrator account
```
db.createUser(
  {
    user: 'admin',
    pwd: '[password]',
    roles: [ { role: 'root', db: 'admin' } ]
  }
);
```

Update the mongodb configuration to enable authentication:
```
sudo vi /etc/mongod.conf
```
Un hash security and add the authorisation line:
```
security
    authorization: enabled
```
*Understand your vi commands or use a text editor you get along with!!!*

Restart the mongoDb Daemon
```
sudo systemctl restart mongod
```

Set the admin db as the authentication db
```
mongosh -u admin -p --authenticationDatabase admin
```
## install the spark API
The node application will be installed in /opt. This can cause permission issues to follow the instructions carefully!!

1. Create the spark directory under /opt
```
cd /opt

sudo mkdir spark
```
2. change the ownership of the spark directory
```
sudo chown $USER spark
```
3. ls -l shows the spark directory is owned by admin. now you can create the directory structure without the sudo prfix
4. create the directory structure.
```
cd spark
mkdir api
cd api
mkdir 0.1 /// or whatever version you are installing
```
5. Copy the files to the server using FTP
*double check the config.env has the correct credentials!!*

6. Set up the MongoDB database
```
mongosh
use admin
db.auth("admin", "[the password]")
db.createCollection('sensorData', { 'timeseries': {timeField: 'timestamp', metaField: 'id', granularity: 'minutes'}, expireAfterSeconds: 1209600})
```
7. Install PM2.
PM2 can do loads of stuff, however in this instance it allows you to keep spark alive forever, to reload it without downtime.
```
sudo npm install pm2 -g
pm2 start app.js
```

8. Start the service
```
node server.js &
```

## Install Apache 2
Update the OS packkage sources in preperation for installing Apache 2
```
sudo apt update
```
Install Apache 2:
```
sudo apt install apache2
```
Enable the Apache proxy module and restart the apache daemon.
```
sudo a2enmod proxy proxy_http

sudo systemctl restart apache2
```

Confirm installation by checking the version number and status:
```
sudo apache2 -version
sudo systemctl status apache2
```
*At this stage you can also check the server is serving web pages on the web by pointing your web browser to the static IP Address you set up earlier.*

### Set up Virtual Hosts in apache

Create a spark-vhost.conf file in /etc/apache2/sites-available
```
sudo vi spark-vhost.conf
```
enter the following:
```
<VirtualHost 127.0.0.1:80 _default_:80>
  ServerAlias *
  DocumentRoot /opt/spark/api/0.1
  <Directory "/opt/spark/api/0.1">
    Options -Indexes +FollowSymLinks -MultiViews
    AllowOverride All
    Require all granted
  </Directory>
  ProxyPass / http://localhost:1337/
  ProxyPassReverse / http://localhost:1337/
</VirtualHost>
```
Enable and test this configuration:
```
sudo a2ensite spark-vhost.conf

sudo systemctl reload apache2

sudo apache2ctl configtest
```
Apache will now forward server traffic on port 80 to the node application on poer 1337. Test it by pointing your browser a the IP Address; you should get the {"msg":"Server is up!"}.

The only thing left to do is to update the DNS for the metspark.co.uk domain

Thats it you're done!