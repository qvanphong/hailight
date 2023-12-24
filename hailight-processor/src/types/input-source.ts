export type InputSource = {
    fileName: string
    // in case upload to cloud storage, this will hold a link to download and process
    fileUrl?: string
    fileType: string
    content: string

    userId: string
    receiveFrom: "ui" | "email" | "upload" | "extension"
};