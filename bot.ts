/// <reference path="decl/node.d.ts" />
import query = require('querystring')
import url = require('url')

import { IncomingMessage as ServerRequest, ServerResponse, createServer } from 'http';

export interface BotOptions {
    pageToken: string
    verifyToken: string
}

export class Bot {
    private options: BotOptions

    public constructor(options: BotOptions) {
        this.options = options
    }

    public handler(): (ServerRequest, ServerResponse) => void {
        let bot = this
        return function (req: ServerRequest, resp: ServerResponse) {
            resp.setHeader('Content-Type', 'application/json')
            if (req.method === 'GET') {
                bot.validate(req, resp)
            } else if (req.method === 'POST') {
                bot.parseMessagingEvent(req, resp)
            } else {
                resp.statusCode = 400
            }
            resp.end()
        }
    }

    private validate(req: ServerRequest, resp: ServerResponse) {
        let params = query.parse(url.parse(req.url).query)
        if (params['hub.mode'] === 'subscribe' && params['hub.verify_token'] === this.options.verifyToken) {
            resp.statusCode = 200
            resp.write(params['hub.challenge'])
            console.log('validation: ok')
        } else {
            resp.statusCode = 403
            console.log('validation: fail')
        }
    }

    private parseMessagingEvent(req: ServerRequest, resp: ServerResponse) {
        let data = ''
        req.on('data', (chunk) => {
            data += chunk
        })
        req.on('end', () => {
            //integrity check
            this.handleMessage(JSON.parse(data))
            req.statusCode = 200
            console.log('message receive: ok')
        })
        req.on('error', () => {
            req.statusCode = 500
            console.log('message receive: fail')
        })
    }

    private handleMessage(json: any) {

    }
}
