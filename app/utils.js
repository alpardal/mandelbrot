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
    }
};


export {Utils};
