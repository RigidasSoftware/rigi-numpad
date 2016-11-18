angular.module('rigi-numpad', []).directive('rigiNumpad', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs, controller, transcludeFn) {
            $(element).hide();
            $('#overlayDiv').hide();

            var attrElement = '#' + attrs.element;  
            attrs.funcButton = attrs.funcButton || '.';
            attrs.allowFunc = attrs.allowFunc || 'true';
            attrs.vibrate = attrs.vibrate || 'true';

            $('#overlayDiv').on('mousedown', function(event) {
                $(element).hide();
                $('#overlayDiv').hide();
            });                   

            $(attrElement).on('mousedown', function(event) {
                event.preventDefault();
                var initVal = $(attrElement).val();
                scope.val = initVal.replace('.', scope.getFuncButton());  
                scope.$apply();
                $('html, body').animate({
                    scrollTop: $(attrElement).offset().top
                }, 500);
                $('#overlayDiv').show();
                $(element).show();
            }); 

            scope.cancel = function() {
                $(element).hide();
                $('#overlayDiv').hide();
            };  

            scope.canSave = function() {
                return !(!scope.val || scope.val.length === 0);
            };

            scope.canShowFunc = function() {
                return attrs.allowFunc == 'true';
            };

            scope.canFunc = function() {
                return !scope.val || scope.val.indexOf(scope.getFuncButton()) === -1;
            };

            scope.getFuncButton = function() {
                return attrs.funcButton;
            };

            scope.save = function() {
                if(!scope.canSave()) {
                    return;
                }
                if(scope.val.indexOf(scope.getFuncButton()) === scope.val.length - 1) {
                    scope.val = scope.val.replace(scope.getFuncButton(), '');
                }
                $(attrElement).val(parseFloat(scope.val.replace(scope.getFuncButton(), '.')));
                $('#overlayDiv').hide();
                $(element).hide();
            };

            scope.apply = function(val) {
                if(val == scope.getFuncButton() && !scope.canFunc()) {
                    return;
                } 
                var curVal = scope.val;
                if(val === -1) {
                    curVal = curVal.split('');
                    curVal.splice(curVal.length -1);
                    curVal = curVal.join('');
                } else if(val === scope.getFuncButton()) {
                    if(curVal.indexOf(scope.getFuncButton()) > -1) {
                        return;
                    } else if(!curVal) {
                        curVal = '0' + scope.getFuncButton();
                    } else {
                        curVal += val;
                    }
                } else {
                    curVal += val;
                }
                scope.val = curVal;
                attrs.vibrate == 'true' && window.navigator && window.navigator.vibrate && window.navigator.vibrate(150);
            };      
        },
        template: `<style>
.slideUp{
	animation-name: slideUp;
	-webkit-animation-name: slideUp;	

	animation-duration: 0.25s;	
	-webkit-animation-duration: 0.25s;

	animation-timing-function: ease;	
	-webkit-animation-timing-function: ease;

	visibility: visible !important;			
}

@keyframes slideUp {
	0% {
		transform: translateY(100%);
	}	
}

@-webkit-keyframes slideUp {
	0% {
		-webkit-transform: translateY(100%);
    }
}

td {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
     -khtml-user-select: none; /* Konqueror */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  not supported by any browser */
}

table.numTable {
    background-color: white;
    height:40vh;
    position:absolute;
    bottom:0;
    width:100%;
    left:0;
    z-index:99;
    border-top:0.25vh solid dodgerblue;
}

div.btnDiv {
    margin-right:10vw;
    vertical-align:middle;
}

tr {
    height:2.5em;
}

td {
    font-size: 1.65em;
    width:33.3%;
    font-family: 'Open Sans', serif;
}

td > span {
    cursor: hand;
}

td a {
    width: 20vw;
    font-family: 'Open Sans';
    font-size: 0.7em;
}

a.numSave, a.numCancel, a.numSave:hover, a.numCancel:hover, a.numSave:visited, a.numCancel:visited {
    color: dodgerblue;
    text-decoration: none;    
    cursor: hand;
}

a.numCancel, a.numCancel:hover, a.numCancel:visited {
    color: #b72f2f;
}

a.numSave {
    margin-left: 7.5vw;
}

a.disabled, span.disabled {
    opacity: 0.3;
    cursor: default;
}

@media screen and (min-width: 720px) {
    table.numTable {
        width: 40vw;
        left: 30vw;
        border-left: 0.25vh solid dodgerblue;
        border-right: 0.25vh solid dodgerblue;
    }

    div.btnDiv {
        margin-right: 5vw;
    }

    a.numSave {
        margin-left: 2.5vw;
    }
}
</style>
<div style="display:none;z-index:98;background-color:black;opacity:0.7;height:100vh;width:100vw;position:absolute;top:0;left:0;" id="overlayDiv"></div>
<table class="numTable slideUp">
    <tbody style="text-align:center;">
        <tr class="grouped">
            <td colspan="2" style="text-align:left;"><span style="margin-left:2vw;">{{val}}</span></td>
            <td>
                <span ng-click="apply(-1)" ng-class="{'disabled' : !canSave()}">
                    <svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:dodgerblue;"><path d="M19 21h-10c-1.436 0-3.145-.88-3.977-2.046l-2.619-3.667-1.188-1.661c-.246-.344-.249-.894-.008-1.241l1.204-1.686 2.608-3.653c.835-1.167 2.546-2.046 3.98-2.046h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3zm-15.771-8.001l.806 1.125 2.618 3.667c.451.633 1.57 1.209 2.348 1.209h10c.552 0 1-.45 1-1.001v-9.999c0-.551-.448-1-1-1h-10c-.776 0-1.897.576-2.351 1.209l-2.608 3.652-.813 1.138zM13.707 13l2.646-2.646c.194-.194.194-.512 0-.707-.195-.194-.513-.194-.707 0l-2.646 2.646-2.646-2.646c-.195-.194-.513-.194-.707 0-.195.195-.195.513 0 .707l2.646 2.646-2.646 2.646c-.195.195-.195.513 0 .707.097.098.225.147.353.147s.256-.049.354-.146l2.646-2.647 2.646 2.646c.098.098.226.147.354.147s.256-.049.354-.146c.194-.194.194-.512 0-.707l-2.647-2.647z"/></svg>
                </span>    
            </td>
        </tr>
        <tr>
            <td><span ng-click="apply('1')">1</span></td>
            <td><span ng-click="apply('2')">2</span></td>
            <td><span ng-click="apply('3')">3</span></td>
        </tr>
        <tr>
            <td><span ng-click="apply('4')">4</span></td>
            <td><span ng-click="apply('5')">5</span></td>
            <td><span ng-click="apply('6')">6</span></td>
        </tr>
        <tr>
            <td><span ng-click="apply('7')">7</span></td>
            <td><span ng-click="apply('8')">8</span></td>
            <td><span ng-click="apply('9')">9</span></td>
        </tr>
        <tr>
            <td><span ng-click="apply(getFuncButton())" ng-class="{'disabled': !canFunc()}" ng-hide="!canShowFunc()">{{getFuncButton()}}</span></td>
            <td><span ng-click="apply('0')">0</span></td>
            <td></td>
        </tr>
        <tr>
            <td colspan="3">
                <div class="pull-right btnDiv">
                    <a class="numCancel" ng-click="cancel()">CANCEL</a>
                    <a class="numSave" ng-click="save()" ng-class="{'disabled' : !canSave()}">SET</a>
                </div>
            </td>
        </tr>
    </tbody>
</table>`
    }
});