# gh-sec 
[![build status](https://badgen.net/travis/vladimyr/gh-sec/master)](https://travis-ci.com/vladimyr/gh-sec) [![install size](https://badgen.net/packagephobia/install/gh-sec)](https://packagephobia.now.sh/result?p=gh-sec) [![npm package version](https://badgen.net/npm/v/gh-sec)](https://npm.im/gh-sec) [![github license](https://badgen.net/github/license/vladimyr/gh-sec)](https://github.com/vladimyr/gh-sec/blob/master/LICENSE) [![js semistandard style](https://badgen.net/badge/code%20style/semistandard/pink)](https://github.com/Flet/semistandard)

>Github security alerts CLI :octocat:

## Run
```
$ npx gh-sec [command] [<owner/repo>] (--enable | --disable)
```

## Usage
```
$ npx gh-sec --help

gh-sec v1.0.0

Commands:
  alert, vulnerability-alerts         toggle vulnerability alerts
  autofix, automated-security-fixes   toggle automated security fixes

Usage:
  $ gh-sec vulnerability-alerts [<owner/repo>] (--enable | --disable)
  $ gh-sec automated-security-fixes [<owner/repo>] (--enable | --disable)

Options:
  -h, --help      Show help
  -v, --version   Show version number

Homepage:     https://github.com/vladimyr/gh-sec
Report issue: https://github.com/vladimyr/gh-sec/issues
```
