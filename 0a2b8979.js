'use strict';

const PREFIX = 'pwa.rocks';
const HASH = '0a2b8979'; // Computed at build time.
const OFFLINE_CACHE = `${PREFIX}-${HASH}`;

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(OFFLINE_CACHE).then(function(cache) {
			return cache.addAll([
				'/',
				'/favicon.ico',
				'/screen.css',
				'/script.js',
				'/fonts/permanent-marker.woff',
				'/fonts/permanent-marker.woff2',
				'/images/icon-228x228.png',
				'/images/icon.svg',
				'/apps/air-horner.svg',
				'/apps/aliexpress.svg',
				'/apps/babe.svg',
				'/apps/billings-gazette.svg',
				'/apps/bubble.svg',
				'/apps/chrome-status.svg',
				'/apps/cloud-four.svg',
				'/apps/currency-x.svg',
				'/apps/datememe.svg',
				'/apps/dev-opera.svg',
				'/apps/digikala.svg',
				'/apps/emojoy.svg',
				'/apps/english-accents-map.svg',
				'/apps/expense-manager.svg',
				'/apps/financial-times.svg',
				'/apps/firefox.png',
				'/apps/flipboard.svg',
				'/apps/flipkart.svg',
				'/apps/geo-news.svg',
				'/apps/get-kana.svg',
				'/apps/google-io.svg',
				'/apps/guitar-tuner.svg',
				'/apps/housing.svg',
				'/apps/inbox-attack.svg',
				'/apps/jalantikus.svg',
				'/apps/konga.svg',
				'/apps/meatscope.svg',
				'/apps/nasa_logo.svg',
				'/apps/notes.svg',
				'/apps/oumy.svg',
				'/apps/paper-planes.svg',
				'/apps/piiko.png',
				'/apps/podle.svg',
				'/apps/pokedex.png',
				'/apps/poly-mail.svg',
				'/apps/polytimer.svg',
				'/apps/prog-beer.svg',
				'/apps/puzzle-2048.svg',
				'/apps/qrcode.svg',
				'/apps/reacthn.svg',
				'/apps/resilient-web-design.svg',
				'/apps/riorun.svg',
				'/apps/selio.svg',
				'/apps/session.svg',
				'/apps/smaller-pictures.svg',
				'/apps/snapdrop.svg',
				'/apps/snapwat.svg',
				'/apps/soundslice.svg',
				'/apps/svgomg.svg',
				'/apps/telegram.svg',
				'/apps/voice-memos.svg',
				'/apps/washington-post.svg',
				'/apps/wave-pd1.svg',
				'/apps/web-flap.png',
				'/apps/webnfc.svg',
				'/apps/wiki-offline.svg'
			]); // Computed at build time.
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
					return cache.match('/');
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
