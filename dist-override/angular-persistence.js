// gently stolen from: https://github.com/arthurtsang/api-designer/commit/2ad4f3e253b17fa95ea3ea012419d933b098d914
// just linted and indented
angular.module('ramlEditorApp')
.factory('APIStore', function($http, $q, config) {
  var service = {};
  var base = '/* @echo res */' || '';

  function errorFunction(data, status, headers, config) {
    alert(status + ': ' + data);
  }

  service.directory = function(path) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: base + 'files' + path,
      withCredentials: false
    }).success(function (data) {
      deferred.resolve(data);
    })
    .error(deferred.reject.bind(deferred));
    return deferred.promise;
  };

  service.load = function(path, name) {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: base + 'files' + path,
        withCredentials: false,
        transformResponse: function(data) { return data; }
      }).success(function(data) {
        deferred.resolve(data);
      })
      .error(deferred.reject.bind(deferred));
    return deferred.promise;
  };

  service.remove = function(path, name) {
    var deferred = $q.defer();
    $http({
      method: 'DELETE',
      data: '',
      url: base + 'files' + path,
      withCredentials: false
    }).success(function(data) {
      deferred.resolve();
    }).error(deferred.reject.bind(deferred));
    return deferred.promise;
  };

  service.rename = function(source, destination) {
    var deferred = $q.defer();
    $http({
      method: 'PUT',
      data: {
        rename: destination
      },
      url: base + 'files' + source,
      withCredentials: false
    }).success(function(data) {
      deferred.resolve();
    }).error(deferred.reject.bind(deferred));
    return deferred.promise;
  };

  service.createFolder = function(path) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      data: {
        type: 'folder'
      },
      url: base + 'files' + path,
      withCredentials: false
    }).success(function(data) {
      deferred.resolve();
    }).error(deferred.reject.bind(deferred));
    return deferred.promise;
  };

  service.save = function(path, contents) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      data: {
        type: 'file',
        content: contents
      },
      url: base + 'files/' + path,
      withCredentials: false
    }).success(function(data) {
      deferred.resolve();
    }).error(deferred.reject.bind(deferred));
    return deferred.promise;
  };

  service.supportsFolders = true;
  return service;
})
.run(function (APIStore, config, $window) {
  // Set APIStore as the filesystem to use
  config.set('fsFactory', 'APIStore');
  delete $window.RAML.Settings.proxy;
});
