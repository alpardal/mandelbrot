var MouseHandler = function(canvas, setView, restoreView, setOutline) {
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

MouseHandler.prototype.mouseDown = function(event) {
    if (event.button === MouseHandler.MIDDLE_BUTTON) {
        this.restoreView();
    }

    if (event.button === MouseHandler.LEFT_BUTTON){
        this.startDragging(getPosition(event));
    }
};
MouseHandler.prototype.mouseUp = function(event) {
    this.stopDragging(getPosition(event));
};
MouseHandler.prototype.mouseMove = function(event) {
    if (this.dragging) {
        this.setOutline(createRectangle(this.dragStart,
                                         getPosition(event)));
    }
};
MouseHandler.prototype.mouseOut = function(event) {
    this.stopDragging(getPosition(event));
};

MouseHandler.prototype.startDragging = function(pos) {
    this.dragging = true;
    this.dragStart = pos;
};

MouseHandler.prototype.stopDragging = function(pos) {
    if (!this.dragging) { return; }

    this.dragging = false;
    this.setView(createRectangle(this.dragStart, pos));
    this.dragStart = null;
}

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
    }
}


export {MouseHandler};
