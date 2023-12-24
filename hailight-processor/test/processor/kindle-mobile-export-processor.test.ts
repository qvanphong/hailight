import * as fs from "fs";
import * as path from "path";
import {InputSource} from "../../src/types/input-source";
import {KindleMobileExportProcessor} from "../../src/processor/kindle-mobile-export-processor";

describe("Kindle mobile export processor isSupport() tests", () => {
    const processor = new KindleMobileExportProcessor();

    it("Should support kindle file", () => {
        let testFilePath = "../resources/kindle-mobile-exported.html";

        path.resolve(__dirname, testFilePath);
        const fileName = path.basename(testFilePath);

        const content = fs.readFileSync(path.resolve(__dirname, testFilePath), "utf8");

        const inputSource: InputSource = {
            content: content,
            fileName: fileName,
            fileType: fileName.substring(fileName.lastIndexOf(".") + 1),
            receiveFrom: "upload",
            userId: ""
        };

        expect(processor.isSupport(inputSource)).toEqual(true);
    });

    it("Should not support file type other than html", () => {

        const inputSource: InputSource = {
            content: "content",
            fileName: "fileName",
            fileType: "htmlx",
            receiveFrom: "upload",
            userId: ""
        };

        expect(processor.isSupport(inputSource)).toEqual(false);
    });

    it("Should not support if file not receive from 'email' or 'upload'", () => {

        const inputSourceUI: InputSource = {
            content: "content",
            fileName: "fileName",
            fileType: "html",
            receiveFrom: "ui",
            userId: ""
        };

        const inputSourceExtension: InputSource = {
            content: "content",
            fileName: "fileName",
            fileType: "html",
            receiveFrom: "extension",
            userId: ""
        };

        expect(processor.isSupport(inputSourceUI)).toEqual(false);
        expect(processor.isSupport(inputSourceExtension)).toEqual(false);
    });
});

describe("Kindle mobile export processor highlight content tests", () => {
    const processor = new KindleMobileExportProcessor();
    let testFilePath = "../resources/kindle-mobile-exported.html";

    path.resolve(__dirname, testFilePath);
    const fileName = path.basename(testFilePath);
    const content = fs.readFileSync(path.resolve(__dirname, testFilePath), "utf8");

    const sections = [
        {name: "First Section", amountOfHighlight: 2},
        {name: "Second Section", amountOfHighlight: 2},
        {name: "Third Section", amountOfHighlight: 1},
        {name: "Fourth Section", amountOfHighlight: 1}
    ];
    const highlightContents = [
        {content: "This is first Highlight", highlightAtPage: 10},
        {content: "This is second Highlight", highlightAtPage: 13},
        {content: "(Second Section) This is first Highlight", highlightAtPage: 34},
        {content: "(Second Section) This is second Highlight", highlightAtPage: 65},
        {content: "(Third Section) This is first Highlight", highlightAtPage: 78},
        {content: "(Forth Section) This is second Highlight", highlightAtPage: 79}
    ];
    const totalHighlight = 6;

    it("Same amount of section from file and match amount of highlight in each section", () => {
        const inputSource: InputSource = {
            content: content,
            fileName: fileName,
            fileType: fileName.substring(fileName.lastIndexOf(".") + 1),
            receiveFrom: "upload",
            userId: ""
        };

        const highlights = processor.process(inputSource);
        const resultObj: { [key: string]: number } = {};
        highlights.map(highlight => highlight?.sectionName || "_")
            .forEach(sectionName => resultObj[sectionName] = !resultObj[sectionName] ? 1 : resultObj[sectionName] + 1);

        expect(Object.keys(resultObj).length).toEqual(sections.length);
        for (let section in sections) {
            // @ts-ignore
            expect(resultObj[section.name]).toEqual(section.amountOfHighlight);
        }
    });

    it("Same amount of highlight in book", () => {
        const inputSource: InputSource = {
            content: content,
            fileName: fileName,
            fileType: fileName.substring(fileName.lastIndexOf(".") + 1),
            receiveFrom: "upload",
            userId: ""
        };

        const highlights = processor.process(inputSource);

        expect(highlights.length).toEqual(totalHighlight);
    });

    it("Match content in file", () => {
        const inputSource: InputSource = {
            content: content,
            fileName: fileName,
            fileType: fileName.substring(fileName.lastIndexOf(".") + 1),
            receiveFrom: "upload",
            userId: ""
        };

        const highlights = processor.process(inputSource);
        let hasSomethingNotMatched = false;

        for (let index = 0; index < highlights.length; index++) {
            const highlight = highlights[index];
            if (highlight.content !== highlightContents[index].content) {
                hasSomethingNotMatched = true;
                break;
            }
        }

        expect(hasSomethingNotMatched).toEqual(false);
    });

    it("Match page number in file", () => {
        const inputSource: InputSource = {
            content: content,
            fileName: fileName,
            fileType: fileName.substring(fileName.lastIndexOf(".") + 1),
            receiveFrom: "upload",
            userId: ""
        };

        const highlights = processor.process(inputSource);
        let hasSomethingNotMatched = false;

        for (let index = 0; index < highlights.length; index++) {
            const highlight = highlights[index];
            if (highlight.pageIndex !== highlightContents[index].highlightAtPage) {
                console.warn("Highlight page index not match ", highlight.pageIndex, highlightContents[index].highlightAtPage);
                hasSomethingNotMatched = true;
                break;
            }
        }

        expect(hasSomethingNotMatched).toEqual(false);
    });
});

describe("Kindle mobile export processor highlight source tests", () => {
    const processor = new KindleMobileExportProcessor();
    let testFilePath = "../resources/kindle-mobile-exported.html";

    path.resolve(__dirname, testFilePath);
    const fileName = path.basename(testFilePath);
    const content = fs.readFileSync(path.resolve(__dirname, testFilePath), "utf8");

    const bookName = "33 Chiến Lược của Chiến tranh";
    const bookAuthor = "Robert Greene";

    const inputSource: InputSource = {
        content: content,
        fileName: fileName,
        fileType: fileName.substring(fileName.lastIndexOf(".") + 1),
        receiveFrom: "upload",
        userId: ""
    };


    it("Book info match", () => {

        const highlights = processor.process(inputSource);
        const bookInfo = highlights[0]?.source?.bookInfo;

        expect(bookInfo).not.toBeNull();
        expect(bookInfo?.title).toEqual(bookName);
        expect(bookInfo?.author).toEqual(bookAuthor);
    });

    it("Source name is 'Kindle'", () => {
        const highlights = processor.process(inputSource);
        const source = highlights[0]?.source;

        expect(source).not.toBeNull();
        expect(source?.sourceName).toEqual("Kindle");
    });

    it("receiveFrom equals to input source's receiveForm", () => {
        const highlights = processor.process(inputSource);
        const source = highlights[0]?.source;

        expect(source).not.toBeNull();
        expect(source?.receiveFrom).toEqual(inputSource.receiveFrom);
    });

    it("isOwnDocument always false", () => {
        const highlights = processor.process(inputSource);
        const source = highlights[0]?.source;

        expect(source).not.toBeNull();
        expect(source?.isOwnDocument).toEqual(false);
    });

});