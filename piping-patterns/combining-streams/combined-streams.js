import combine from "stream-combiner2";
import { CreateCSVParserStream } from "./csv-parser-stream.js";
import { createDataFilterStream } from "./data-filter-stream.js";
import { createJSONTransformerStream } from "./json-transformer-stream.js";

export function createCombinedStream(criteria) {
    return combine(
        CreateCSVParserStream(),
        createDataFilterStream(criteria),
        createJSONTransformerStream()
    )
}