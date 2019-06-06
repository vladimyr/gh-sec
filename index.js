'use strict';

const path = require('path');
const pkg = require('./package.json');

const headers = { 'user-agent': path.join(pkg.name, pkg.version) };

const httpMethod = state => state ? 'PUT' : 'DELETE';
const request = require('gh-got').extend({ headers });

exports.toggleAutomatedSecurityFixes = (state, owner, repo, options = {}) => {
  const headers = { accept: 'application/vnd.github.london-preview+json' };
  const method = httpMethod(state);
  const url = path.join('/repos/', owner, repo, '/automated-security-fixes');
  return request({ ...options, method, url, headers });
};

exports.toggleVulnerabilityAlerts = (state, owner, repo, options = {}) => {
  const headers = { accept: 'application/vnd.github.dorian-preview+json' };
  const method = httpMethod(state);
  const url = path.join('/repos/', owner, repo, '/vulnerability-alerts');
  return request({ ...options, method, url, headers });
};
