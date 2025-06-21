const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Blockchain, Block } = require("../blockchain");

const app = express();
const port = 4000;



// //hi
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(bodyParser.json());

const universityChain = new Blockchain();

//app.use(express.json());


// // Handle CSV upload
app.post('/api/issue/csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (path.extname(req.file.originalname).toLowerCase() !== '.csv') {
      fs.unlinkSync(req.file.path); // Delete the uploaded file
      return res.status(400).json({ error: 'Only CSV files are allowed' });
    }
    
    const results = [];
    const errors = [];
    
    // Process CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        // Validate each row
        if (!data.certificateId || !data.university || !data.studentName || !data.course || !data.date) {
          errors.push({
            row: results.length + 1,
            error: 'Missing required fields',
            data
          });
        } else {
          results.push(data);
        }
      })
      .on('end', () => {
        fs.unlinkSync(req.file.path); // Delete the uploaded file
        
        if (results.length === 0 && errors.length > 0) {
          return res.status(400).json({ 
            error: 'All rows had errors',
            details: errors
          });
        }
        
		//Chceck out the CSV Block mined
const certificateData = {
		certificateId, 
		university,
		studentName,
		course,
		date,
	};
	
	const newBlock = new Block(
		universityChain.chain.length,
		Date.now().toString(),
		certificateData
	);
	universityChain.addBlock(newBlock);
	res.json({
		message: "Certificate issued and added to blockchain",
		certificate: certificateData,
	});


        // Process the data (in a real app, you'd save to database here)
        console.log('Processing certificates:', results);
        
        res.status(201).json({
          message: 'CSV processed successfully',
          successful: results.length,
          failed: errors.length,
          errors: errors.length > 0 ? errors : undefined
        });
      });
  } catch (error) {
    console.error('Error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path); // Clean up uploaded file on error
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// //hi

app.post("/api/issue", (req, res) => {
	const { certificateId, university, studentName, course, date } = req.body;
	if (!certificateId || !university || !studentName || !course || !date) {
		return res.status(400).json({ error: "Missing certificate data fields" });
	}
	const certificateData = {
		certificateId, 
		university,
		studentName,
		course,
		date,
	};
	const newBlock = new Block(
		universityChain.chain.length,
		Date.now().toString(),
		certificateData
	);
	universityChain.addBlock(newBlock);
	res.json({
		message: "Certificate issued and added to blockchain",
		certificate: certificateData,
	});
});

app.get("/api/verify", (req, res) => {
	const certificateId = req.query.certificateId;
	if (!certificateId) {
		return res
			.status(400)
			.json({ error: "Missing certificateId query parameter" });
	}
	const cert = universityChain.findCertificate(certificateId);
	if (cert) {
		res.json({ valid: true, certificate: cert });
	} else {
		res.json({ valid: false, message: "Certificate not found or invalid" });
	}
});

app.listen(port, () => {
	console.log(
		`Blockchain certification backend API listening at http://localhost:${port}`
	);
});
