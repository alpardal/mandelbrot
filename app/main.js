import {Utils} from './utils';
import {MouseHandler} from './mouse_handler';
import {Viewport} from './viewport';
import {MandelbrotView} from './mandelbrot_view';

var canvas = document.getElementById('drawing-canvas'),
    ctx = canvas.getContext('2d'),
    buffer = document.createElement('canvas'),
    createViewport = Viewport.create.bind(null, canvas),
    gridStack = [],
    ratio = canvas.height/canvas.width,
    w = 4,
    h = ratio * w,
    x = -w/2,
    y = h/2,
    grid = {x: x, y: y, width: w, height: h},
    viewport = createViewport(grid),
    outline = null;

buffer.width = canvas.width;
buffer.height = canvas.height;

function renderMandelbrot() {
    var mandelbrot = new MandelbrotView(viewport);
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
    var expectedWidth = rect.height * (1/ratio),
        expectedHeight = rect.width * ratio;
    rect.height = expectedHeight;
    outline = rect
    render();
}

new MouseHandler(canvas, setView, restoreView, setOutline);
renderMandelbrot();
render();
