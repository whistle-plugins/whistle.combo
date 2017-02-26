# whistle.combo

A combo plugin base on [tianmajs](https://github.com/tianmajs) for whistle.

## Usage

**1. install [whistle](https://github.com/avwo/whistle)(version of whistle must above or equal 0.12.3, check yourself by typing `w2 -V`) first, then start whistle, and set your config, visit [https://github.com/avwo/whistle](https://github.com/avwo/whistle) to get more info about whistle usage**

```
$ npm i -g whistle --registry=https://registry.npm.taobao.org
```

**2. install whistle.combo**

```
$ npm i -g whistle.combo --registry=https://registry.npm.taobao.org
```
    

**3. config combo protocal**

```
# [] means optional
# by default, delimiter is `??`, seperator is `,`
# url like http://i.cdn.com/??x.js,y.js,z.js will concat x.js, y.js and z.js togother
i.cdn.com combo://[delimiter:seperator@]absoluteRootDir


# sample 1
i.cdn.com combo:///Users/jiewei.ljw/work/i/test

# sample 2  delimiter:'c/=', seperator:','
g.cdn.com combo://c/=:,@/Users/jiewei.ljw/work/g/test
```

**4. enjoy yourself.**

## Issues
* [issue list](https://github.com/whistle-plugins/whistle.combo/issues)
* [open an issue](https://github.com/whistle-plugins/whistle.combo/issues/new)

## License
[MIT](https://github.com/whistle-plugins/whistle.combo/blob/master/LICENSE)
