import {type HighlightSource} from "./highlight-source";
import {type HighLightNote} from "./highlight-note";
import {TimeHelper} from "../../helper/time-helper";

export class Highlight {
    content: string;
    hash: string;
    createdDate: number;
    lastUpdateDate?: number;
    pageIndex?: number;

    sectionName?: string;
    noteHeading?: string;

    note?: HighLightNote;
    source?: HighlightSource;


    constructor() {
        this.createdDate = TimeHelper.getUnixTimestamp();
        this.hash = "";
        this.content = "";
        this.sectionName = "";
    }
}