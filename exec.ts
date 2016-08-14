/// <reference path="decl/node.d.ts" />

import https = require('https')
import fs = require('fs')
import { BotOptions, Bot } from './bot'
import * as resp from './responses'

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
bot.messageHandler = function(message, factory) {
    console.log(message)
    if (message.payload.attachments) {
        message.payload.attachments.forEach( m => { console.log(m) })
    }
    // factory.text('wake up, Neo')
    let els = new Array<resp.IGenericElement>()
    for (var i = 0; i < 10; i++) {
        els[i] = {
            title: "qwer",
            subtitle: "qwe"
        }
    }
    // factory.generic(els)
    // let bs = new Array<resp.IResponseButton>()
    // bs[0] = new resp.ResponsePostbackButton("qwer", "po")
    // factory.buttons('qwqw', bs)
    let spoody = 'https://lh3.googleusercontent.com/ScR7BB06u8KYT83XV3hgTtzuwgF89PVyBrg5qy-IDw3A9p3lBWsx4uT48xsc3K5Gj4ziZsEjZ7f2B3FYIWLwU4kNrIybx99QhT3lTVdfe7yRv3pKeT6p7x2LpaUiIoRfbfBum6q-mqHcuWtfaZ3ZB2lR2qwOlNGiGwvCRlyZM64B5aMln1ftVVNf-hlUtUoudk-1FMk0npmz7BJh6LSG62fKjvq4rO9oUW6CQz_cu2DPl69QnjxOkAK8LPWAmhrhVcX63AWcGFeo5zIgOwF-74i10MUsxxlXYuOQhrikzOe24jLvV5hPiomorNz-u-u3J15-oXdTNPhtQFy-p_DrHJLmfvjXkM9QnUcRLUTy2akFZW4e2M4bi1EKKad-AqkaydZHvF1Sa0oz8JE2KO5uAuvquVqvcV5LPoJ7guOUvdOxKHiQ75rCpOvuLiX3WFyohl9EnHeHVZsIhXbv5LJ4T6Kvup5cBqgmLzKh5J_hB0wqG05sp9yCMD2h4KKc5j_Rwquww1KO3rOlBWsE79Og-QvYt0XoiW07_YI5Qq3X89CUiAK4G0Z_q7CTxqBgbXvIYyXPZSS41tdRqmynS5Qae3HtUaMroaU=w297-h207-no'
    // factory.attachmentFile(resp.AttachmentType.caseImage, './spoody.jpg')
    // factory.attachment(resp.AttachmentType.caseImage, spoody)
    let q = [new resp.ResponseQuickReply('red', 'P_RED'), new resp.ResponseQuickReply('blue', 'P_BLUE')]
    // factory.quick('red or blue', q)
    // factory.quickImage(spoody, q)
    factory.quickGeneric(els, q)
}
bot.messageEchoHandler = function(message, factory) {
    console.log(message)
}
bot.postbackHandler = function(message, factory) {
    console.log(message)
    factory.senderAction(resp.ResponseSenderAction.caseTypingOff)
}
bot.deliveryHandler = function(message, factory) {
    console.log(message)
}
bot.readHandler = function(message, factory) {
    console.log(message)
}
bot.messageQuickReplyHandler = function(message, factory) {
    console.log(message)
}

https.createServer(serverOptions, bot.handler()).listen(8000)
