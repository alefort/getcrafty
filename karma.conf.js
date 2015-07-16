module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'app/public/bower_components/angular/angular.js',
      'app/public/bower_components/angular-route/angular-route.js',
      'app/public/bower_components/angular-mocks/angular-mocks.js',
      'app/public/components/**/*.js',
      'app/public/beer/**/*.js',
      'app/public/beer-search/**/*.js',
      'app/public/home/**/*.js',
      'app/public/store/**/*.js',
      'app/public/stores/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
