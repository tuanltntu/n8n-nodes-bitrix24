const { src, dest, series } = require('gulp');

function copyNodeIcons() {
  return src('nodes/**/*.svg').pipe(dest('dist/nodes'));
}

function copyIconsToCredentials() {
  return src('nodes/**/*.svg').pipe(dest('dist/credentials'));
}

exports['build:icons'] = series(copyNodeIcons, copyIconsToCredentials); 