import {Mandelbrot} from './mandelbrot';
import {Utils} from './utils';

const interp = Utils.Math.interpolate;

var MandelbrotView = function(viewport) {
    this.viewport = viewport;
};

MandelbrotView.prototype.renderTo = function(canvas, level) {
    var ctx = canvas.getContext('2d'),
        img = ctx.createImageData(canvas.width, canvas.height),
        data = img.data;

    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            var dataIndex = (y * canvas.width + x) * 4,
                point = this.viewport.pointAt({x: x, y: y}),
                color = this.colorAt(point);
                data[dataIndex] = color.r;
                data[dataIndex+1] = color.g;
                data[dataIndex+2] = color.b;
                data[dataIndex+3] = color.a;
            }
    }

    ctx.putImageData(img, 0, 0);
};

const b_minX = 0, b_maxX = 4, b_f = Math.exp,
      b_minY = b_f(b_minX), b_maxY = b_f(b_maxX),

      r_minX = 1, r_maxX = 100, r_f = Math.log,
      r_minY = r_f(r_minX), r_maxY = r_f(r_maxX);

MandelbrotView.prototype.colorAt = function(point) {
    var i = Mandelbrot.iterations(point.x, point.y),
        b_iMapped = b_f(interp(i, 0, Mandelbrot.MAX_ITERATIONS,
                                               b_minX, b_maxX)),
        b = interp(b_iMapped, b_minY, b_maxY, 0, 255),

        r_iMapped = r_f(interp(i, 0, Mandelbrot.MAX_ITERATIONS,
                                               r_minX, r_maxX)),
        r = interp(r_iMapped, r_minY, r_maxY, 0, 255),

        g = i * 255 / Mandelbrot.MAX_ITERATIONS;

    return {
        r: r,
        g: g,
        b: b,
        a: 255
    };
};


export {MandelbrotView};
