/// <reference path="decl/node.d.ts" />
/// <reference path="decl/request.d.ts" />
import query = require('querystring')
import url = require('url')
import { IncomingMessage as ServerRequest, ServerResponse, createServer } from 'http';
import * as he from './hookEvents'
import { BotResponseFactory, IBotResponse } from './responses'
import request = require('request')

export interface BotOptions {
    pageToken: string
    verifyToken: string
}

declare type EventCallback = (arg: IBotResponse) => void

export class Bot {
    private options: BotOptions

    public constructor(options: BotOptions) {
        this.options = options
    }

    public wakeUp() {
        request({
            method: 'POST',
            uri: `https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=${this.options.pageToken}`,
        }, (err, res, body) => {
            console.log(body)
        })
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
                resp.end()
            }
        }
    }

    private validate(req: ServerRequest, resp: ServerResponse) {
        let params = query.parse(url.parse(req.url).query)
        if (params['hub.mode'] === 'subscribe' && params['hub.verify_token'] === this.options.verifyToken) {
            resp.statusCode = 200
            resp.end(params['hub.challenge'])
            console.log('validation: ok')
        } else {
            resp.statusCode = 403
            resp.end()
            console.log('validation: fail')
        }
    }

    private parseMessagingEvent(req: ServerRequest, resp: ServerResponse) {
        let data = ''
        console.log('start parse')
        req.on('data', (chunk) => {
            data += chunk
        })
        req.on('end', () => {
            //integrity check
            resp.statusCode = 200
            resp.end()
            console.log('hpayload')
            this.handlePayload(JSON.parse(data))
            //console.log(data)
            console.log('message receive: ok')
        })
        req.on('error', () => {
            resp.statusCode = 500
            resp.end()
            console.log('message receive: fail')
        })
    }

    private handlePayload(json: any) {

        json.entry.forEach(element => {
            element.messaging.forEach(m => {
                this.messageHandlerCallback(m)
            })
        })
    }

    private messageHandlerCallback(message: any) {
        let hMessage = new he.HookMessage(message)
        let bot = this
        let callback = function (arg: IBotResponse): void {
            request({
                method: 'POST',
                uri: 'https://graph.facebook.com/v2.6/me/messages',
                qs: {
                    access_token: bot.options.pageToken
                },
                json: arg
            }, (err, res, body) => {
                console.log('responded')
            })
        }
        console.log('call handler')
        this.messageHandler(message, new BotResponseFactory(hMessage.sender), callback)
    }

    messageHandler: (message: he.HookMessage, factory: BotResponseFactory, completionHandler: EventCallback) => void
}
