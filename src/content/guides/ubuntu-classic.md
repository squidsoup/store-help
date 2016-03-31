---
title: Ubuntu Classic
description: Publish your app to Ubuntu Classic
layout: index.html
---

# Why choose Ubuntu
Ubuntu is used by tens of millions of people every day. Reaching that audience with your app could not be simpler.

Building and publishing is straightforward and quick. With a few short commands, you’ll bundle your app and dependencies in a snap, available for anyone to access on the Ubuntu Store.

It doesn’t matter what language you’re using or how specialised your build process is. Ubuntu favours developer flexibility.

# Setting up your development environment
You will need an Ubuntu 16.04 environment to build and test your application in before publishing to the Ubuntu Store. If you’re already running Ubuntu, great. You can skip to the next section.

Following these instructions will set up Ubuntu 16.04 in a VirtualBox virtual machine, but note that the steps will largely be the same in Parallels or VMWare.

First, download the [Ubuntu 16.04 image](http://cdimage.ubuntu.com/ubuntu/daily-live/current/xenial-desktop-amd64.iso). While you’re waiting for that to finish, [install VirtualBox](https://www.virtualbox.org/wiki/Downloads).

Launch VirtualBox. It will ask you to create a new virtual machine:

1. Call it “Ubuntu” and press continue.
1. The default memory size of 768 MB will be sufficient - press continue.
1. Leave the option to “create a virtual hard disk now” selected and press continue.
1. Leave the default hard disk type selected and press continue.
1. Leave “dynamically allocated” storage selected and press continue.
1. Change the file size to 16 GB and press create.

You will be brought back to the main VirtualBox screen. Select the “Ubuntu” virtual machine you just created and press start. It will ask you for a “virtual optical disk file” to boot. Browse to and select the Ubuntu 16.04 image you downloaded.

The virtual machine will boot and begin installing Ubuntu. Navigate through the language, keyboard, and location choices, then select the option for using the entire disk for Ubuntu.

Once installation is complete, the virtual machine will reboot into Ubuntu.

# Building your app
Open the terminal application by clicking the top-left menu button and searching for it, or by pressing <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>t</kbd>.

You’ll use a tool called Snapcraft to take the output of your existing build system and bundle metadata around it. This metadata will make your applications discoverable in Ubuntu Store searches and ensure the right binary is called when a user runs your installed application.

First, install Snapcraft:

    $ sudo apt-get update
    $ sudo apt-get install snapcraft

Within your project directory, run `snapcraft init` to create a basic snapcraft.yaml file. Open it and set the name, version, summary, and description fields.

Now you’ll define how your application is built. At the bottom of the snapcraft.yaml file, add the following, replacing your_app_name with the name of your application:

```yaml
    parts:
       your_app_name:
            plugin: make
            source: .
```

In this example we’ve used make to build the application, specifying that in the plugin field. However, this is not the only way. There are many different plugins for build systems in Snapcraft, and you can see a full list by running `snapcraft list-plugins`.

The source field tells Snapcraft where to look for your application’s source code, relative to the current working directory.

With the initial metadata written, you should try to build your application by running `snapcraft`. If the build fails, check to see if external libraries or headers need to be installed as part of your build process. You can tell Snapcraft to include these in the build by using the build-packages and stage-packages fields.

build-packages is a list of Ubuntu packages that need to be installed for the build, but are not included in the final application. An example of this would be GCC, the C compiler.

stage-packages is a list of Ubuntu packages that are installed for the build and included in the final application. You can look up the correct names for Ubuntu packages at [packages.ubuntu.com](http://packages.ubuntu.com/).

Adding these fields beneath the source field will look something like this:

```yaml
parts:
  your_app_name:
    plugin: make
    source: .
    build-packages:
      - gcc
      - libc6-dev
    stage-packages:
      - libcurl4-openssl-dev
      - libgcrypt20-dev
```

Running `snapcraft` again to build your application should succeed. You can run `unsquashfs -l *.snap` to see a listing of the files included in the resulting snap file.

By default, all files created by the build are included. To filter this down, you can add some additional rules in the snapcraft.yaml.

Your snap has all the files needed, but you’ll need to specify the command used to start your app. To do this, add the following apps section to your snapcraft.yaml file:

    apps:
        your_app_name:
            command: your_app --sample-argument

Run `snapcraft` again to pick up this change. You can now install and run your snap to make sure it works as expected.

# Testing it out
To see how your app will behave once downloaded from the Ubuntu Store, you’ll need to install some additional software. Open a terminal and run the following commands:

    $ sudo apt-get install ubuntu-snappy
    $ sudo snappy install ubuntu-core

You will now be able to install the snap file you created earlier:

    $ sudo snappy install *.snap

At the time of writing, integration with the graphical application launcher has not been implemented. Instead, you can start your app from the terminal, replacing your_app_name with the value you chose in the snapcraft.yaml file above:

    $ SNAP=/snaps/your_app_name.sideload/current /snaps/your_app_name.sideload/current/command-your_app_name.wrapper

# Publishing
Once you are happy with how your application works, you can send it to the Ubuntu Store for publishing.

If you do not already have an account with Ubuntu One, you’ll need to [create one](https://login.ubuntu.com/) and click the validation link in your email before continuing.

Go to [https://myapps.developer.ubuntu.com/](https://myapps.developer.ubuntu.com/) and click the “New package” button.

You’ll first need to set a “Developer namespace.” This allows more than one developer to use the same name for their application (e.g. calculator.alice and calculator.bob). You also need to specify what country you will be offering your applications from.

Once you’ve updated your account with those details, you will be able to continue to the next page where you can upload your app. Click the box next to “Your package” and select the snap file you created earlier. Select an appropriate department, application license, and price, then click “Submit to the Store.”

# Taking the user's perspective

You can now experience how people will find and use your app. Click on the top-left menu button and type Software. Click on the Software app. If you type the name of your application in the search box, it should appear. Congratulations, your app is visible to all of Ubuntu.
