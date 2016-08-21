(function() {
	var tags = document.querySelectorAll('.js-tag');
	var list = document.querySelector('.js-list');
	var apps = document.querySelectorAll('.js-app');

	tags[0].checked = true;

	for (var i = 0; i < tags.length; i++) {
		tags[i].addEventListener('change', function() {
			list.dataset.filter = this.value;
		});
	}

	for (var i = 0; i < apps.length; i++) {
		list.appendChild(apps[Math.random() * i | 0]);
	}
}());
