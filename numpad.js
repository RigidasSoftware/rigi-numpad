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

            overlay.on('mousedown', function (event) {
                element.hide();
            });

            $(attrs.selector).on('mousedown', function (event) {
                event.preventDefault();
                scope.val = String(scope.ngModel).replace('.', scope.getFuncButton());
                element.show();
                overlay.show();
                scope.$apply();
            });

            scope.cancel = function () {
                element.hide();
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
                } else if (val === scope.getFuncButton()) {
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
                scope.val = curVal;
                attrs.vibrate == 'true' && window.navigator && window.navigator.vibrate && window.navigator.vibrate(attrs.vibrateLength);
            };
        },
        template: '<style>\n.slideUp{\n\tanimation-name: slideUp;\n\t-webkit-animation-name: slideUp;\t\n\tanimation-duration: 0.25s;\t\n\t-webkit-animation-duration: 0.25s;\n\tanimation-timing-function: ease;\t\n\t-webkit-animation-timing-function: ease;\n\tvisibility: visible !important;\t\t\t\n}\n@keyframes slideUp {\n\t0% {\n\t\ttransform: translateY(100%);\n\t}\t\n}\n@-webkit-keyframes slideUp {\n\t0% {\n\t\t-webkit-transform: translateY(100%);\n    }\n}\ntd {\n  -webkit-touch-callout: none; /* iOS Safari */\n    -webkit-user-select: none; /* Chrome/Safari/Opera */\n     -khtml-user-select: none; /* Konqueror */\n       -moz-user-select: none; /* Firefox */\n        -ms-user-select: none; /* Internet Explorer/Edge */\n            user-select: none; /* Non-prefixed version, currently\n                                  not supported by any browser */\n}\ntable.numTable {\n    background-color: white;\n    height:40vh;\n    position:fixed;\n    bottom:0;\n    width:100%;\n    left:0;\n    z-index:99;\n    border-top:0.25vh solid dodgerblue;\n    border-collapse: collapse;\n}\ndiv.btnDiv {\n    margin-right:10vw;\n    vertical-align:middle;\n}\ntr {\n    height: 10vh;\n}\ntr.short {\n    height: 8vh;\n}\ntr.grouped > td {\n    border-bottom:0.25vh solid gainsboro;\n}\ntd {\n    font-size: 1.65em;\n    width:30%;\n    font-family: \'Open Sans\', sans-serif;\n}\ntd.side-val-left {\n    padding-left:10%;\n}\ntd.side-val-right {\n    padding-right:10%;\n}\ntr.top-val > td {\n    padding-top:5vh;\n}\ntd > span {\n    cursor: hand;\n}\ntd a {\n    width: 20vw;\n    font-family: \'Open Sans\', sans-serif;\n    font-size: 0.7em;\n}\na.numSave, a.numCancel, a.numSave:hover, a.numCancel:hover, a.numSave:visited, a.numCancel:visited {\n    color: dodgerblue;\n    text-decoration: none;    \n    cursor: hand;\n    vertical-align:top;\n}\na.numCancel, a.numCancel:hover, a.numCancel:visited {\n    color: #b72f2f;\n}\na.numSave {\n    margin-left: 7.5vw;\n}\na.disabled, span.disabled {\n    opacity: 0.3;\n    cursor: default;\n}\n@media screen and (min-width: 720px) {\n    table.numTable {\n        width: 40vw;\n        left: 30vw;\n        border-left: 0.25vh solid dodgerblue;\n        border-right: 0.25vh solid dodgerblue;\n    }\n    div.btnDiv {\n        margin-right: 5vw;\n    }\n    a.numSave {\n        margin-left: 2.5vw;\n    }\n}\n</style>\n<div style="display:none;z-index:98;background-color:black;opacity:0.7;height:100vh;width:100vw;position:fixed;top:0;left:0;" id="overlayDiv"></div>\n<table class="numTable slideUp">\n    <tbody style="text-align:center;">\n        <tr class="grouped short">\n            <td class="side-val-left" colspan="2"><span>{{val}}</span></td>\n            <td class="side-val-right" ng-click="apply(-1)">\n                <span ng-class="{\'disabled\' : !canSave()}">\n                    <svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:dodgerblue;"><path d="M19 21h-10c-1.436 0-3.145-.88-3.977-2.046l-2.619-3.667-1.188-1.661c-.246-.344-.249-.894-.008-1.241l1.204-1.686 2.608-3.653c.835-1.167 2.546-2.046 3.98-2.046h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3zm-15.771-8.001l.806 1.125 2.618 3.667c.451.633 1.57 1.209 2.348 1.209h10c.552 0 1-.45 1-1.001v-9.999c0-.551-.448-1-1-1h-10c-.776 0-1.897.576-2.351 1.209l-2.608 3.652-.813 1.138zM13.707 13l2.646-2.646c.194-.194.194-.512 0-.707-.195-.194-.513-.194-.707 0l-2.646 2.646-2.646-2.646c-.195-.194-.513-.194-.707 0-.195.195-.195.513 0 .707l2.646 2.646-2.646 2.646c-.195.195-.195.513 0 .707.097.098.225.147.353.147s.256-.049.354-.146l2.646-2.647 2.646 2.646c.098.098.226.147.354.147s.256-.049.354-.146c.194-.194.194-.512 0-.707l-2.647-2.647z"/></svg>\n                </span>    \n            </td>\n        </tr>\n        <tr class="top-val">\n            <td class="side-val-left" ng-click="apply(\'1\')"><span>1</span></td>\n            <td ng-click="apply(\'2\')"><span>2</span></td>\n            <td class="side-val-right" ng-click="apply(\'3\')"><span>3</span></td>\n        </tr>\n        <tr>\n            <td class="side-val-left" ng-click="apply(\'4\')"><span>4</span></td>\n            <td ng-click="apply(\'5\')"><span>5</span></td>\n            <td class="side-val-right" ng-click="apply(\'6\')"><span>6</span></td>\n        </tr>\n        <tr>\n            <td class="side-val-left" ng-click="apply(\'7\')"><span>7</span></td>\n            <td ng-click="apply(\'8\')"><span>8</span></td>\n            <td class="side-val-right" ng-click="apply(\'9\')"><span>9</span></td>\n        </tr>\n        <tr>\n            <td class="side-val-left" ng-click="apply(getFuncButton())" ng-hide="!canShowFunc()">\n                <span ng-class="{\'disabled\': !canFunc()}">{{getFuncButton()}}</span>\n            </td>\n            <td ng-click="apply(\'0\')"><span>0</span></td>\n            <td></td>\n        </tr>\n        <tr class="short">\n            <td colspan="3">\n                <div class="pull-right btnDiv">\n                    <a class="numCancel" ng-click="cancel()">CANCEL</a>\n                    <a class="numSave" ng-click="save()" ng-class="{\'disabled\' : !canSave()}">SET</a>\n                </div>\n            </td>\n        </tr>\n    </tbody>\n</table>'
    };
});
