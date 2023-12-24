export class TimeHelper {
    static getUnixTimestamp = () : number => {
        return new Date().getTime();
    };
}