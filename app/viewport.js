var Viewport = function(canvas, viewRect) {
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.viewRect = viewRect;
};

Viewport.create = function(canvas, viewRect) {
    return new Viewport(canvas, viewRect);
};

Viewport.prototype.pointAt = function(canvasPosition) {
    var x = this.viewRect.x +
           (canvasPosition.x / this.canvasWidth) * this.viewRect.width,
        y = this.viewRect.y -
           (canvasPosition.y / this.canvasHeight) * this.viewRect.height;
    return {x: x, y: y};
};

Viewport.prototype.gridFromRect = function(rect) {
    var topLeft = this.pointAt(rect),
        bottomRight = this.pointAt({x: rect.x + rect.width,
                                    y: rect.y + rect.height});

    return {
        x: topLeft.x,
        y: topLeft.y,
        width: bottomRight.x - topLeft.x,
        height: topLeft.y - bottomRight.y
    };
};

export {Viewport};
