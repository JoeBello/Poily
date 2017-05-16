function PlaceFactory($q, $http, $httpParamSerializer, API, AppStorageService,
                        $rootScope) {

  AppStorageService.init();

  function buildUrl(endpoint, params) {
    return API[endpoint].concat(params);
  }

  function deleteAllPlaces() {
    AppStorageService.deleteAllPlaces();
  }

  function deletePlace(place) {
    AppStorageService.deletePlace({
      id: place.place_id,
      saved: true
    });
  }

  function extractId(items) {
    var ids = [];

    items.forEach(function(item) {
      ids.push(item.id);
    });

    return ids;
  }

  function extractResults(responseObject) {
    if (responseObject.data.next_page_token) {
      AppStorageService.saveNextPageToken(responseObject.data.next_page_token);
    }
    return responseObject.data.results;
  }

  function getLastSearch() {
    return AppStorageService.getLastSearch();
  }

  function getNextPageToken() {
    return AppStorageService.getNextPageToken();
  }

  function getOnePlace(place) {
    var id = extractId(place);

    return $http.get(buildUrl('one', id))
      .then(function(placesResponse) {
        return extractResults(placesResponse);
      })
      .then(function(results) {
        results[0].saved = true;
        return results;
      })
      .catch(function(error) {
        return { error: error };
      });
  }

  function getPlaces(searchParams) {
    if (!searchParams.radius) {
      searchParams.radius = 30;
    }

    saveLastSearch(searchParams);

    return $http.get(buildUrl('places', $httpParamSerializer(searchParams)))
      .then(function(placesResponse) {
        return extractResults(placesResponse);
      })
  }

  function getSavedPlaces() {
    var ids,
        places = AppStorageService.getSavedPlaces();

    if (places.length === 1) {
      return getOnePlace(places);
    }

    ids = extractId(places);

    return $http.get(buildUrl('collection', $httpParamSerializer(ids)))
      .then(function(placesResponse) {
        return extractResults(placesResponse);
      })
      .then(function(results) {
        results.forEach(function(result) {
          result.saved = true;
        });
        return results;
      })
      .catch(function(error) {
        return { error: error };
      });
  }

  function saveLastSearch(searchDetails) {
    AppStorageService.saveSearch(searchDetails);
  }

  function saveNextPageToken(token) {
    AppStorageService.saveNextPageToken(token);
  }

  function savePlace(place) {
    AppStorageService.savePlace({
      id: place.place_id,
      saved: true
    });
  }



  return {
    deleteAllPlaces: deleteAllPlaces,
    deletePlace: deletePlace,
    getLastSearch: getLastSearch,
    getNextPageToken: getNextPageToken,
    getSavedPlaces: getSavedPlaces,
    savePlace: savePlace,
    getPlaces: getPlaces
  };

}

module.exports = PlaceFactory;
