import { createServer } from "http";
import { stat, createReadStream, createWriteStream } from "fs";
import { promisify } from "util";
import multiparty from "multiparty";

const fileName = "./the-universe.mp4";
const fileInfo = promisify(stat);

const responseWithVideoStream = async (req, res) => {
    const { size } = await fileInfo(fileName);

    // range requests to ask for a specific part of the file
    // example of range header: bytes=11272192-
    const range = req.headers.range;
    
    if(range) {
        let [start, end] = range.replace(/bytes=/, '').split("-");
        start = parseInt(start);
        end = end ? parseInt(end) : size -1;
        res.writeHead(206, { 
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Range': 'bytes',
            'Content-Length': (end-start) +1,
            'content-type': 'video/mp4',
        });
        createReadStream(fileName, { start, end }).pipe(res);
    } else {
        res.writeHead(200, { 'content-length': size , 'content-type': 'video/mp4'});
        createReadStream(fileName).pipe(res);
    }
}


createServer((req, res) => {
    if(req.method === 'POST') {
        // serve the file back to the client for it to appear in the browser
        // req.pipe(res);
        // store the uploaded file in the local directory
        // req.pipe(createWriteStream('./test-upload.file'));

        const form = new multiparty.Form();
        form.on("part", (part) => {
            part.pipe(createWriteStream(`./${part.filename}`))
            .on("close", () => {
            res.writeHead(200, { 'content-type': 'text/html' });
            res.end(`<h1>${part.filename} was uploaded</h1>`)
        })
        })
        form.parse(req);
    } else if(req.url === '/video') {
        responseWithVideoStream(req, res);
    } else {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.end(`
            <form enctype="multipart/form-data" method="POST" action="/">
                <input type="file" name="upload-file"/>
                <button>Upload File</button>
            </form>
        `)
    }
}).listen(3000, () => console.log("server is running in 3000"));