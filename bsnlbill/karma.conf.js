// ------------------------------------------------------------------------
// Copyright © Siemens AG 2021-2021. All rights reserved. Confidential.
// ------------------------------------------------------------------------
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  try
  {
    const process = require('process');
    process.env.CHROME_BIN =   require('puppeteer').executablePath();
  }
  catch(ex)
  {
     console.log('puppeteer not installed');
  }
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser,
      jasmine : { 
        random : false
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/PlantViewUi'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml','coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.DEBUG,
    autoWatch: true,
    //browsers: ['Chrome'],
    browsers: ['Chrome','ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          //'--headless',
          //'--disable-gpu', 
          //'--remote-debugging-port-9222',
          '--no-sandbox'
        ]
      }
    },
    singleRun: false,
    restartOnFileChange: true
  });
};
