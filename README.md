# List of Progressive Web Apps [![Build status](https://travis-ci.org/operasoftware/pwa-list.svg)](https://travis-ci.org/operasoftware/pwa-list)

What is a progressive web app? See the “[Progressive Web Apps](https://developer.chrome.com/devsummit/sessions/progressiveapps)” talk by [Alex Russell](https://github.com/slightlyoff) and [Andreas Bovens](https://github.com/andreasbovens).

## Development

- Clone repository locally `git clone git@github.com:operasoftware/pwa-list.git`
- Install all dependencies `cd pwa-list && npm install`
- Start local server `npm run server`

## Contributing

We’re happy to feature other nice-looking progressive web apps in the list. They should:

- Be served over HTTPS
- Have a manifest with a `short_name` and `name`, `start_url`, and a PNG icon of at least 144×144 pixels
- Have a service worker (making sure that the `start_url` functions offline)

This combination of features will trigger the web app install banner in [Opera](https://dev.opera.com/blog/web-app-install-banners/) and [Chrome](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android) (to trigger it on the first visit, we recommend enabling _Bypass user engagement checks_ option in `chrome:flags` or `opera:flags`), unless the site is intercepting `onbeforeinstallprompt`. In the latter case, the banner is triggered at a custom point in time, defined by the site’s own logic.

We welcome all submissions, but actual inclusion in the list is up to the discretion of the Opera Dev Relations team. If we find your web app not fitting (e.g. for content or other reasons), we won’t feature it.
