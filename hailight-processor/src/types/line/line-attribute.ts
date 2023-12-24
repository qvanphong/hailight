import {LineSignatureType} from "./line-signature";

export class LineAttribute {
    isNoteHeading: boolean;
    isTitle: boolean;
    isSectionHeading: boolean;
    isText: boolean;
    isAuthor: boolean;

    constructor() {
        this.isNoteHeading = false;
        this.isTitle = false;
        this.isSectionHeading = false;
        this.isText = false;
        this.isAuthor = false;
    }

    reset(): void {
        this.isNoteHeading = false;
        this.isTitle = false;
        this.isSectionHeading = false;
        this.isText = false;
        this.isAuthor = false;
    }

    lineHasAttribute(): boolean {
        return this.isNoteHeading || this.isTitle || this.isSectionHeading || this.isText || this.isAuthor;
    }

    updateLineAttribute(lineSignature: LineSignatureType): void {
        switch (lineSignature) {
            case "author":
                this.isAuthor = true;
                break;
            case "noteHeading":
                this.isNoteHeading = true;
                break;
            case "noteText":
                this.isText = true;
                break;
            case "sectionHeading":
                this.isSectionHeading = true;
                break;
            case "title":
                this.isTitle = true;
                break;
            default:
                break;
        }
    }
}