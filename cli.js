#!/usr/bin/env node

'use strict';

const kleur = require('kleur');
kleur.enabled = Boolean(process.stdout.isTTY);

const gitRemoteOriginUrl = require('git-remote-origin-url');
const parseGitUrl = require('github-url-from-git');
const pkg = require('./package.json');
const { readConfigFile } = require('./config');
const {
  toggleAutomatedSecurityFixes,
  toggleVulnerabilityAlerts
} = require('./');
const { URL } = require('url');

const formatError = msg => msg.replace(/^\w*Error:\s+/, match => kleur.red().bold(match));
const isFlag = str => /^--?/.test(str);

const commands = {
  'vulnerability-alerts': toggleVulnerabilityAlerts,
  alert: toggleVulnerabilityAlerts,
  'automated-security-fixes': toggleAutomatedSecurityFixes,
  autofix: toggleAutomatedSecurityFixes
};

const options = require('minimist-options')({
  help: { type: 'boolean', alias: 'h' },
  version: { type: 'boolean', alias: 'v' },
  enable: { type: 'boolean' },
  disable: { type: 'boolean' },
  unknown(input) {
    if (!isFlag(input)) return true;
    fail(`Error: Unknown option \`${input}\``);
  }
});
const argv = require('minimist')(process.argv.slice(2), options);

const help = `
  ${kleur.bold(pkg.name)} v${pkg.version}

  Commands:
    alert, vulnerability-alerts         toggle vulnerability alerts
    autofix, automated-security-fixes   toggle automated security fixes

  Usage:
    $ ${pkg.name} vulnerability-alerts [<owner/repo>] (--enable | --disable)
    $ ${pkg.name} automated-security-fixes [<owner/repo>] (--enable | --disable)

  Options:
    -h, --help      Show help
    -v, --version   Show version number

  Homepage:     ${kleur.green(pkg.homepage)}
  Report issue: ${kleur.green(pkg.bugs.url)}
`;

program(argv._, argv).catch(err => console.error(formatError(err.stack)));

async function program([command, repoId], flags) {
  if (flags.version) return console.log(pkg.version);
  if (flags.help) return console.log(help);
  if (!command) {
    return fail('Error: Command required!');
  }
  if (!Object.keys(commands).includes(command)) {
    return fail(`Error: Unknown command \`${command}\``);
  }
  const handler = commands[command];
  const state = readToggleState(flags);
  const token = readGithubToken();
  const [owner, repo] = await parseRepo(repoId);
  return handler(state, owner, repo, { token });
}

function readToggleState(flags) {
  if (!flags.enable && !flags.disable) {
    return fail('Error: Missing required flag!');
  }
  if (flags.enable === flags.disable) {
    return fail('Error: Invalid flag combination!');
  }
  return flags.enable;
}

function readGithubToken() {
  try {
    const config = readConfigFile();
    const auth = Array.isArray(config['github.com']) && config['github.com'][0];
    return auth && auth.oauth_token;
  } catch (err) {}
}

async function parseRepo(repoId) {
  if (!repoId) {
    const remoteUrl = await gitRemoteOriginUrl();
    const githubUrl = new URL(parseGitUrl(remoteUrl));
    repoId = githubUrl.pathname.replace(/^\//, '');
  }
  const [owner, repo] = repoId.split('/');
  if (!owner || !repo) return fail('Error: Invalid repo!');
  return [owner, repo];
}

function fail(message, code = 1) {
  message = formatError(message);
  console.error(message);
  process.exit(code);
}
