
export interface MEntry {
    id: string
    time: number
    messaging: Array<MMessage | MPostback>
}

export interface MMessaging {
    sender: string //id
    recepient: string
}

export interface MMessage extends MMessaging {
    mid: string
    seq: number
    text?: string
    attachment?: Array<MAttachment>
    quick_reply?: MQuickReply
}

export interface MAttachment {
    type: string
    payload: MMedia | MLocation
}

export interface MQuickReply {
    payload: string
}

export interface MMedia {
    url: string
}

export interface MLocation {
    //lat long
}

export interface MPostback extends MMessaging {

}