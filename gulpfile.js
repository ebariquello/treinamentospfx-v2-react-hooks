'use strict';
if (process.argv.indexOf('dist') !== -1)
  process.argv.push('--ship');


const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const merge = require('webpack-merge');
const webpack = require('webpack');
const gulpSequence = require('gulp-sequence');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class '-reverse' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class '-webkit-filter' is not camelCase and will not be type-safe.`);

gulp.task('dist', gulpSequence('clean', 'bundle', 'package-solution'));


build.configureWebpack.setConfig({
  additionalConfiguration: function (config) {
      let isDevelopment = (process.argv.indexOf('--production') || process.argv.indexOf('--cstprod'))!== -1?false: true; //process.env.NODE_ENV === 'DEVELOPMENT' ;
      let defineOptions;
     
      if (isDevelopment) {
          console.log('***********    Applying development settings to webpack *********************');
          defineOptions = {
              '_AzureClientID_': JSON.stringify('46e8afc6-5724-4e26-92e2-770b34f17786'),
              '_AzureEnv_' : JSON.stringify('QA')
          }
      } else {
          console.log('***********    Applying production settings to webpack *********************');
          // specify production keys here
          defineOptions = {
              '_AzureClientID_': JSON.stringify('f798ce07-f422-4b6e-ad4d-521eb98cca66'),
              '_AzureEnv_' : JSON.stringify('PRD')
          }
      }

      return merge(config, {
          plugins: [
              new webpack.DefinePlugin(defineOptions)
          ]
      });
  }
});



build.initialize(gulp);
