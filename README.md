Bingo!
======

A very very basic bingo-board-page, inspired by [Apple Keynote Bingo](http://applekeynotebingo.appspot.com).


How?
----

### Install

Download this repository, and put it on a server somewhere. It needs to be on a server and not just local files to do the requests for the bingo cards.

Don't have a server? If you're on a Mac you should have PHP available, so you can run this in Terminal:

~~~bash
$ cd /path/to/bingo
$ php -S localhost:8080
~~~

Leave that window open and go to `localhost:8080` in your browser for bingo fun.


### Make Cards

"Cards" are plain-text files in the `cards/` directory. Each line will become a possible tile on the page (excluding blank lines and hash-commented lines). Ideally you want to have more than 24 to get random cards. If you have less, there will be "blank" tiles...


### Choose Cards

The default card used is in the `index.html` file – search for `default-card="..."`. If you have multiple cards, open the page with the querystring `?card={nameofcard}` and a different one will be loaded.


Licence
-------

[WTFPL](http://www.wtfpl.net)
