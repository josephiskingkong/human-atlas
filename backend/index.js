const express = require('express');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use('/tiles_files', express.static(path.join(__dirname, 'tiles_files')));

app.listen(PORT, () => {
    console.log('Server starting on port ' + PORT);
});

app.get('/tiles.dzi', (req, res) => {
    const filePath = path.join(__dirname, 'tiles.dzi');

    res.sendFile(filePath, {
        headers: {
            'Content-Type': 'application/xml'
        }
    });
});