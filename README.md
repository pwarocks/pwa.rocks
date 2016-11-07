# List of Progressive Web Apps [![Build status](https://travis-ci.org/operasoftware/pwa.rocks.svg)](https://travis-ci.org/operasoftware/pwa.rocks)

What is a progressive web app? See the “[Progressive Web Apps](https://developer.chrome.com/devsummit/sessions/progressiveapps)” talk by [Alex Russell](https://github.com/slightlyoff) and [Andreas Bovens](https://github.com/andreasbovens).

## Contributing

We’re happy to feature other nice-looking progressive web apps in the list. They should:

- Be served over HTTPS.
- Have a manifest with a `short_name` and `name`, `start_url`, and a PNG icon of at least 144×144 pixels.
- Have a service worker (making sure that the `start_url` functions offline).

This combination of features will trigger the web app install banner in [Opera](https://dev.opera.com/blog/web-app-install-banners/) and [Chrome](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android) (to trigger it on the first visit, we recommend enabling _Bypass user engagement checks_ option in `chrome:flags` or `opera:flags`), unless the site is intercepting `onbeforeinstallprompt`. In the latter case, the banner is triggered at a custom point in time, defined by the site’s own logic.

## How to Suggest an App

- Fork this repository.
- Create a branch, name it after your app.
- Add an icon (preferably SVG) to the `apps` folder.
- Add an entry to the [src/index.html](src/index.html) file:

```html
<a class="list__item app js-app"
		href="URL"
		data-app="ID"
		data-tags="TAGS">
	<div class="app__wrapper">
		<h2 class="app__title">
			TITLE
		</h2>
	</div>
	<style>
		[data-app='ID'] {
			color: COLOR;
			background: currentColor url(apps/ID.svg) 50% 50% / 50% auto no-repeat;
			}
	</style>
</a>
```

- Test it locally by opening the [src/index.html](src/index.html) file in your browser.
- Commit all changes to your app branch and create a pull request.

## Development

- Fork this repository.
- Create a branch, name it after the feature you’re implementing.
- Clone it locally and start making changes.
- Test it locally by opening the [src/index.html](src/index.html) file in your browser.
- Commit all changes to your feature branch and create a pull request.

For full-scaled development and testing you can use the build system:

- `npm run server` for the dev server and light build.
- `npm run build` for the full build with caching.
