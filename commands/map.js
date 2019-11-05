'use strict';

const ora = require('ora');
const { readFileSync } = require('fs');
const Map = require('../classes/publish/map');
const { resolvePath, logger } = require('../utils');

exports.command = 'map <name> <version> <file>';

exports.aliases = ['m'];

exports.describe = `Upload an import map file to the server under a given name and version.`;

exports.builder = yargs => {
    const assetsPath = resolvePath('./assets.json').pathname;
    const assets = JSON.parse(readFileSync(assetsPath));

    yargs
        .positional('name', {
            describe: 'Import map name.',
            type: 'string',
        })
        .positional('version', {
            describe: 'Import map version.',
            type: 'string',
        })
        .positional('file', {
            describe:
                'Path to import map file on local disk relative to the current working directory.',
            type: 'string',
            normalize: true,
        });

    yargs.options({
        server: {
            alias: 's',
            describe: 'Specify location of asset server.',
            default: assets.server || '',
        },
        cwd: {
            alias: 'c',
            describe: 'Alter current working directory.',
            default: process.cwd(),
        },
        org: {
            alias: 'o',
            describe: 'Provide the organisation context for the command.',
            default: assets.organisation || '',
        },
        debug: {
            describe: 'Logs additional messages',
            default: false,
            type: 'boolean',
        },
    });
};

exports.handler = async argv => {
    const spinner = ora().start('working...');
    let success = false;
    const { debug } = argv;

    try {
        success = await new Map({
            logger: logger(spinner, debug),
            ...argv,
        }).run();
    } catch (err) {
        spinner.warn(err.message);
    }

    if (success) {
        spinner.text = '';
        spinner.stopAndPersist();
    } else {
        spinner.text = '';
        spinner.stopAndPersist();
        process.exit(1);
    }
};
