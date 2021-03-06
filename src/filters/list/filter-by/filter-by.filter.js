(function () {
    'use strict';

    angular
        .module('gear')
        .filter('grFilterBy', grFilterBy);

    grFilterBy.$inject = ['grUnaccentFilter']

    function grFilterBy(grUnaccentFilter) {
        return function(items, query, props, isCaseInsensitive) {
            isCaseInsensitive = typeof isCaseInsensitive === 'undefined' ? true : isCaseInsensitive;
            query = typeof query === 'string' ? query.toLowerCase() : query;
            query = isCaseInsensitive && query ? grUnaccentFilter(query) : query;
            if (!items)
                return [];
            return items.filter(function(item){
                if (!query)
                    return true;
                for (var i = 0; i < props.length; i++) {
                    var value = '',
                        itemProps = props[i];
                    if (itemProps.props) {
                        for (var j = 0; j < itemProps.props.length; j++) {
                            var subProp = itemProps.props[j]
                            value += item[subProp] + (j < itemProps.props.length - 1 && itemProps.join ? itemProps.join : '');
                        }
                    } else
                        value = item[props[i]];
                    value = isCaseInsensitive ? grUnaccentFilter(value) : value;
                    if (value.toLowerCase().indexOf(query) != -1)
                        return true;
                }
                return false;
            });
        };
    }
})();