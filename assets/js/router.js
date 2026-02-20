(function() {
  'use strict';

  var Router = {
    routes: {
      '/projects/voting-system': 'portfolio-details.html?project=voting-system',
      '/projects/dry-eye': 'portfolio-details.html?project=dry-eye',
      '/projects/certichain': 'portfolio-details.html?project=certichain',
      '/projects/aura-music': 'portfolio-details.html?project=aura-music'
    },

    getBasePath: function() {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        if (src.indexOf('router.js') !== -1) {
          return src.replace(/assets\/js\/router\.js.*$/, '');
        }
      }
      return window.location.origin + '/';
    },

    navigate: function(path) {
      var basePath = this.getBasePath();
      window.location.href = basePath + path;
    },

    handleRoute: function() {
      var path = window.location.pathname;
      var basePath = this.getBasePath().replace(window.location.origin, '');
      
      path = path.replace(basePath, '/');
      
      if (path.charAt(0) !== '/') {
        path = '/' + path;
      }

      for (var route in this.routes) {
        if (path === route || path === route + '/') {
          this.navigate(this.routes[route]);
          return true;
        }
      }
      return false;
    },

    generateProjectUrl: function(projectId) {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'portfolio-details.html?project=' + projectId;
      }
      return 'portfolio-details.html?project=' + projectId;
    },

    init: function() {
      this.handleRoute();
    }
  };

  window.Router = Router;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      Router.init();
    });
  } else {
    Router.init();
  }
})();
