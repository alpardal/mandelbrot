(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var Complex = function Complex(real, imag) {
    this.real = real;
    this.imag = imag;
};

Complex.prototype.copy = function () {
    return new Complex(this.real, this.imag);
};

Complex.prototype.magSquared = function (c) {
    return this.real * this.real + this.imag * this.imag;
};

Complex.prototype.angle = function () {
    return Math.atan2(this.imag, this.real);
};

Complex.prototype.add = function (other) {
    this.real += other.real;
    this.imag += other.imag;

    return this;
};

Complex.prototype.square = function () {
    var angle = 2 * this.angle(),
        mag = this.magSquared();

    this.real = mag * Math.cos(angle);
    this.imag = mag * Math.sin(angle);

    return this;
};

exports.Complex = Complex;

},{}],2:[function(require,module,exports){
'use strict';

var _utils = require('./utils');

var _mouse_handler = require('./mouse_handler');

var _viewport = require('./viewport');

var _mandelbrot_view = require('./mandelbrot_view');

var canvas = document.getElementById('drawing-canvas'),
    ctx = canvas.getContext('2d'),
    buffer = document.createElement('canvas'),
    createViewport = _viewport.Viewport.create.bind(null, canvas),
    gridStack = [],
    ratio = canvas.height / canvas.width,
    w = 4,
    h = ratio * w,
    x = -w / 2,
    y = h / 2,
    grid = { x: x, y: y, width: w, height: h },
    viewport = createViewport(grid),
    outline = null;

buffer.width = canvas.width;
buffer.height = canvas.height;

function renderMandelbrot() {
    var mandelbrot = new _mandelbrot_view.MandelbrotView(viewport);
    mandelbrot.renderTo(buffer);
}

function render() {
    ctx.drawImage(buffer, 0, 0);

    if (outline) {
        drawOutline(ctx, outline);
    }
}

function setView(rect) {
    gridStack.push(grid);
    grid = viewport.gridFromRect(rect);
    viewport = createViewport(grid);
    outline = null;

    renderMandelbrot();
    render();
}

function restoreView() {
    if (gridStack.length !== 0) {
        grid = gridStack.pop();
        viewport = createViewport(grid);
        renderMandelbrot();
        render();
    }
}

function drawOutline(ctx, outline) {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.rect(outline.x, outline.y, outline.width, outline.height);
    ctx.closePath();
    ctx.stroke();
}

function setOutline(rect) {
    var expectedWidth = rect.height * (1 / ratio),
        expectedHeight = rect.width * ratio;
    rect.height = expectedHeight;
    outline = rect;
    render();
}

new _mouse_handler.MouseHandler(canvas, setView, restoreView, setOutline);
renderMandelbrot();
render();

},{"./mandelbrot_view":4,"./mouse_handler":5,"./utils":6,"./viewport":7}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _complex = require('./complex');

var Mandelbrot = {
    MAX_ITERATIONS: 100,
    THRESHOLD: 4,
    iterations: function iterations(real, imag) {
        var c = new _complex.Complex(real, imag),
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

exports.Mandelbrot = Mandelbrot;

},{"./complex":1}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _mandelbrot = require('./mandelbrot');

var _utils = require('./utils');

var interp = _utils.Utils.Math.interpolate;

var MandelbrotView = function MandelbrotView(viewport) {
    this.viewport = viewport;
};

MandelbrotView.prototype.renderTo = function (canvas, level) {
    var ctx = canvas.getContext('2d'),
        img = ctx.createImageData(canvas.width, canvas.height),
        data = img.data;

    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            var dataIndex = (y * canvas.width + x) * 4,
                point = this.viewport.pointAt({ x: x, y: y }),
                color = this.colorAt(point);
            data[dataIndex] = color.r;
            data[dataIndex + 1] = color.g;
            data[dataIndex + 2] = color.b;
            data[dataIndex + 3] = color.a;
        }
    }

    ctx.putImageData(img, 0, 0);
};

var b_minX = 0,
    b_maxX = 4,
    b_f = Math.exp,
    b_minY = b_f(b_minX),
    b_maxY = b_f(b_maxX),
    r_minX = 1,
    r_maxX = 100,
    r_f = Math.log,
    r_minY = r_f(r_minX),
    r_maxY = r_f(r_maxX);

MandelbrotView.prototype.colorAt = function (point) {
    var i = _mandelbrot.Mandelbrot.iterations(point.x, point.y),
        b_iMapped = b_f(interp(i, 0, _mandelbrot.Mandelbrot.MAX_ITERATIONS, b_minX, b_maxX)),
        b = interp(b_iMapped, b_minY, b_maxY, 0, 255),
        r_iMapped = r_f(interp(i, 0, _mandelbrot.Mandelbrot.MAX_ITERATIONS, r_minX, r_maxX)),
        r = interp(r_iMapped, r_minY, r_maxY, 0, 255),
        g = i * 255 / _mandelbrot.Mandelbrot.MAX_ITERATIONS;

    return {
        r: r,
        g: g,
        b: b,
        a: 255
    };
};

exports.MandelbrotView = MandelbrotView;

},{"./mandelbrot":3,"./utils":6}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var MouseHandler = function MouseHandler(canvas, setView, restoreView, setOutline) {
    this.canvas = canvas;
    this.setView = setView;
    this.restoreView = restoreView;
    this.setOutline = setOutline;
    this.dragging = false;

    canvas.addEventListener('mousedown', this.mouseDown.bind(this));
    canvas.addEventListener('mouseup', this.mouseUp.bind(this));
    canvas.addEventListener('mousemove', this.mouseMove.bind(this));
    canvas.addEventListener('mouseout', this.mouseOut.bind(this));
};

MouseHandler.LEFT_BUTTON = 0;
MouseHandler.MIDDLE_BUTTON = 1;

MouseHandler.prototype.mouseDown = function (event) {
    if (event.button === MouseHandler.MIDDLE_BUTTON) {
        this.restoreView();
    }

    if (event.button === MouseHandler.LEFT_BUTTON) {
        this.startDragging(getPosition(event));
    }
};
MouseHandler.prototype.mouseUp = function (event) {
    this.stopDragging(getPosition(event));
};
MouseHandler.prototype.mouseMove = function (event) {
    if (this.dragging) {
        this.setOutline(createRectangle(this.dragStart, getPosition(event)));
    }
};
MouseHandler.prototype.mouseOut = function (event) {
    this.stopDragging(getPosition(event));
};

MouseHandler.prototype.startDragging = function (pos) {
    this.dragging = true;
    this.dragStart = pos;
};

MouseHandler.prototype.stopDragging = function (pos) {
    if (!this.dragging) {
        return;
    }

    this.dragging = false;
    this.setView(createRectangle(this.dragStart, pos));
    this.dragStart = null;
};

function getPosition(event) {
    return {
        x: event.offsetX,
        y: event.offsetY
    };
}

function createRectangle(dragStart, dragStop) {
    return {
        x: Math.min(dragStart.x, dragStop.x),
        y: Math.min(dragStart.y, dragStop.y),
        width: Math.abs(dragStart.x - dragStop.x),
        height: Math.abs(dragStart.y - dragStop.y)
    };
}

exports.MouseHandler = MouseHandler;

},{}],6:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var Utils = {
    Functions: {
        limit: function limit(fn, timeLimit) {
            var id = null;
            return function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

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
        interpolate: function interpolate(value, oldMin, oldMax, newMin, newMax) {
            var ratio = (value - oldMin) / (oldMax - oldMin);
            return newMin + ratio * (newMax - newMin);
        }
    }
};

exports.Utils = Utils;

},{}],7:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var Viewport = function Viewport(canvas, viewRect) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.viewRect = viewRect;
};

Viewport.create = function (canvas, viewRect) {
    return new Viewport(canvas, viewRect);
};

Viewport.prototype.pointAt = function (canvasPosition) {
    var x = this.viewRect.x + canvasPosition.x / this.canvasWidth * this.viewRect.width,
        y = this.viewRect.y - canvasPosition.y / this.canvasHeight * this.viewRect.height;
    return { x: x, y: y };
};

Viewport.prototype.gridFromRect = function (rect) {
    var topLeft = this.pointAt(rect),
        bottomRight = this.pointAt({ x: rect.x + rect.width,
        y: rect.y + rect.height });

    return {
        x: topLeft.x,
        y: topLeft.y,
        width: bottomRight.x - topLeft.x,
        height: topLeft.y - bottomRight.y
    };
};

exports.Viewport = Viewport;

},{}]},{},[1,2,3,4,5,6,7]);
