import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //filter image endpoint
  app.get("/filteredimage", async(req:express.Request, res:express.Response) => {
    
    if(!req.query.image_url) {
      res.status(404).send("image_url query parameter required")
    }

    const filteredpath : string = await filterImageFromURL(req.query.image_url);

    res.sendFile(filteredpath, async(err) => {
      if(err) {
        res.status(500).end();
      }
      else {
        await deleteLocalFiles([filteredpath]);
      }
    });
  });
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req:express.Request, res:express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();