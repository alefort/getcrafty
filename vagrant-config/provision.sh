#!/usr/bin/env bash
 
 
# Determine if this machine has already been provisioned
# Basically, run everything after this command once, and only once
if [ -f "/var/vagrant_provision" ]; then 
    exit 0
fi
 
function say {
    printf "\n--------------------------------------------------------\n"
    printf "\t$1"
    printf "\n--------------------------------------------------------\n"
}
 
db='databasename'
 
# Install Apache
say "Installing Apache and setting it up."
    # Update aptitude library
    apt-get update >/dev/null 2>&1
    # Install apache2 
    apt-get install -y apache2 >/dev/null 2>&1
    # Remove /var/www path
    rm -rf /var/www
    # Symbolic link to /vagrant/site path
    ln -fs /vagrant /var/www
    # Enable mod_rewrite
    a2enmod rewrite
 
# Install mysql
say "Installing MySQL."
export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y mysql-server >/dev/null 2>&1
    sed -i -e 's/127.0.0.1/0.0.0.0/' /etc/mysql/my.cnf
    restart mysql
    mysql -u root mysql <<< "GRANT ALL ON *.* TO 'root'@'%'; FLUSH PRIVILEGES;"
 
 
say "Installing handy packages"
    apt-get install -y curl git-core ftp unzip imagemagick vim colordiff gettext graphviz >/dev/null 2>&1
 
say "Creating the database '$db'"
    mysql -u root -e "create database $db"
 
#
# There is a shared 'sql' directory that contained a .sql (database dump) file. 
# This directory is part of the project path, shared with vagrant under the /vagrant path.
# We are populating the msyql database with that file. In this example it's called databasename.sql
#
say "Populating Database"
    mysql -u root -D $db < /vagrant/sql/$db.sql
 
say "Installing PHP Modules"
    # Install php5, libapache2-mod-php5, php5-mysql curl php5-curl
    apt-get install -y php5 php5-cli php5-common php5-dev php5-imagick php5-imap php5-gd libapache2-mod-php5 php5-mysql php5-curl >/dev/null 2>&1
 
# Restart Apache
say "Restarting Apache"
    service apache2 restart
 
say "Installing WordPress Cli"
    curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
	chmod +x wp-cli.phar
	sudo mv wp-cli.phar /usr/local/bin/wp
 
 
# Let this script know not to run again
touch /var/vagrant_provision