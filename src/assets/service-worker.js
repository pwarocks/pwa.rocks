'use strict';

const PREFIX = 'devopera';
const HASH = '4140ca48a'; // TODO: calculate when running `gulp`.
const OFFLINE_CACHE = `${PREFIX}-${HASH}`;
const OFFLINE_URL = '/';

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(OFFLINE_CACHE).then(function(cache) {
			return cache.addAll([
				OFFLINE_URL,
				'https://fonts.googleapis.com/css?family=Permanent+Marker',
				'/favicon.ico',
				'/styles/screen.css',
				'/images/icon-228x228.png'
				'/images/2048-puzzle.svg',
				'/images/air-horner.svg',
				'/images/babe.svg',
				'/images/currency-x.svg',
				'/images/dev-opera.svg',
				'/images/emojoy.svg',
				'/images/firefox.svg',
				'/images/flipboard.svg',
				'/images/flipkart.svg',
				'/images/get-kana.svg',
				'/images/google-io.svg',
				'/images/guitar-tuner.svg',
				'/images/icon.svg',
				'/images/inbox-attack.svg',
				'/images/oumy.svg',
				'/images/pokedex.png',
				'/images/poly-mail.svg',
				'/images/qrcode.svg',
				'/images/session.svg',
				'/images/smaller-pictures.svg',
				'/images/snapdrop.svg',
				'/images/soundslice.svg',
				'/images/suggest.svg',
				'/images/svgomg.svg',
				'/images/telegram.svg',
				'/images/voice-memos.svg',
				'/images/wave-pd1.svg',
				'/images/webnfc.svg',
				'/images/wiki-offline.svg',
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
