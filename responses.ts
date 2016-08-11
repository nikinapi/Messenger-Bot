export interface IBotResponse { }

interface IResponseTemplate extends IBotResponse {
    recipient: IResponseRecipient
    message?: IResponseMessage
    sender_action?: ResponseSenderAction
}

interface IResponseRecipient {
    id: string
}

class ResponseSenderAction {
    static actionMarkSeen: 'mark_seen'
    static actionTypingOn: 'typing_on'
    static actionTypingOff: 'typing_off'
}

interface IResponseMessage {
}

class TextMessage implements IResponseMessage {
    constructor(public text: string) { }
}

export enum AttachmentType {
    image, audio, video, file
}

class AttachmentMessage implements IResponseMessage {
    attachment: any

    static withUrl(type: string, url: string) {
        let object = new AttachmentMessage()
        object.attachment = { type: type, payload: { url: url }}
        return object
    }

    static withFile(type: string, file: string) {
        let object = new AttachmentMessage()
        object.attachment = { type: type, payload: {}}
    }
}

class ButtonsMessage implements IResponseMessage {
    attachment: any

    constructor(text: string, buttons: IResponseButton[]) {
        this.attachment = {
            type: 'template',
            payload: {
                template_type: 'button',
                text: text,
                buttons: buttons
            }
        }
    }
}

// class ResponseAttachmentType {
//     static typeImage: 'image'
//     static typeAudio: 'audio'
//     static typeFile: 'file'
//     static typeTemplate: 'template'
// }

// interface IResponseAttachment {
//     type: ResponseAttachmentType
//     payload: IResponseAttachmentPayload
//     filepath?: string
// }

// class ResponseAttachmentFile implements IResponseAttachment {
//     payload: IResponseAttachmentPayload
//     constructor(public type: ResponseAttachmentType) {
//         this.payload = { }
//     }
// }

// class ResponseAttachmentUrl implements IResponseAttachment {
//     payload: IResponseAttachmentPayload
//     constructor(public type: ResponseAttachmentType, url: string) {
//         this.payload = { url: url }
//     }
// }

// class ResponseAttachmentTemplateType {
//     static typeButtons: 'buttons'
// }

// interface IResponseAttachmentPayload {
//     url?: string
//     template_type?: ResponseAttachmentTemplateType
//     text?: string
//     buttons?: IResponseButton[]
// }

export interface IResponseButton {
    type: string
    title: string
    url?: string
    payload?: string
}

export class ResponseUrlButton implements IResponseButton {
    type = 'web_url'
    web_url: string

    constructor(public title, url: string) {
        this.web_url = url
    }
}

export class ResponsePostbackButton implements IResponseButton {
    type = 'postback'
    payload: string

    constructor(public title, postback: string) {
        this.payload = postback 
    }
}

export class ResponsePhoneNumberButton implements IResponseButton {
    type = 'phone_number'
    payload: string

    constructor(public title, phone: string) {
        this.payload = phone
    }
}

interface Dictionary<T> {
    [key: string]: T
    [key: number]: T
}

let attachmentTypeToString: Dictionary<string> = {
    0: 'image',
    1: 'audio',
    2: 'video',
    3: 'file'
}

export class BotResponseFactory {
    constructor(private recipient: string) {
        this.recipient = recipient
    }

    text(text: string): IBotResponse {
        let response = this.template()
        response.message = new TextMessage(text)
        return response
    }

    attachment(type: AttachmentType, url: string): IBotResponse {
        let response = this.template()
        response.message = AttachmentMessage.withUrl(attachmentTypeToString[type], url)
        return response;
    }

    buttons(text: string, buttons: IResponseButton[]): IBotResponse {
        let response = this.template()
        response.message = new ButtonsMessage(text, buttons)
        return response
    }

    quick(): IBotResponse {
        return  {};
    }

    private template(): IResponseTemplate {
        return {
            recipient: { id: this.recipient },
            message: {}
        }
    }
}
