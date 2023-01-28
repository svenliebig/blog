# Installing & Configuring Apache2 on Debian 11 (Bullseye)

# Installing

To install `apache2` in our Debian 11 bullseye, we only need one command for now:

```bash
$ > sudo apt update
$ > sudo apt install apache2
```

After that you will find a new directory in `/etc` which is called `apache2`.

Let’s have a look:

```bash
$ > ls -l /etc/apache
```

Will show you the following files and directories in your console:

```bash
# files
apache2.conf
ports.conf
envvars
magic

# directories
conf-available
conf-enabled
mods-available
mods-enabled
sites-available
sites-enabled
```

Several things to explain here, so:

`apache2.conf`: That’s the main file apache2 is loading and it includes references to other files in that directory to load. Let’s have a look what `apache2.conf` is loading:

```bash
$ > cat /etc/apache2/apache2.conf | grep Include
```

You will recognise that only the `*enabled` directories are included:

```bash
# Include module configuration:
IncludeOptional mods-enabled/*.load
IncludeOptional mods-enabled/*.conf
# Include list of ports to listen on
Include ports.conf
# Include of directories ignores editors' and dpkg's backup files,
# Include generic snippets of statements
IncludeOptional conf-enabled/*.conf
# Include the virtual host configurations:
IncludeOptional sites-enabled/*.conf
```

The directories: `mods-enabled`,`conf-enabled` & `sites-enabled` but not the `*-available` directories. That’s because `apache2` installed also commands to enable and disable sites, mods and configs. That means that sites, mods or configs are copies over from their `available` directory into the `enabled` directory.

- `a2enmod` enables a mod
- `a2dismod` disables a mod
- `a2ensite` enables a site
- `a2dissite` disables a site
- `a2enconfig` enables a config
- `a2disconfig` disables a config

That means, to add a sites, we want to add a file in the `sites-available` directory and enable it with the command `a2ensite`.

# Add Sites to Apache2

To add a page to `apache2`, you want to go to `/etc/apache2/sites-available` and create a new file. The name of the file should be something like `yourdomain.com.conf` and add the following content:

```bash
<VirtualHost *:80>
        ServerAdmin your@mail.com
        ServerName yourdomain.com
        ServerAlias www.yourdomain.com
        DocumentRoot /var/www/html
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog  ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

What are all these properties:

- `ServerAdmin` this is your email, it will be displayed within a default error message in the browser when your page has some issues like infinite redirects.
- `ServerName` this is your domain, keep in mind that the `domain` you set here, has to have it’s A-Record set to your server IP address, or this will not work.
- `ServerAlias` this defines another name which should lead to your website, so even people that still type `www` should be able to locate your website.
- `DocumentRoot` is the **directory** that the website will use for content. If this directory has an `index.html` file, it will display the `html` from that file.
- `ErrorLog` this is just the location where your error `logs` will be stored. `APACHE_LOG_DIR` is default set to `/var/log/apache2`. Note that the directories need to exist, if you specify a different directory here!
- `CustomLog` same functionality as `ErrorLog`, just for different type of logs.

After we save that file, we can enable it with the following command:

```bash
$ > a2ensite
```

After we enabled the site, we need to restart the `apache2` service. This can be achieved with:

```bash
$ > systemctl restart apache2
```

After that you should be able to see the content of `/var/www/html` on your domain name!

If you can not restart `apache2`, something maybe has gone wrong. You can check the error with:

```bash
$> systemctl status apache2
```

to figure out what is going on!

We configured all of these things with the `root` user, which is fine for the moment but maybe not ideally for the future.

I hope these information will help someone setting up their `apache2` on a server! Thanks for reading.
