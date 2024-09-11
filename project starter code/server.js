import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';


const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;


// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8080;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */

//! END @TODO1
app.get("/filteredimage", async (req, res) => {
  const image_url = req.query.image_url;
  console.log(`url: ${image_url}`);
  if (!image_url) {
    if (!urlRegex.test(image_url)) {
      return res.status(400).send('Invalid or missing image_url query parameter');
    }

  }
  try {
    const filteredPath = await filterImageFromURL(image_url);

    res.sendFile(filteredPath, {}, (err) => {
      if (err) {
        return res.status(500).send('Error sending the file');
      }

      deleteLocalFiles([filteredPath]);
    });
  } catch (error) {
    console.error("error :", error)
    res.status(500).send('Error filtering the image');
  }
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
