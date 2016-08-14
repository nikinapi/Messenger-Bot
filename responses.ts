/// <reference path="decl/request.d.ts" />

import request = require('request')
import fs = require('fs')

export interface IResponseButton {
    type: string
    title: string
    url?: string
    payload?: string
}

export class ResponseUrlButton implements IResponseButton {
    type = 'web_url'
    web_url: string

    constructor(public title: string, url: string) {
        this.web_url = url
    }
}

export class ResponsePostbackButton implements IResponseButton {
    type = 'postback'
    payload: string

    constructor(public title: string, postback: string) {
        this.payload = postback 
    }
}

export class ResponsePhoneNumberButton implements IResponseButton {
    type = 'phone_number'
    payload: string

    constructor(public title: string, phone: string) {
        this.payload = phone
    }
}

export interface IGenericElement {
    title: string
    subtitle?: string
    item_url?: string
    image_url?: string
    buttons?: [IResponseButton]
}

export class AttachmentType { 
    static caseImage = 'image'
    static caseAudio = 'audio'
    static caseVideo = 'video'
    static caseFile = 'file'
}

export class ResponseSenderAction {
    static caseMarkSeen: 'mark_seen'
    static caseTypingOn: 'typing_on'
    static caseTypingOff: 'typing_off'
}

export class ResponseQuickReply {
    content_type = 'text'
    constructor(public title: string, public payload: string) { }
}

export class BotResponseFactory {
    constructor(private recipient: string, private pageToken: string) { }

    senderAction(action: ResponseSenderAction) {
        let response = {
            'recipient': { id: this.recipient },
            'sender_action': action
        }
        this.makeRequest(response)
    }

    text(text: string) {
        let response = this.template()
        response.message = { text: text }
        this.makeRequest(response)
    }

    attachment(type: AttachmentType, url: string) {
        let response = this.template()
        response.message = {
            'attachment': {
                'type': type,
                'payload': {
                    'url': url
                }
            }
        }
        this.makeRequest(response)
    }

    attachmentFile(type: AttachmentType, path: string) {
        let response = this.template()
        response.message = {
            'attachment': {
                'type': type,
                'payload': { }
            }
        }
        this.makeRequest(response, path)
    }

    buttons(text: string, buttons: IResponseButton[]) {
        let response = this.template()
        response.message = {
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'button',
                    'text': 'What do you want to do next?',
                    'buttons': buttons
                }
            }
        }
        this.makeRequest(response)
    }

    generic(elements: IGenericElement[]) {
        let response = this.template()
        response.message = {
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': elements
                }
            }
        }
        this.makeRequest(response)
    }

    quick(text: string, options: ResponseQuickReply[]) {
        let response = this.template()
        response.message = {
            'text': text,
            'quick_replies': options
        }
        this.makeRequest(response)
    }

    quickImage(url: string, options: ResponseQuickReply[]) {
        let response = this.template()
        response.message = {
            'attachment': {
                'type': 'image',
                'payload': { 
                    'url': url
                }
            },
            'quick_replies': options
        }
        this.makeRequest(response)
    }

    quickImageFile(path: string, options: ResponseQuickReply[]) {
        let response = this.template()
        response.message = {
            'attachment': {
                'type': 'image',
                'payload': { }
            },
            'quick_replies': options
        }
        this.makeRequest(response, path)
    }

    quickGeneric(elements: IGenericElement[], options: ResponseQuickReply[]) {
        let response = this.template()
        response.message = {
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': elements
                }
            },
            'quick_replies': options
        }
        this.makeRequest(response)
    }

    //////

    private template() {
        return {
            'recipient': { id: this.recipient },
            'message': {}
        }
    }

    private makeRequest(arg: any, path?: string) {
        let options: any = {
            method: 'POST',
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                'access_token': this.pageToken
            }
        }
        let completion = (err, res, body) => {
            console.log(body)
            console.log('responded')
        }
        if (path) {
            console.log('streaming')
            arg.filedata = fs.createReadStream(path)
            options.form = arg
            request(options, completion)
        } else {
            options.json = arg
            request(options, completion)
        }
    }
}
