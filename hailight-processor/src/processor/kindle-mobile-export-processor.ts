import {type Processor} from "./processor";
import {type InputSource} from "../types/input-source";
import {Highlight} from "../types/highlight/highlight";
import {lineSignature, VariableConstant} from "../consts/variable-constant";
import {LineSignature} from "../types/line/line-signature";
import {LineAttribute} from "../types/line/line-attribute";
import {BookInfo, HighlightSource} from "../types/highlight/highlight-source";

export class KindleMobileExportProcessor implements Processor {

    isSupport(inputSource: InputSource): boolean {
        if ((inputSource.receiveFrom !== "upload" && inputSource.receiveFrom !== "email")  // not from email or upload
            || (VariableConstant.fileType.html !== inputSource.fileType)) { // is not HTML
            return false;
        }

        const beginFileDeclaration = inputSource.content.substring(0, 500);
        let matchedKindleFileSignature = 0;

        const regexSignatures = Object.keys(VariableConstant.fileSignature.kindle)
            .map((signatureValue) => VariableConstant.fileSignature.kindle[signatureValue])
            .join("|");

        const regExp = new RegExp(`(${regexSignatures})`, "gi");
        beginFileDeclaration.replace(regExp, () => {
            matchedKindleFileSignature += 1; 
            return "_";
        });

        return matchedKindleFileSignature === Object.keys(VariableConstant.fileSignature.kindle).length;
    }

    process(inputSource: InputSource): Highlight[] {
        const lines = inputSource.content.split("\n");

        if (lines.length === 0)
            return [];

        const highlights: Highlight[] = [];
        const bookInfo: BookInfo = {title: "", author: ""};
        const source: HighlightSource = {
            isOwnDocument: false,
            receiveFrom: inputSource.receiveFrom,
            sourceName: "Kindle",
            userId: "",
            bookInfo
        };

        const nextLineAttribute = new LineAttribute();
        const kindleLineSignatures = this.getKindleLineSignatures();
        let currentHighlight = this.createEmptyHighlight(source);

        for (let line of lines) {
            const thisLineAttribute = nextLineAttribute;

            if (line.charAt(0) === " ") {
                line = line.trim();
            }

            // from the highlights of recognize
            if (!thisLineAttribute.lineHasAttribute()) {
                this.recognizeLineType(kindleLineSignatures, line, nextLineAttribute);
                continue;
            }

            if (thisLineAttribute.isTitle) {
                bookInfo.title = line;
            } else if (thisLineAttribute.isAuthor) {
                bookInfo.author = line;
            } else if (thisLineAttribute.isSectionHeading) {
                currentHighlight.sectionName = line;
            } else if (thisLineAttribute.isNoteHeading) {
                currentHighlight.noteHeading = line;
                let highlightAtPageNumber = undefined;
                if ((highlightAtPageNumber = this.extractPageNumber(line)) !== undefined) {
                    currentHighlight.pageIndex = highlightAtPageNumber;
                }

            } else if (thisLineAttribute.isText) {
                currentHighlight.content = line;
                currentHighlight.hash = line;

                highlights.push(currentHighlight);
                const currentSectionName = currentHighlight.sectionName;

                currentHighlight = this.createEmptyHighlight(source);
                currentHighlight.sectionName = currentSectionName;
            }

            nextLineAttribute.reset();
        }

        return highlights;
    }

    private createEmptyHighlight(source: HighlightSource) {
        const emptyHighlight = new Highlight();
        emptyHighlight.source = source;

        return emptyHighlight;
    }

    private getKindleLineSignatures() {
        const kindleLineSignatureObj = lineSignature.kindle;

        return Object.keys(kindleLineSignatureObj)
            .map((key) => kindleLineSignatureObj[key]);
    }

    private recognizeLineType(kindleLineSignatures: LineSignature[],
                              lineContent: string,
                              nextLineAttribute: LineAttribute) {
        for (const lineSignature of kindleLineSignatures) {
            if (lineContent.startsWith(lineSignature.value)) {
                nextLineAttribute.updateLineAttribute(lineSignature.type);
            }
        }
    }

    private extractPageNumber(lineContent: string): number | undefined {
        const matchedNumberInLine = lineContent.match(/(\d+)/g);
        if (matchedNumberInLine) {
            return Number(matchedNumberInLine[0]);
        }

        return undefined;
    }
}