import {Mandelbrot} from './mandelbrot';

var MandelbrotView = function(viewport) {
    this.viewport = viewport;
};

MandelbrotView.prototype.renderTo = function(canvas) {
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

MandelbrotView.prototype.colorAt = function(point) {
    var i = Mandelbrot.iterations(point.x, point.y),
        b = i * 255 / Mandelbrot.MAX_ITERATIONS;

    return {
        r: 0,
        g: 0,
        b: b,
        a: 255
    };
};


export {MandelbrotView};
