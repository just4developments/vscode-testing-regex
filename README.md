# Testing REGEX extension for visual code

This is extension for visual code which help you easy to test regex.

## Main Features

1. API Test: like `test method` in javascript. It will return PASS or FAIL
2. API Match: like `match method` in javascript. It return the groups which is matched in your regex
3. API Exec: like `exec method` in javascript. It return the matchers which include groups. It's a list of match

You can change `regex.default` in user setting to use hot key (alt+r) to execute 1 in 3 the above methods. Default is `match`

>Tip: Type `regex.` to get snippets for regex

> Tip: The first line is your regex, then is the content which need to match.

> Tip: You can use regex a part of content by select content you want use regex. `Note`: The first line in your selection is your regex, and the next is content

### Some snippets

1. regex.fomular : Generate regex pattern

### Quick command

* `Alt + R` : Execute default command which is declared in user setting
* `Ctrl + Alt + R` : Execute default command then open new tab
* `Ctrl + Shift + P` then type `regex`: Show regex command

## Example 

```
/\d/g
thanh 28 vn
bill 40 us
```

## Install

Press F1, type `ext install testing-regex`

## Extension Settings

This extension contributes the following settings:

* `regex.default`: must be in `test`, `exec`, `match`. Method used to test regex when you use hot key (alt + r). Default is `match`.

## Release Notes

### 0.0.2

* Add new function open new tab after done

### 0.0.1

Initial release of Testing REGEX

-----------------------------------------------------------------------------------------------------------

**Enjoy!**