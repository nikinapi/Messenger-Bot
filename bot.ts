/// <reference path="decl/node.d.ts" />
/// <reference path="decl/request.d.ts" />

import query = require('querystring')
import url = require('url')
import { IncomingMessage as ServerRequest, ServerResponse, createServer } from 'http';
import * as event from './hookEvents'
import { BotResponseFactory } from './responses'
import request = require('request')
import promise = require('bluebird')

export interface BotOptions {
    pageToken: string
    verifyToken: string
}

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
        req.on('data', (chunk) => {
            data += chunk
        })
        req.on('end', () => {
            //TODO: integrity check
            resp.statusCode = 200
            resp.end()
            this.handlePayload(JSON.parse(data))
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
                console.log(m)
                let responseFactory = new BotResponseFactory(m.sender.id, this.options.pageToken)
                if (m.message && m.message.is_echo) {
                    let arg = new event.HookMessageEcho(m)
                    this.messageEchoHandler(arg, responseFactory)
                } else if (m.message && m.message.quick_reply) {
                    let arg = new event.HookMessageQuickReply(m)
                    this.messageQuickReplyHandler(arg, responseFactory)
                } else if (m.message) {
                    let arg = new event.HookMessage(m)
                    this.messageHandler(arg, responseFactory)
                } else if (m.postback) {
                    let arg = new event.HookPostback(m)
                    this.postbackHandler(arg, responseFactory)
                } else if (m.delivery) {
                    let arg = new event.HookMessageDelivery(m)
                    this.deliveryHandler(arg, responseFactory)
                } else if (m.read) {
                    let arg = new event.HookMessageRead(m)
                    this.readHandler(arg, responseFactory)
                }
            })
        })
    }

    messageHandler: (message: event.HookMessage, factory: BotResponseFactory) => void
    messageEchoHandler: (message: event.HookMessageEcho, factory: BotResponseFactory) => void
    messageQuickReplyHandler: (message: event.HookMessageQuickReply, factory: BotResponseFactory) => void
    postbackHandler: (message: event.HookPostback, factory: BotResponseFactory) => void
    deliveryHandler: (message: event.HookMessageDelivery, factory: BotResponseFactory) => void
    readHandler: (message: event.HookMessageRead, factory: BotResponseFactory) => void
}
