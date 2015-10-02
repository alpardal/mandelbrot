var Complex = function(real, imag){
    this.real = real;
    this.imag = imag;
};

Complex.prototype.copy = function() {
    return new Complex(this.real, this.imag);
};

Complex.prototype.magSquared = function(c) {
    return this.real*this.real + this.imag*this.imag;
};

Complex.prototype.angle = function() {
    return Math.atan2(this.imag, this.real);

};

Complex.prototype.add = function(other) {
    this.real += other.real
    this.imag += other.imag;

    return this;
};

Complex.prototype.square = function() {
    var angle = 2 * this.angle(),
        mag = this.magSquared();

    this.real = mag * Math.cos(angle);
    this.imag = mag * Math.sin(angle);

    return this;
};


export {Complex};
