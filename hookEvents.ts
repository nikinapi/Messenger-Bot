export class HookEventBase {
    sender: string
    recipient: string

    constructor(rawData: any) {
        this.sender = rawData.sender.id
        this.recipient = rawData.recipient.id
    }
}

export interface IMessagePayload {
    mid: string
    seq: number
    text?: string
    attachments?: [IMessageAttachment]
    quickReplyPayload?: string
}

export interface IMessageAttachment {
    type: string
    url?: string
    coordsLat?: number
    coordsLon?: number
}

export class HookMessage extends HookEventBase {
    payload: IMessagePayload

    constructor(rawData: any) {
        super(rawData)
        let msgRaw = rawData.message
        this.payload = {
            mid: msgRaw.mid as string,
            seq: msgRaw.seq as number
        }
        if (msgRaw.text) {
            this.payload.text = msgRaw.text
        }
        if (msgRaw.attachments) {
            this.payload.attachments = msgRaw.attachments.map(item => {
                let res: IMessageAttachment = { type: item.type }
                if (res.type === 'location') {
                    res.coordsLat = item.payload.coordinates.lat
                    res.coordsLon = item.payload.coordinates.long
                } else {
                    res.url = item.payload.url
                }
                return res
            })
        }
    }
}

export class HookPostback extends HookEventBase {
    payload: string

    constructor(rawData: any) {
        super(rawData)
        this.payload = rawData.postback.payload
    }
}

// export class HookAuthentication extends HookEventBase {

// }

// export class HookAccountLinking extends HookEventBase {

// }

export class HookMessageDelivery extends HookEventBase {
    mids: [string]

    constructor(rawData: any) {
        super(rawData)
        this.mids = rawData.delivery.mids
    }
}

export class HookMessageRead extends HookEventBase {
    seq: number
    watermark: number

    constructor(rawData: any) {
        super(rawData)
        this.seq = rawData.read.seq
        this.watermark = rawData.read.watermark
    }
}

export class HookMessageEcho extends HookMessage {
    constructor(rawData: any) {
        super(rawData)
    }
}

export class HookMessageQuickReply extends HookMessage {
    quickReplyPayload: string

    constructor(rawData: any) {
        super(rawData)
            this.quickReplyPayload = rawData.message.quick_reply.payload
    }
}