# rigi-numpad
An AngularJS directive for numeric input.

# Installation
Simply reference numpad.js in your app. **Please note that JQuery is required for this directive to function**

# Usage

JSFiddle: https://jsfiddle.net/RigidasSoftware/dxqoeccv/

Simple numpad with decimal input
```
<input id="testInput" ng-model="testVal"/>
<rigi-numpad binding="testVal" selector="#testInput"></rigi-numpad>
```

To disable decimals, simply set the allow-func attribute to false, like  so

```
<rigi-numpad binding="testVal" selector="#testInput" allow-func="false"></rigi-numpad>
```

To switch decimals to commas if the region requires it, 

```
<rigi-numpad binding="testVal" selector="#testInput" func-button=","></rigi-numpad>
```

**Please note that the value will be parsed back with a decimal regardless of the func-button. It is a purely visual setting.**

By default, your device will vibrate for 100ms on keypress if it supports it. You can turn this off by setting vibrate to false. 

```
<rigi-numpad binding="testVal" selector="#testInput" vibrate="false"></rigi-numpad>
```

You can also change the vibration length (in ms) by

```
<rigi-numpad binding="testVal" selector="#testInput" vibrate-length="200"></rigi-numpad>
```

That's it, enjoy!
