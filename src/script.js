(function() {

	// Storage. Courtesy of Mathias Bynens
	// https://mathiasbynens.be/notes/localstorage-pattern

	var storage = (function() {
		var uid = new Date;
		var storage;
		var result;
		try {
			(storage = window.sessionStorage).setItem(uid, uid);
			result = storage.getItem(uid) == uid;
			storage.removeItem(uid);
			return result && storage;
		} catch (exception) {}
	}());

	// Shuffle. Courtesy of Dudley Storey
	// https://thenewcode.com/82/Recipes-for-Randomness-in-JavaScript

	var shuffle = (function (array) {
		for (var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
		return array;
	});

	// Elements

	var tags = document.querySelectorAll('.js-tag');
	var list = document.querySelector('.js-list');
	var apps = document.querySelectorAll('.js-app');
	var suggest = document.querySelector('.js-suggest');

	// Tags

	tags[0].checked = true;

	for (var i = 0; i < tags.length; i++) {
		tags[i].addEventListener('change', function() {
			list.dataset.filter = this.value;
		});
	}

	// Reorder

	function getOrder(array) {
		var order = [];
		for (var i = 0; i < array.length; i++) {
			order.push(array[i].dataset.app);
		}

		return order;
	}

	function setOrder(order) {
		if (storage) {
			var item = storage.getItem('pwa-list-order');
			order = item ? item.split(',') : order;
		}

		for (var i = 0; i < order.length; i++) {
			var item = list.querySelector('[data-app=' + order[i] + ']');
			list.insertBefore(item, suggest);
		}

		storage.setItem('pwa-list-order', order.join());
	}

	setOrder(shuffle(getOrder(apps)));

}());
