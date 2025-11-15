import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalents of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Cloud Run provides the PORT environment variable, defaulting to 8080 for local development
const port = process.env.PORT || 8080;

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// This is crucial for single-page applications (SPAs)
// It ensures that any direct navigation to a route (e.g., /some-page)
// will be served by index.html from the 'dist' folder, allowing the client-side router to take over.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
