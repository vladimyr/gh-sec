'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');

exports.readConfigFile = () => {
  const configPath = findConfigPath();
  if (!configPath) throw new Error('Error: Config file not found');
  return yaml.safeLoad(fs.readFileSync(configPath, 'utf-8'));
};

function findConfigPath() {
  const configDir = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
  const configPath = path.join(configDir, 'hub');
  return fs.existsSync(configPath) && configPath;
}
