'use strict';

unipaper.controller('writeForUsController', function($scope, contentful, environmentVariables, $rootScope, utilityFactory, $window) {
  $rootScope.showContent = false;
  $scope.topStoriesContent = {horizontalModule1: {}, horizontalModule2: {}, horizontalModule3: {}, horizontalModule4: {}};
  $window.prerenderReady = false;

  var getTopStories = function() {
    contentful
      .entries("content_type=article&include=2&limit=5&order=-fields.boost&fields.city.sys.id=" + utilityFactory.getCityIdFromName('national'))
      .then(function(response) {
        fillTopStoriesContent(response.data.items);
      });
  };

  var fillTopStoriesContent = function(topStoriesContentRaw) {
    var count = 0;
    for(var aModule in $scope.topStoriesContent) {
      var anArticle = topStoriesContentRaw[count];
      if(anArticle === undefined) continue;
      $scope.topStoriesContent[aModule] = {
        id: anArticle.sys.id,
        headline: anArticle.fields !== undefined ? anArticle.fields.title : '',
        writerAndDate: utilityFactory.getWriterFullNameForModules(anArticle),
        image: utilityFactory.getImageUrlForAStory(anArticle),
        type: anArticle.sys.contentType.sys.id,
        slug: anArticle.fields !== undefined && anArticle.fields.urlSlug !== undefined && anArticle.fields.urlSlug !== '' ? anArticle.fields.urlSlug : anArticle.sys.id
      };
      count++;
    }
    $rootScope.showContent = true;
    fillMetaTags();
    $window.prerenderReady = true;
  };

  var fillMetaTags = function() {
    $rootScope.metaTags = {
      title: "Write for us - The University Paper",
    };
  };

  /**
    * hubSpotInitialTrackCompleted will have the value 1 if this page is the initial load of the website
    */
  if (hubSpotInitialTrackCompleted === undefined) {
    var _hsq = window._hsq = window._hsq || [];
    _hsq.push(['setPath', '/write-for-us']);
    _hsq.push(['trackPageView']);
  } else {
    hubSpotInitialTrackCompleted = undefined;
  }

  var fillMetaTags = function() {
    $rootScope.metaTags = {
      title: "Write for us - The University Paper",
    };
  };

  /**
    * This listener listens to event 'initialized' broadcasted from mainLayoutController after initializing environment
    */
  $scope.$on('initialized', function(event) {
    getTopStories();
  });

  /**
    * For functions that require the partial's content to be loaded
    */
  $scope.$on('$viewContentLoaded', function(event) {
    utilityFactory.executeAdTags();
    $rootScope.pageViewForGoogleAnalytics();
  });

  /**
    * This block checks if the environment is already initialized when the partial loads. If not nothing happens
    * and the view waits for the 'initialized' event to be broadcasted
    */
  if($rootScope.environmentInitialized === true) {
    getTopStories();
  }
});
