import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
import queryString from 'query-string';


  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {
    const queryParams = queryString.parse(req.url.split('?')[1]);
    let image_url = queryParams.image_url;

    if (!image_url) {
      return res.status(400).send(`URL of the image is required as query param. 
      Follow this format: /filteredimage?image_url={{URL}}`)
    }

    try {
      const filtered_image_path = await filterImageFromURL(image_url);

      if (!filtered_image_path) {
        return res.status(404).send(`Image not found`);
      }

      res.status(200).sendFile(filtered_image_path, (err) => {
        if (err) {
          return res.status(500).send("Error sending the file");
        }

        deleteLocalFiles([filtered_image_path]);
      });
    } catch (error) {
      res.status(500).send("Error processing the image");
    }
  });

  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
