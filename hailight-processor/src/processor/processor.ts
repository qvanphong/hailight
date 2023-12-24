import {type Highlight} from "../types/highlight/highlight";
import {type InputSource} from "../types/input-source";

export interface Processor {
    isSupport(inputSource: InputSource): boolean;
    process(inputSource: InputSource): Highlight[];
}