tekled
======

Exam quiz for subject TIØ4258 Teknologiledelse @ [NTNU](http://www.ntnu.no/).

Built using old exams, [a small python-script](https://github.com/tomfa/exam-interpreter) and with a tiny dash of [Bootstrap](http://getbootstrap.com).

Can be seen live at [tekled.meteor.com](http://tekled.meteor.com)

## Installation
1. Install [Meteor](https://www.meteor.com/) 
2. Get all the files and start the server:
```bash
$ git clone git@github.com:andybb/tekled.git
$ cd tekled
$ meteor
```

## How do I add new exams?
Take a look at [this pull request](https://github.com/tomfa/tekled/pull/1/files).

1. Get the questions and alternatives into data.js. ([This](https://github.com/tomfa/exam-interpreter) might help you parse questions from text to JSON format)
2. Add images if you have any to img/

The rest should work by itself. 