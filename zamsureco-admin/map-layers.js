(function () {
  const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';

  window.addBaseLayers = function (map, startWith = 'Satellite') {
    const street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    });

    const satellite = L.layerGroup([
      L.tileLayer(ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, maxNativeZoom: 18, attribution: 'Imagery &copy; Esri',
      }),
      L.tileLayer(ESRI + 'Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, maxNativeZoom: 18,
      }),
      L.tileLayer(ESRI + 'Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, maxNativeZoom: 18,
      }),
    ]);

    (startWith === 'Map' ? street : satellite).addTo(map);
    L.control.layers({ 'Satellite': satellite, 'Map': street }, null, { position: 'topright', collapsed: false }).addTo(map);
    return { street, satellite };
  };
})();
