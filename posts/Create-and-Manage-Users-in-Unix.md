# Create and Manage Users in Unix

All users are saved in the `/etc/passwd` file. Remember, everything represented on this OS must be a file.

# Adding a new User

All actions here are done with the `root` user.

In the `sbin` folder there is a command called `adduser`. There is also a command called `useradd`... which is confusing enough!

You’ll will probably want to use the `adduser` command, since the `useradd` command does not create the `home` directory, `password` and some other stuff automatically. So the `adduser` is what we are going to do!

Execute the following:

```bash
$ > adduser user
```

Will prompt you with questions about `password` and some other things!

After that is done, you are able to login with that `user` into your server!

# Allowing User’s to use `sudo`

To add a user to circle of `sudo` permitted beings, you have to edit the `sudoers` file.

The recommended way of doing this is:

```bash
sudo visudo
```

You should have some basic knowledge how to work with VI. But if you stuck now in the editor, try to press `ESC` several time, and then type `:q!` this quits the editor without saving. Now you have time to google how to use VI. :)

You can choose if you just want to grant a user the ability to get `sudo` powers for everything, or just specific commands.

Granting them `sudo` powers for `apt` for example, would be like this:

```bash
# User privilege specification
root    ALL=(ALL:ALL) ALL
user    ALL=/bin/apt

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL
```

`user` is our created user in this scenario. If we would add this user like that:

```bash
# User privilege specification
root    ALL=(ALL:ALL) ALL
user    ALL=ALL

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL
```

the user would now have all the powers.

Resources: [https://kifarunix.com/run-only-specific-commands-with-sudo-in-linux/](https://kifarunix.com/run-only-specific-commands-with-sudo-in-linux/)

# User’s & Group’s

Now we have created a new user, but we want user to be able to do some things, not as many as root is able to do, but at least he should be able to do everything what is related to web hosting, for example.

There are two ways in doing that, we can assign all this permissions manually to this user, or we can create a group that has this permissions and assign the user to that group.

## Adding a group with `groupadd`

First we want to create a new group, I’ll call it `webserver-access`. I need to login as `root` for that again:

```bash
$ > su -
$ > groupadd webserver-access
```

We created our group! You can check the existence of that group in `/etc/group`, it should appear in the bottom of the file:

```bash
$ > cat /etc/group
...
webserver-access:x:1001
```

## Granting a group access to a folder (`chgrp`, `chmod`)

Now I want to grant this group access to the directory, that I use for serving my HTML over `apache2`.

```bash
$ > chgrp webserver-access /var/www
$ > chmod g+rwx /var/www
$ > ls -la /var
...
drwxr-xr-x  6 root webserver-access 4096 Aug 13 08:28 www
```

What did we do here:

- `chgrp webserver-access /var/www` set the group `webserver-access` as owner of the directory `/var/www`
- `chmod g+rwx /var/www` grants the group (`g+`) the rights to `r`ead, `w`rite and e`x`ecute (`rwx`)

The command `ls -la /var` will show us that the `webserver-access` group has the the `drwxr-xr-x` rights for that directory. Checkout [this](https://mason.gmu.edu/~montecin/UNIXpermiss.htm) for a more in deep unix rights explanation.

## Adding our user to a group

Now we want to add our user to the group:

```bash
$ > usermod -G webserver-access user
$ > cat /etc/group
...
webserver-access:x:1001:user
```

As you can verify, your `user` should be added to the group in the `/etc/group` file. You can login with that user and try to create a folder inside `/var/www`. You can also double check if your user is really in the desired group with the `groups` command.

## Other group related command

- The command `gpasswd -d <username> <groupname>` removes user from specific groups.
- The command `groupdel` will delete a group.

## Adding specific `sudo` execute permissions to a group

We are able now to create everything we want in the `/var/www` directory now. But we also need to empower our user group to change the `apache2` configuration and to restart the server.

Thanks for reading! I hope all your users are not ready and setup!
