# microsite-seed

Based on [HTML5Boilerplate](http://html5boilerplate.com/), using [Gulp](http://gulpjs.com/) and [LESS](http://lesscss.org/)

Sometimes you need just quickly develop some static site, eg. some proof-of-concept for your boss, client or colleague. Or marketing microsite. Or simple site for your mum. You want to benefit from tools you're used to, but don't want to spend time with setting things up. Just start write code.

## Starting is simple:
- clone this repo
- run `npm install`
- run `gulp`
- write some code...
- check your work in browser on `//localhost:4242`
- enable [Live Reload](http://livereload.com/) in your browser for speeding up development

## How it works?

Simply. Gulp script will take care of compilation of your less files, running connect server and serving your files. Connect server will serve all files from `_public` folder. Also Live Reload server is started on port `35729`.
