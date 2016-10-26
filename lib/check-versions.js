#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const request = require('request');
const semver = require('semver');
const { spawn } = require('child_process');

spawn('npm', ['--version']).stdout.on('data', data => {
  data = data.toString('utf8');

  if (!/command not found/.test(data)) {
    const currentVersion = data.toString('utf8').trim();

    request.get({
      url: 'https://registry.npmjs.com/npm/'
    }, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        const latestVersion = JSON.parse(body)['dist-tags'].latest;

        if (semver.lt(currentVersion, latestVersion)) {
          console.log(
            chalk.red(
              '✘ npm ' + chalk.underline(`v${currentVersion}`) + ' is out of date! ' +
              'Latest version: ' + chalk.underline(`v${latestVersion}`)
            )
          );
        } else {
          console.log(
            chalk.green(
              '✓ npm ' + chalk.underline(`v${currentVersion}`) + ' is the latest ' +
              'version.'
            )
          );
        }
      }
    });
  }
});

spawn('node', ['--version']).stdout.on('data', data => {
  data = data.toString('utf8');

  if (!/command not found/.test(data)) {
    const currentVersion = data.toString('utf8').split('v')[1].trim();

    request.get({
      url: 'https://nodejs.org/dist/index.json'
    }, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        const releases = JSON.parse(body);
        const latestRelease = releases[0];
        const latestVersion = latestRelease.version.split('v')[1];

        if (semver.lt(currentVersion, latestVersion)) {
          console.log(
            chalk.red(
              '✘ node ' + chalk.underline(`v${currentVersion}`) + ' is out of date! ' +
              'Latest version: ' + chalk.underline(`v${latestVersion}`)
            )
          );
        } else {
          console.log(
            chalk.green(
              '✓ node ' + chalk.underline(`v${currentVersion}`) + ' is the latest ' +
              'version.'
            )
          );
        }
      }
    });
  }
});
