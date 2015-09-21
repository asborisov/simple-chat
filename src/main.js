(function () {
	HTMLElement.prototype.removeClass = function (classToRemove) {
		var classes = this.className.split(' ');
		var newClassName = classes.filter(function (item) {
			return item != classToRemove;
		});
		this.className = newClassName.join(' ');
	};

	HTMLElement.prototype.addClass = function (classToAdd) {
		var classes = this.className.split(' ');
		classes.push(classToAdd);
		this.className = classes.join(' ');


	};
}());
