export type HighlightSource = {
    sourceName: HighlightSourceName
    isOwnDocument: boolean

    userId: string
    receiveFrom: "ui" | "email" | "upload" | "extension"

    bookInfo?: BookInfo
    webpageInfo?: WebpageInfo
};

export type BookInfo = {
    title: string
    author: string
    link?: string
    isbn?: string
};

export type WebpageInfo = {
    author: string
    title: string
    link: string
    origin: string
};

export type HighlightSourceName = "Kindle";