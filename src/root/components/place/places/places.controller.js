function PlacesController(PlaceFactory, $state) {
  var ctrl = this;

  ctrl.$onInit = function onInit() {
    ctrl.state = {};

    if (ctrl.places.error) {
      ctrl.state.error = true;
      ctrl.error = ctrl.places;
    } else {
      ctrl.state.success = true;
    }

    ctrl.hasPlaces = ctrl.places.length > 0;

    ctrl.hasPageToken = PlaceFactory.getNextPageToken() !== null;

  };

  ctrl.savePlace = function savePlace(event) {
    PlaceFactory.savePlace(event.place);
  };

  ctrl.nextPlaces = function nextPlaces() {
    var lastSearch = PlaceFactory.getLastSearch();

    lastSearch.pageToken = PlaceFactory.getNextPageToken();

    PlaceFactory.getPlaces(lastSearch)
      .then(function(morePlaces) {
        ctrl.places = ctrl.places.concat(morePlaces);
      })
  }
}

module.exports = PlacesController;
