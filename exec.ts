/// <reference path="decl/node.d.ts" />

import https = require('https')
import fs = require('fs')
import { BotOptions, Bot } from './bot'
// import * as resp from './responses'

let serverOptions: https.ServerOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/sayhimedia.co/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/sayhimedia.co/fullchain.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/sayhimedia.co/chain.pem')
}

let botOptions: BotOptions = {
    pageToken: 'EAAaIJSFvMwwBANirh45w2HDTiVeZAipEZBCADdAZAZAEU30Gd8x6svCoQBaJmVG2Uqhm9oAiwEhvUdJNSOgVNp1tT82oiHerp3MpnI6kLSlvIFJnEGkgvRal1RQZBwc6AS2bai9aIR48a85grUoYgH26jTSmX8quBKey9Gb0m3gZDZD',
    verifyToken: 'le_token' 
}

let bot = new Bot(botOptions)
bot.wakeUp()
bot.messageHandler = function(message, factory, callback) {
    callback(factory.text('wake up, Neo'))
}

https.createServer(serverOptions, bot.handler()).listen(8000)
