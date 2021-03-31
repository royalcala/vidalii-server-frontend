#!/usr/bin/env node
const path = require('path')
const yargs = require('yargs')
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');


yargs.command(
    'start', 'vidalii service frontend',
    (yargs) => {
        yargs
            .option('BACKEND_DNS', {
                type: 'string',
                default: 'localhost'
            })
            .option('BACKEND_PORT', {
                type: 'number',
                default: 4001
            })
            .option('PORT', {
                type: 'number',
                default: 4000
            })
    },
    async (args) => {
        const app = express();

        // app.use('/graphql', createProxyMiddleware({ target: 'http://www.example.org', changeOrigin: true }));
        app.use('/graphql', createProxyMiddleware({ target: `${args.BACKEND_DNS}:${args.BACKEND_PORT}`, changeOrigin: true }));
        app.use(express.static(path.join(__dirname, '../website/build')));

        app.get('/*', function (req, res) {
            res.sendFile(path.join(__dirname, '../website/build', 'index.html'));
        });

        app.listen(args.PORT);
        console.log(`listening on:http://localhost:${args.PORT}`)
    }
)
    .argv