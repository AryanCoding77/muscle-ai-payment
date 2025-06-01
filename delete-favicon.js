const fs = require('fs');
const path = require('path');

const faviconPath = path.join(__dirname, 'src', 'app', 'favicon.ico');

try {
  if (fs.existsSync(faviconPath)) {
    fs.unlinkSync(faviconPath);
    console.log('Successfully deleted src/app/favicon.ico');
  } else {
    console.log('File does not exist, no need to delete');
  }
} catch (err) {
  console.error('Error deleting file:', err);
} 