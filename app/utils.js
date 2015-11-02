var Utils = {
    Functions: {
        limit(fn, timeLimit) {
            var id = null;
            return function(...args) {
                if (id) {
                    clearTimeout(id);
                }
                id = setTimeout(function () {
                    id = null;
                    fn.apply(null, args);
                }, timeLimit);
            };
        }
    },

    Math: {
        interpolate(value, oldMin, oldMax, newMin, newMax) {
            let ratio = (value - oldMin) / (oldMax - oldMin);
            return newMin + ratio * (newMax - newMin);
        }
    }
};


export {Utils};
