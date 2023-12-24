export type LineSignature = {
    value: string,
    checkMethod: string,
    type: LineSignatureType
};

export type LineSignatureType = "noteHeading" | "noteText" | "sectionHeading" | "title" | "author";