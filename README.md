# yandex-map-widget

Yandex Map Widget which loads the Map API and then creates a map with placemarks.

* Appends a script tag for the Map API to document body.
* Provides a promise that resolves when the script is loaded and the [API is ready](https://tech.yandex.com/maps/doc/jsapi/2.1/dg/concepts/load-docpage/#api-ready).
* After that you can create a map by just providing a list of points (see example below).
* You can create multiple maps on the same page if you want.

## Installation

```shell
# npm
npm install yandex-map-widget

```

## Usage

If `yandex-map-widget.loadApi` was called without args, default `script src` value would be `"//api-maps.yandex.ru/2.1/?lang=ru_RU"`

```javascript
import mapWidjet from 'yandex-map-widget';

    mapWidjet.loadApi()
      .then(() => {
        mapWidjet.createMap('mymap',
          [
            {
              name: 'Лесная поляна',
              desc: 'место отдыха молодёжи',
              lat: 54.934095,
              lon: 43.305741,
              address: 'Лесная, 21',
              tel: '91659',
              site: 'http://sarov.info'
            },
            {
              name: 'Берёзовая роща',
              desc: 'парк',
              lat: 54.948128,
              lon: 43.331607,
              address: 'Берёзовая, 6',
              tel: '97527',
              site: 'https://sarov-itc.ru'
            },
            {
              name: 'Улица коммунистов',
              desc: 'историческое место',
              lat: 54.916773,
              lon: 43.337682,
              address: 'Шверника, 9',
              tel: '69091',
              site: 'http://sarov.net/news'
            }
          ]);
      })
      .catch(error => console.error(error));
```

To use another language simply pass a valid `src` to `yandex-map-widget.loadApi`

```javascript
mapWidjet.loadApi('https://api-maps.yandex.ru/2.1/?lang=en_US').then(() => { /* ... */ })
```


## Running the tests

```shell
# with npm
npm test

```
