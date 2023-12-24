import {type LineSignature} from "../types/line/line-signature";
export const VariableConstant : {[key: string]: any} = {
    fileType: {
        html: "html"
    },
    fileSignature: {
        kindle: {
            xmlDocumentTag: "<?xml version=\"1.0\"",
            docTypeTag: "<!DOCTYPE",
            dtdLink: "http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-strict.dtd",
            contentType: "application\/xhtml\\+xml",
        }
    }
};

export const lineSignature : {[key: string]: { [key: string]: LineSignature }} =  {
    kindle: {
        noteHeading: {value: "<div class=\"noteHeading\">", checkMethod: "startsWith", type: "noteHeading"},
        noteText: {value: "<div class=\"noteText\">", checkMethod: "startsWith", type: "noteText"},
        sectionHeading: {value: "<div class=\"sectionHeading\">", checkMethod: "startsWith", type: "sectionHeading"},
        bookTitle: {value: "<div class=\"bookTitle\">", checkMethod: "startsWith", type: "title"},
        author: {value: "<div class=\"authors\">", checkMethod: "startsWith", type: "author"},
    }
};