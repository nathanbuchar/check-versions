#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const forEachAsync = require('for-each-async');
const request = require('request');
const semver = require('semver');
const { spawn } = require('child_process');
const { Spinner } = require('cli-spinner');

function checkNode(done) {
  const spinner = new Spinner();
  spinner.setSpinnerTitle('Checking Node version...');
  spinner.setSpinnerString(18);
  spinner.start();

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

          // Stop the spinner.
          spinner.stop(true);

          if (semver.lt(currentVersion, latestVersion)) {
            console.log(
              chalk.red(
                '✘ Node ' + chalk.underline(`v${currentVersion}`) + ' is out of date! ' +
                'Latest version: ' + chalk.underline(`v${latestVersion}`)
              )
            );
          } else {
            console.log(
              chalk.green(
                '✓ Node ' + chalk.underline(`v${currentVersion}`) + ' is the latest ' +
                'version.'
              )
            );
          }

          done();
        }
      });
    }
  });
}

function checkNpm(done) {
  const spinner = new Spinner();
  spinner.setSpinnerTitle('Checking npm version...');
  spinner.setSpinnerString(18);
  spinner.start();

  spawn('npm', ['--version']).stdout.on('data', data => {
    data = data.toString('utf8');

    if (!/command not found/.test(data)) {
      const currentVersion = data.toString('utf8').trim();

      request.get({
        url: 'https://registry.npmjs.com/npm/'
      }, (err, response, body) => {
        if (!err && response.statusCode === 200) {
          const latestVersion = JSON.parse(body)['dist-tags'].latest;

          // Stop the spinner.
          spinner.stop(true);

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

          done();
        }
      });
    }
  });
}

function checkGit(done) {
  const spinner = new Spinner();
  spinner.setSpinnerTitle('Checking git version...');
  spinner.setSpinnerString(18);
  spinner.start();

  spawn('git', ['--version']).stdout.on('data', data => {
    data = data.toString('utf8');

    if (!/command not found/.test(data)) {
      const versionString = data.toString('utf8');
      const currentVersion = versionString.substr(versionString.search(/(\d+\.){2}\d+/)).split(' ')[0].trim();

      request.get({
        url: 'https://api.github.com/repos/git/git/tags',
        headers: {
          'User-Agent': 'request'
        }
      }, (err, response, body) => {
        if (!err && response.statusCode === 200) {
          const tags = JSON.parse(body);
          const latestTag = tags[0];
          const latestVersion = latestTag.name.split('v')[1];

          // Stop the spinner.
          spinner.stop(true);

          if (semver.lt(currentVersion, latestVersion)) {
            console.log(
              chalk.red(
                '✘ Git ' + chalk.underline(`v${currentVersion}`) + ' is out of date! ' +
                'Latest version: ' + chalk.underline(`v${latestVersion}`)
              )
            );
          } else {
            console.log(
              chalk.green(
                '✓ Git ' + chalk.underline(`v${currentVersion}`) + ' is the latest ' +
                'version.'
              )
            );
          }

          done();
        }
      });
    }
  });
}

forEachAsync([checkNode, checkNpm, checkGit], (val, n, arr, next) => {
  val(next);
}, () => {
  // Done with all checks.
});
