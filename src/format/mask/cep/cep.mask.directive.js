(function () {
    'use strict';

    angular
        .module('gear')
        .directive('grMaskCep', grMaskCep);

    function grMaskCep(grCepFilter, $timeout) {
        var directive = {
            restrict: 'A',
            link: link,
            require: 'ngModel'
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            var beforeSelIndex, afterSelIndex, futureSelIndex;

            element.on('keydown', function () {
                beforeSelIndex = doGetCaretPosition(element[0]);
            });

            ctrl.$parsers.push(function(value){
                afterSelIndex = doGetCaretPosition(element[0]);

                var viewValue = grCepFilter(value);
                ctrl.$setViewValue(viewValue);
                ctrl.$render();

                if (element[0].selectionStart || element[0].selectionStart == '0') {
                    switch (true) {
                        case beforeSelIndex == 5 && afterSelIndex == 6:
                            futureSelIndex = 7;
                            break;
                        default:
                            futureSelIndex = afterSelIndex;
                    }
                    setCaretPosition(element[0], futureSelIndex);
                    $timeout(function () {
                        setCaretPosition(element[0], futureSelIndex);
                    });
                }

                if (viewValue.length === 9)
                    return viewValue.replace(/[^0-9]+/g, '');
                if (!viewValue)
                    return '';
            });

            ctrl.$formatters.push(function(value){
                return grCepFilter(value);
            });

            function doGetCaretPosition(elem) {
                var caretPos = 0;
                // IE Support
                if (document.selection) {
                    elem.focus();
                    var sel = document.selection.createRange();
                    sel.moveStart('character', -elem.value.length);
                    caretPos = sel.text.length;
                }
                // Firefox support
                else if (elem.selectionStart || elem.selectionStart == '0') {
                    caretPos = elem.selectionStart;
                }

                return caretPos;

            }

            function setCaretPosition(elem, caretPos) {
                if (elem != null) {
                    if (elem.createTextRange) {
                        var range = elem.createTextRange();
                        range.move('character', caretPos);
                        range.select();
                    }
                    else {
                        if (elem.selectionStart) {
                            elem.focus();
                            elem.setSelectionRange(caretPos, caretPos);
                        }
                        else {
                            elem.focus();
                        }
                    }
                }
            }
        }
    }

})();