'use strict';

const resolvePath = require('./resolve-path');
const readAssetsJson = require('./read-assets-json');
const sendCommand = require('./send-command');
const parseInput = require('./parse-input');
const logger = require('./logger');
const calculateFileHash = require('./calculate-file-hash');
const calculateFilesHash = require('./calculate-files-hash');
const compareHashes = require('./compare-hashes');
const fetchLatestVersion = require('./fetch-latest-version');
const fetchPackageMeta = require('./fetch-package-meta');
const incrementSemverVersion = require('./increment-semver-version');
const readJSON = require('./read-json');
const writeJSON = require('./write-json');
const compressedSize = require('./compressed-size');
const Artifact = require('./artifact');
const Alias = require('./alias');
const getDefaults = require('./get-defaults');
const getCWD = require('./get-cwd');
const writeEikJSON = require('./write-eik-json');

module.exports = {
    resolvePath,
    readAssetsJson,
    sendCommand,
    parseInput,
    logger,
    calculateFileHash,
    calculateFilesHash,
    compareHashes,
    fetchLatestVersion,
    fetchPackageMeta,
    incrementSemverVersion,
    writeJSON,
    readJSON,
    compressedSize,
    Artifact,
    Alias,
    getDefaults,
    getCWD,
    writeEikJSON,
};
