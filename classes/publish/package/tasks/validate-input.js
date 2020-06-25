/* eslint-disable max-classes-per-file */

'use strict';

const { parse } = require('path');
const { validators } = require('@eik/common');
const Task = require('./task');

class ValidationError extends Error {
    constructor(message, err) {
        let m = message;
        if (err && err.message) m += `: ${err.message}`;
        super(m);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = class ValidateInput extends Task {
    process(incoming = {}, outgoing = {}) {
        const { log } = this;
        const { cwd, server, name, js, css, map, dryRun, version } = incoming;

        log.debug('Validating input');

        try {
            log.debug(`  ==> cwd: ${cwd}`);
            parse(cwd);
        } catch (err) {
            throw new ValidationError('Parameter "cwd" is not valid', err);
        }

        try {
            log.debug(`  ==> server: ${server}`);
            validators.origin(server);
        } catch (err) {
            throw new ValidationError(`Parameter "server" is not valid`, err);
        }

        try {
            log.debug(`  ==> name: ${name}`);
            validators.name(name);
        } catch (err) {
            throw new ValidationError('Parameter "name" is not valid', err);
        }

        try {
            log.debug(`  ==> version: ${version}`);
            validators.version(version);
        } catch (err) {
            throw new ValidationError('Parameter "version" is not valid', err);
        }

        log.debug(`  ==> at least 1 of js or css: ${!!js || !!css}`);
        if (!js && !css) {
            throw new ValidationError(
                'At least one of "js" or "css" must be provided',
            );
        }

        log.debug(`  ==> js: ${JSON.stringify(js)}`);
        if (js && typeof js !== 'string' && typeof js !== 'object') {
            throw new ValidationError('Parameter "js" is not valid');
        }

        log.debug(`  ==> css: ${JSON.stringify(css)}`);
        if (css && typeof css !== 'string' && typeof css !== 'object') {
            throw new ValidationError('Parameter "css" is not valid');
        }

        log.debug(`  ==> map: ${JSON.stringify(map)}`);
        if (!Array.isArray(map)) {
            throw new ValidationError('Parameter "map" is not valid');
        }

        log.debug(`  ==> dryRun: ${dryRun}`);
        if (dryRun && dryRun !== true && dryRun !== false) {
            throw new ValidationError('Parameter "dryRun" is not valid');
        }

        return outgoing;
    }
};
