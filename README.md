# That is my solution of a test I've cloned from https://bitbucket.org/dpine/datapine-senior-test

Here are the things I've changed in the original repository except writing some code.

- I've changed a version of a Highchart since I needed a maps support
- added a Redux.js package
- added backbone-filtered-collection plugin
- added a grunt task for compiling SASS

> The Sass task depends on the libsass which is much faster than ruby or node versions, but you need to install it yourself.
> It works perfectly on Linux and MacOS but I haven't tried it on Windows.

In order to run a project reproduce the steps mentioned below in an original manual.
You can also see it here

The more info you can read on an about page in the running version here 
 https://pblazh.github.io/datapine-senior-test/
 
> Javascript left intentionally uncompiled to see it from a browser dev tools.



-------
# The original task was 

> # datapine frontend test #
> 
> Once you have cloned this repo, then please follow the instructions below to continue with the test. If you have any problems or need any help, then please let us know.
> 
> ### This is the current datapine frontend test for those wishing to be part of the datapine team ###
> 
> ### What is required of me? ###
> Once you clone this repo and successfully loaded the test you will find a static page describing what is required of you. Essentially it boils down to:
> 
> * Creating a SPA application using something like backbone, backbone-layoutmanager, highcharts, requirejs, LESS/SASS
> * Create a menu that has a link to the home page and to a page describing your application and how to get it running
> * The home page should display a number of charts (4+ depending upon your chart size and layout)
> * You should be able to expand the charts to display a larger version (either lightbox-like thing or on a new page)
> * The data for the charts should be loaded from something like a JSON resource. Persistence isn't expected for the data.
> * You should be able to alter something simple about the charts, such as the chart type or the chart name
> 
> Your test will be judged on how the application looks and feels (bootstrap-looking applications are strongly discouraged), it meeting the above specification, the quality of code and how it has been executed. Anything additional you may like to add that shows off your strongest skills is always welcome, but not expected.
> 
> ### How do I get set up? ###
> * Install yeoman or simply just bower and grunt
> * Once they have been installed go to the directory and install the grunt-cli -> 'npm install -g grunt-cli' and then 'npm install'
> * Next run 'bower install' to install all the dependencies required
> * Once everything has been installed simply run 'grunt server' and begin your test
> * There is a testing section in the repo, but we do not expect you to write any tests for this particular test
> 
> ### Who do I talk to? ###
> 
> Once finished ideally you would push to your own repo, send us the link with any comments you would like to make and then wait a few days for our response (depends heavily upon how busy we currently are :))
