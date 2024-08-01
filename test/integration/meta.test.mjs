import fastify from 'fastify';
import { promises as fs } from 'fs';
import os from 'os';
import { exec as execCallback } from 'child_process';
import { join, basename } from 'path';
import { test, beforeEach, afterEach } from 'tap';
import EikService from '@eik/service';
import Sink from '@eik/sink-memory';
import cli from '../../classes/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function exec(cmd) {
    return new Promise((resolve) => {
        execCallback(cmd, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr });
        });
    });
}

beforeEach(async (t) => {
    const memSink = new Sink();
    const server = fastify({ logger: false });
    const service = new EikService({ customSink: memSink });
    server.register(service.api());
    const address = await server.listen({
        host: '127.0.0.1',
        port: 0,
    });
    const folder = await fs.mkdtemp(join(os.tmpdir(), basename(__filename)));
    const eik = join(__dirname, '../../index.js');

    const token = await cli.login({
        server: address,
        key: 'change_me',
    });

    const assets = {
        name: 'scroll-into-view-if-needed',
        version: '2.2.24',
        type: 'npm',
        server: address,
        files: {
            'index.js': join(__dirname, './../fixtures/client.js'),
            'index.css': join(__dirname, './../fixtures/styles.css'),
        },
    };

    await fs.writeFile(join(folder, 'eik.json'), JSON.stringify(assets));

    const cmd = `${eik} package --token ${token} --cwd ${folder}`;
    await exec(cmd);

    t.context.server = server;
    t.context.address = address;
    t.context.folder = folder;
    t.context.token = token;
});

afterEach(async (t) => {
    await t.context.server.close();
});

test('eik meta', async (t) => {
    const eik = join(__dirname, '../../index.js');
    const cmd = `${eik} meta scroll-into-view-if-needed --cwd ${t.context.folder}`;

    const { error, stdout } = await exec(cmd);

    t.notOk(error);
    t.match(stdout, '::');
    t.match(stdout, 'NPM');
    t.match(stdout, 'scroll-into-view-if-needed');
    t.end();
});
