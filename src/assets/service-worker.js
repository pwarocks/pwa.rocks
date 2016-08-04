'use strict';

const PREFIX = 'devopera';
const HASH = '99d809d6'; // TODO: calculate when running `gulp`.
const OFFLINE_CACHE = `${PREFIX}-${HASH}`;
const OFFLINE_URL = '/';

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(OFFLINE_CACHE).then(function(cache) {
			return cache.addAll([
				OFFLINE_URL,

				'/styles/screen.css',
				'/fonts/permanent-marker.woff',
				'/favicon.ico',
				'/images/icon-228x228.png',

				'/images/2048-puzzle.svg',
				'/images/air-horner.svg',
				'/images/aliexpress.svg',
				'/images/babe.svg',
				'/images/currency-x.svg',
				'/images/datememe.svg',
				'/images/dev-opera.svg',
				'/images/emojoy.svg',
				'/images/expense-manager.svg',
				'/images/firefox.svg',
				'/images/flipboard.svg',
				'/images/flipkart.svg',
				'/images/geo-news.svg',
				'/images/get-kana.svg',
				'/images/google-io.svg',
				'/images/guitar-tuner.svg',
				'/images/inbox-attack.svg',
				'/images/jalantikus.svg',
				'/images/meatscope.svg',
				'/images/oumy.svg',
				'/images/pokedex.png',
				'/images/poly-mail.svg',
				'/images/prog-beer.svg',
				'/images/qrcode.svg',
				'/images/reacthn.svg',
				'/images/selio.svg',
				'/images/session.svg',
				'/images/smaller-pictures.svg',
				'/images/snapdrop.svg',
				'/images/soundslice.svg',
				'/images/spaces.svg',
				'/images/suggest.svg',
				'/images/svgomg.svg',
				'/images/telegram.svg',
				'/images/voice-memos.svg',
				'/images/washington-post.svg',
				'/images/wave-pd1.svg',
				'/images/web-flap.png',
				'/images/webnfc.svg',
				'/images/wiki-offline.svg'

			]);
		})
	);
});

self.addEventListener('activate', function(event) {
	// Delete old asset caches.
	event.waitUntil(
		caches.keys().then(function(keys) {
			return Promise.all(
				keys.map(function(key) {
					if (
						key != OFFLINE_CACHE &&
						key.startsWith(`${PREFIX}-`)
					) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	if (event.request.mode == 'navigate') {
		console.log('Handling fetch event for', event.request.url);
		console.log(event.request);
		event.respondWith(
			fetch(event.request).catch(function(exception) {
				// The `catch` is only triggered if `fetch()` throws an exception,
				// which most likely happens due to the server being unreachable.
				console.error(
					'Fetch failed; returning offline page instead.',
					exception
				);
				return caches.open(OFFLINE_CACHE).then(function(cache) {
					return cache.match(OFFLINE_URL);
				});
			})
		);
	} else {
		// It’s not a request for an HTML document, but rather for a CSS or SVG
		// file or whatever…
		event.respondWith(
			caches.match(event.request).then(function(response) {
				return response || fetch(event.request);
			})
		);
	}

});
