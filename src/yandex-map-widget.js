/* global ymaps */

export default {

  loadApi(src) {
    src = src || '//api-maps.yandex.ru/2.1/?lang=ru_RU';

    const getNsParamValue = () => {
      var results = RegExp('[\\?&]ns=([^&#]*)').exec(src);
      return results === null ? '' :
        decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    this.promise = this.promise || new Promise((resolve, reject) => {
      let elem = document.createElement('script');
      elem.type = 'text/javascript';
      elem.src = src;
      elem.onload = resolve;
      elem.onerror = e => reject(e);
      document.body.appendChild(elem);
    })
      .then(() => {
        const ns = getNsParamValue();
        console.log(ns);
        if (ns && ns !== 'ymaps') {
          (1, eval)(`var ymaps = ${ns};`); // eslint-disable-line
        }

        Tooltip.init();

        return new Promise(resolve => {
          ymaps.ready(resolve)
        });
      });

    return this.promise;
  },

  createMap(mapContainerID, points) {
    if (window.ymaps !== undefined) {
      let center = [55.751430, 37.618832];
      const zoom = 16;

      if (points.length === 1) {
        center = [points[0].lat, points[0].lon];
      }

      const mapContainer = document.getElementById(mapContainerID);
      mapContainer.style.minWidth = "320px";
      mapContainer.style.minHeight = "480px";

      const map = new ymaps.Map(mapContainerID, {
        center,
        zoom
      });

      map.events.add('actionbegin', () => {
        Tooltip.hide();
      });

      const placemarks = createPlacemarks(points);
      map.geoObjects.add(placemarks);

      if (points.length > 1) {
        map.setBounds(placemarks.getBounds());
      }
    }
    else {
      throw new Error('The map API is NOT loaded yet');
    }
  }

};

function createPlacemarks(points) {
  const placemarks = new ymaps.GeoObjectCollection();

  points.forEach(p => {
    const marker = new ymaps.Placemark([p.lat, p.lon], {
      // hintContent: p.name
      // balloonContent: p.desc
    });

    marker.events.add('click', () => {
      Tooltip.point = p;
    });

    placemarks.add(marker);
  });

  return placemarks;
}


var Tooltip = {
  tooltip: undefined,
  point: null,

  init: () => {
    const tooltip = document.createElement('div');
    Tooltip.tooltip = tooltip;

    tooltip.id = 'ymap-widget-tooltip';
    document.body.appendChild(tooltip);

    tooltip.addEventListener('click', Tooltip.hide);

    window.addEventListener('resize', Tooltip.hide);

    document.addEventListener("click", function(e){
      if (Tooltip.point) {
        Tooltip.hide();
        Tooltip.show(e.pageX, e.pageY);
        Tooltip.point = null;
      }
    });
  },

  show: (x, y) => {
    const point = Tooltip.point;
    const tooltip = Tooltip.tooltip;

    tooltip.innerHTML = `
<div class="ymap-widget-tooltip-content">
  <div class="point-name">${point.name}</div>
  <div>${point.desc}</div>
  <div>
    <span>Адрес: </span>
    <span>${point.address}</span>
  </div>
  <div>
    <span>Телефон:</span>
    <span>${point.tel}</span>
  </div>
  <div>
    <span>Сайт: </span>
    <a href="${point.site}" target="_blank" rel="noopener noreferrer" class="point-site">${point.site}</a>
  </div>
</div>
`;

    if( window.innerWidth < tooltip.offsetWidth * 1.5 ) {
      tooltip.style.maxWidth = (window.innerWidth / 2) + 'px';
    }
    else {
      tooltip.style.maxWidth = 320 + 'px';
    }

    let pos_left = x - tooltip.offsetWidth / 2;
    let pos_top  = y - tooltip.offsetHeight - 20;

    tooltip.className = '';

    // console.log(`(${pos_left}, ${pos_top})`);

    if( pos_left < 0 ) {
      pos_left = x - 20;
      tooltip.className += ' left';
    }

    if (pos_left + tooltip.offsetWidth > window.innerWidth) {
      pos_left = x - tooltip.offsetWidth + 20;
      tooltip.className +=' right';
    }

    if( pos_top < 0 ) {
      pos_top  = y + 10;
      tooltip.className += ' top';
    }

    tooltip.style.left = pos_left + 'px';
    tooltip.style.top = pos_top + 'px';

    tooltip.className += ' show';
  },

  hide: () => {
    const tooltip = Tooltip.tooltip;
    if (tooltip) {
      tooltip.className = tooltip.className.replace('show', '');
    }
  }

};
