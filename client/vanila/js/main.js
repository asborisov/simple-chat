(function() {
    HTMLElement.prototype.removeClass = function(classToRemove) {
        this.className = this.className
            .split(' ')
            .filter(item => item !== classToRemove)
            .join(' ');
    };

    HTMLElement.prototype.addClass = function(classToAdd) {
        this.className = this.className
            .split(' ')
            .concat(classToAdd)
            .join(' ');
    };
}());
