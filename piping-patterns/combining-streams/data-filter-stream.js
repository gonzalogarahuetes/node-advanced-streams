import { Transform } from "node:stream";

export function createDataFilterStream(criteria) {
    return new Transform({
        objectMode: true,
        transform(record, encoding, callback) {
            if(meetsCriteria(record, criteria)) {
                this.push(record);
            }
            
            callback();
        }
    })

    function meetsCriteria(record, criteria) {
        return record.age >= criteria.minAge;
    }
}