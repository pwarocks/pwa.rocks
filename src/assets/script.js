(function() {
	// Array shuffle courtesy of Dudley Storey
	// https://thenewcode.com/82/Recipes-for-Randomness-in-JavaScript
	function shuffle(numPool) {
		for (var j, x, i = numPool.length; i; j = parseInt(Math.random() * i), x = numPool[--i], numPool[i] = numPool[j], numPool[j] = x);
		return numPool;
	}

	// Filter
	var list = document.querySelector('.list');
	var apps = document.querySelectorAll('.list__app:not(:last-child)');
	var buttons = document.querySelectorAll('.navigation__button');

	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', function() {
			this.classList.toggle('navigation__button--active');
			list.classList.toggle('list--' + this.textContent);
			if (document.querySelectorAll('.navigation__button--active').length) {
				list.classList.add('list--filter');
			} else {
				list.classList.remove('list--filter');
			}
		});
	}

	// Shuffle
	var shuffled = shuffle(Array.prototype.slice.call(apps));
	for (var i = 0; i < apps.length; i++) {
		shuffled[i].style.order = '-' + (i + 1);
	}
}());
