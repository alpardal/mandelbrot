import {Complex} from './complex';


var Mandelbrot = {
    MAX_ITERATIONS: 100,
    THRESHOLD: 4,
    iterations: function(real, imag) {
        var c = new Complex(real, imag),
            zn = c.copy();

        for (var i = 0; i < this.MAX_ITERATIONS; i++) {
            if (zn.magSquared() > this.THRESHOLD) {
                return i;
            }

            zn.square().add(c);
        }

        return null;
    }
};


export {Mandelbrot};
