import fs from "fs";
import axios from 'axios';
import Jimp from 'jimp';

export async function filterImageFromURL(inputURL) {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch the image data as a buffer
            const response = await axios({
                method: 'get',
                url: inputURL,
                responseType: 'arraybuffer'
            });

            // Ensure the Content-Type indicates an image
            const contentType = response.headers['content-type'];
            if (!contentType.startsWith('image/')) {
                throw new Error('The URL does not point to an image.');
            }

            // Load the image using Jimp from the buffer
            const photo = await Jimp.read(Buffer.from(response.data));

            // Process the image
            const outpath = "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
            await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(outpath, () => {
                    resolve(outpath);
                });
        } catch (error) {
            console.error("Error in filterImageFromURL:", error.message);
            reject(error);
        }
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
