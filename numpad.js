angular.module('rigi-numpad', []).directive('rigiNumpad', function () {
    return {
        restrict: 'E',
        scope: {
            ngModel: '=binding'
        },
        link: function link(scope, element, attrs) {
            element = $(element);
            var overlay = element.find('#overlayDiv');
            element.hide();

            attrs.funcButton = attrs.funcButton || '.';
            attrs.allowFunc = attrs.allowFunc || 'true';
            attrs.vibrate = attrs.vibrate || 'true';
            attrs.vibrateLength = parseInt(attrs.vibrateLength) || 100;
            attrs.selector = attrs.selector || '[ng-model]="' + attrs.element + '"]';
            attrs.maxFuncLen = attrs.maxFuncLen || 10;

            overlay.on('mousedown', function (event) {
                element.hide();
            });

            var selectedElement = element.parent().find(attrs.selector);

            if(!selectedElement) {
                throw 'Could not find element to bind numpad to!';
            }

            selectedElement.on('click', function (event) {
                event.preventDefault();
                $('input, textarea').blur();
                scope.val = String(scope.ngModel == null ? '' : scope.ngModel).replace('.', scope.getFuncButton());
                $('body').on('touchmove', function (event) {
                    event.preventDefault();
                });
                element.show();
                overlay.show();
                scope.$apply();
            });

            selectedElement.on('mousedown', function(event) {
                event.preventDefault();
                selectedElement.click();
            });            

            scope.cancel = function () {
                element.hide();
                $('body').off('touchmove');
            };

            scope.canSave = function () {
                return !(!scope.val || scope.val.length === 0);
            };

            scope.canShowFunc = function () {
                return attrs.allowFunc == 'true';
            };

            scope.canFunc = function () {
                return !scope.val || scope.val.indexOf(scope.getFuncButton()) === -1;
            };

            scope.canInput = function () {
                var ind = scope.val ? scope.val.indexOf(scope.getFuncButton()) : -1;
                if (ind === -1) {
                    return true;
                } else {
                    return scope.val.substring(++ind).length < attrs.maxFuncLen;
                }
            };

            scope.getFuncButton = function () {
                return attrs.funcButton;
            };

            scope.save = function () {
                if (!scope.canSave()) {
                    return;
                }
                if (scope.val.indexOf(scope.getFuncButton()) === scope.val.length - 1) {
                    scope.val = scope.val.replace(scope.getFuncButton(), '');
                }
                var finalVal = parseFloat(scope.val.replace(scope.getFuncButton(), '.'));
                scope.ngModel = finalVal;
                element.hide();
                $('body').off('touchmove');
            };

            scope.apply = function (val) {
                if (val == scope.getFuncButton() && !scope.canFunc()) {
                    return;
                }
                var curVal = scope.val;
                if (val === -1) {
                    curVal = curVal.split('');
                    curVal.splice(curVal.length - 1);
                    curVal = curVal.join('');
                } else {
                    if (!scope.canInput()) {
                        return;
                    }

                    if (val === scope.getFuncButton()) {
                        if (curVal.indexOf(scope.getFuncButton()) > -1) {
                            return;
                        } else if (!curVal) {
                            curVal = '0' + scope.getFuncButton();
                        } else {
                            curVal += val;
                        }
                    } else {
                        curVal += val;
                    }
                }
                scope.val = curVal;
                attrs.vibrate == 'true' && window.navigator && window.navigator.vibrate && window.navigator.vibrate(attrs.vibrateLength);
            };
        },
        template: '<style>\n.slideUp{\n\tanimation-name: slideUp;\n\t-webkit-animation-name: slideUp;\t\n\tanimation-duration: 0.25s;\t\n\t-webkit-animation-duration: 0.25s;\n\tanimation-timing-function: ease;\t\n\t-webkit-animation-timing-function: ease;\n\tvisibility: visible !important;\t\t\t\n}\n@keyframes slideUp {\n\t0% {\n\t\ttransform: translateY(100%);\n\t}\t\n}\n@-webkit-keyframes slideUp {\n\t0% {\n\t\t-webkit-transform: translateY(100%);\n    }\n}\ntd {\n  -webkit-touch-callout: none; /* iOS Safari */\n    -webkit-user-select: none; /* Chrome/Safari/Opera */\n     -khtml-user-select: none; /* Konqueror */\n       -moz-user-select: none; /* Firefox */\n        -ms-user-select: none; /* Internet Explorer/Edge */\n            user-select: none; /* Non-prefixed version, currently\n                                  not supported by any browser */\n}\ntable.numTable {\n    background-color: white;\n    height:40vh;\n    position:fixed;\n    bottom:0;\n    width:100vw;\n    max-width:100vw;\n    left:0;\n    z-index:99;\n    border-top:0.25vh solid dodgerblue;\n    border-collapse: collapse;\n    color: #5a5a5a;\n}\ntr {\n    height: 10vh;\n}\ntr.short {\n    height: 7.5vh;\n}\ntr.tall {\n    height: 12vh;\n    font-size: larger;\n}\ntr.grouped > td {\n    border-bottom:0.25vh solid gainsboro;\n}\ntd {\n    font-size: 1.65em;\n    width:30vw;\n    font-family: \'Open Sans\', sans-serif;\n}\n.side-val-left {\n    padding-left:15%;\n    text-align:left;\n}\n.side-val-right {\n    padding-right:15%;\n    text-align:right;\n}\ntr.top-val > td {\n    margin-top:5vh;\n}\ntd > span {\n    cursor: hand;\n}\ntd a {\n    width: 20vw;\n    font-family: \'Open Sans\', sans-serif;\n    font-size: 0.7em;\n}\na.numSave, a.numCancel, a.numSave:hover, a.numCancel:hover, a.numSave:visited, a.numCancel:visited {\n    color: dodgerblue;\n    text-decoration: none;    \n    cursor: hand;\n    vertical-align:top;\n    width:35%;\n    float:right;\n}\na.numCancel, a.numCancel:hover, a.numCancel:visited {\n    color: #b72f2f;\n    float:left;\n}\na.disabled, span.disabled, td.disabled {\n    opacity: 0.3;\n    cursor: default;\n}\n\nspan.bkSpace {\n    margin-left:10vw;\n}\n\n@media screen and (min-width: 400px) {\n    span.bkSpace {\n        margin-left: 13vw;\n    }\n}\n\n@media screen and (min-width: 720px) {\n    table.numTable {\n        width: 20vw;\n        left: 40vw;\n        border-left: 0.25vh solid dodgerblue;\n        border-right: 0.25vh solid dodgerblue;\n    }\n\n    span.bkSpace {\n        margin-left: 2vw;\n    }\n}\n</style>\n<div style="display:none;z-index:98;background-color:black;opacity:0.7;height:100vh;width:100vw;position:fixed;top:0;left:0;" id="overlayDiv"></div>\n<table class="numTable slideUp">\n    <tbody style="text-align:center;">\n        <tr class="grouped tall">\n            <td class="side-val-left" colspan="2" style="word-break: break-all;"><span>{{val}}</span></td>\n            <td class="side-val-right" ng-click="apply(-1)">\n                <span class="bkSpace" ng-class="{\'disabled\' : !canSave()}">\n                    <svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 25 25" style="fill:dodgerblue;"><path d="M19 21h-10c-1.436 0-3.145-.88-3.977-2.046l-2.619-3.667-1.188-1.661c-.246-.344-.249-.894-.008-1.241l1.204-1.686 2.608-3.653c.835-1.167 2.546-2.046 3.98-2.046h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3zm-15.771-8.001l.806 1.125 2.618 3.667c.451.633 1.57 1.209 2.348 1.209h10c.552 0 1-.45 1-1.001v-9.999c0-.551-.448-1-1-1h-10c-.776 0-1.897.576-2.351 1.209l-2.608 3.652-.813 1.138zM13.707 13l2.646-2.646c.194-.194.194-.512 0-.707-.195-.194-.513-.194-.707 0l-2.646 2.646-2.646-2.646c-.195-.194-.513-.194-.707 0-.195.195-.195.513 0 .707l2.646 2.646-2.646 2.646c-.195.195-.195.513 0 .707.097.098.225.147.353.147s.256-.049.354-.146l2.646-2.647 2.646 2.646c.098.098.226.147.354.147s.256-.049.354-.146c.194-.194.194-.512 0-.707l-2.647-2.647z"/></svg>\n                </span>    \n            </td>\n        </tr>\n        <tr class="top-val">\n            <td class="side-val-left" ng-click="apply(\'1\')" ng-class="{\'disabled\': !canInput()}"><span>1</span></td>\n            <td ng-click="apply(\'2\')" ng-class="{\'disabled\': !canInput()}"><span>2</span></td>\n            <td class="side-val-right" ng-click="apply(\'3\')" ng-class="{\'disabled\': !canInput()}"><span>3</span></td>\n        </tr>\n        <tr>\n            <td class="side-val-left" ng-click="apply(\'4\')" ng-class="{\'disabled\': !canInput()}"><span>4</span></td>\n            <td ng-click="apply(\'5\')" ng-class="{\'disabled\': !canInput()}"><span>5</span></td>\n            <td class="side-val-right" ng-click="apply(\'6\')" ng-class="{\'disabled\': !canInput()}"><span>6</span></td>\n        </tr>\n        <tr>\n            <td class="side-val-left" ng-click="apply(\'7\')" ng-class="{\'disabled\': !canInput()}"><span>7</span></td>\n            <td ng-click="apply(\'8\')" ng-class="{\'disabled\': !canInput()}"><span>8</span></td>\n            <td class="side-val-right" ng-click="apply(\'9\')" ng-class="{\'disabled\': !canInput()}"><span>9</span></td>\n        </tr>\n        <tr>\n            <td class="side-val-left" ng-click="canShowFunc() && canFunc() && apply(getFuncButton())">\n                <span ng-class="{\'disabled\': !canFunc()}" ng-hide="!canShowFunc()">{{getFuncButton()}}</span>\n            </td>\n            <td ng-click="apply(\'0\')" ng-class="{\'disabled\': !canInput()}"><span>0</span></td>\n            <td></td>\n        </tr>\n        <tr class="short">\n            <td colspan="3">\n                <a class="numCancel side-val-left" ng-click="cancel()">CANCEL</a>\n                <a class="numSave side-val-right" ng-click="save()" ng-class="{\'disabled\' : !canSave()}">SET</a>\n            </td>\n        </tr>\n    </tbody>\n</table>'
    };
});
