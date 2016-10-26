#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const forEachAsync = require('for-each-async');
const request = require('request');
const semver = require('semver');
const { spawn } = require('child_process');
const { Spinner } = require('cli-spinner');

/**
 * Extracts the semver-compliant version number from a given string.
 *
 * @param {string} string
 * @returns {string}
 */
function getVersionFromString(string) {
  const normalizedString = string.toString('utf8');
  const versionIndex = normalizedString.search(/(\d+\.){2}\d+/);
  const versionString = normalizedString.substr(versionIndex);
  const version = versionString.split(' ')[0].trim();

  return version;
}

/**
 * Checks the version of a given item.
 *
 * @param {Object} obj
 * @param {string} obj.name
 * @param {string} obj.binary
 * @param {string} obj.registry
 * @param {Function} obj.versionParser
 * @param {Function} done
 */
function checkVersion(obj, done) {
  try {
    spawn(obj.binary, ['--version']).stdout.on('data', data => {
      data = data.toString('utf8');

      if (!/command not found/.test(data)) {
        const spinner = new Spinner();
        const currentVersion = getVersionFromString(data);

        // Set up and start spinner.
        spinner.setSpinnerTitle(`Checking ${obj.name} version...`);
        spinner.setSpinnerString(18);
        spinner.start();

        request.get({
          url: obj.registry,
          headers: {
            'User-Agent': 'check-versions. See ' +
              'https://github.com/nathanbuchar/check-versions for more information'
          }
        }, (err, response, body) => {
          spinner.stop(true);

          if (err) {
            done(err);
          } else {
            if (response.statusCode === 200) {
              const data = JSON.parse(body);
              const latestVersion = obj.responseParser(data);

              done(null, {
                current: currentVersion,
                latest: latestVersion
              });
            } else {
              done(true);
            }
          }
        });
      }
    });
  } catch (err) {
    done(err);
  }
}

/**
 * Checks the versions for all given items.
 *
 * @param {Object[]} items
 * @param {Function} done
 */
function checkVersions(items, done) {
  forEachAsync(items, (item, n, arr, next) => {
    checkVersion(item, (err, versions) => {
      if (err) {
        console.log(
          chalk.yellow(
            'Something went wrong trying to check the latest version for ' +
            item.name + '.'
          )
        );
      } else {
        if (semver.lt(versions.current, versions.latest)) {
          console.log(
            chalk.red(
              '✘ (' + item.name + ') '  + chalk.underline(`v${versions.current}`) +
              ' is out of date! Latest version: ' +
              chalk.underline(`v${versions.latest}`)
            )
          );
        } else {
          console.log(
            chalk.green(
              '✓ (' + item.name + ') '  + chalk.underline(`v${versions.current}`) +
              ' is the latest version.'
            )
          );
        }
      }

      next();
    });
  }, done);
}

checkVersions([
  {
    name: 'Node',
    binary: 'node',
    registry: 'https://nodejs.org/dist/index.json',
    responseParser(obj) {
      const { version } = obj[0];
      const latestVersion = getVersionFromString(version);

      return latestVersion;
    }
  },
  {
    name: 'npm',
    binary: 'npm',
    registry: 'https://registry.npmjs.com/npm/',
    responseParser(obj) {
      const { latest } = obj['dist-tags'];
      const latestVersion = getVersionFromString(latest);

      return latestVersion;
    }
  },
  {
    name: 'Git',
    binary: 'git',
    registry: 'https://api.github.com/repos/git/git/tags',
    responseParser(obj) {
      const { name } = obj[0];
      const latestVersion = getVersionFromString(name);

      return latestVersion;
    }
  }
], () => {
  // Done with all checks.
});
