const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const bodyParser = require("body-parser");
const cors = require("cors");
const { Blockchain, Block } = require("../blockchain");
const app = express();
const upload = multer({ dest: 'uploads/' });
const universityChain = new Blockchain();


app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

//app.use(cors());
//app.use(bodyParser.json());



// Existing single certificate endpoint
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

    try {
        const newBlock = new Block(
            universityChain.chain.length,
            Date.now().toString(),
            certificateData
        );
        
        universityChain.addBlock(newBlock);
        
        res.json({
            message: "Certificate issued and added to blockchain",
            certificate: certificateData,
            blockHash: newBlock.hash,
            blockIndex: newBlock.index
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to add to blockchain", details: error.message });
    }
});

// New CSV upload endpoint
app.post("/api/issue/csv", upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const results = [];
    const errors = [];
    let processedCount = 0;

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            // Validate CSV row
            if (!data.certificateId || !data.university || !data.studentName || !data.course || !data.date) {
                errors.push({
                    row: processedCount + 1,
                    error: "Missing required fields",
                    data
                });
                return;
            }

            const certificateData = {
                certificateId: data.certificateId,
                university: data.university,
                studentName: data.studentName,
                course: data.course,
                date: data.date
            };

            try {
                const newBlock = new Block(
                    universityChain.chain.length,
                    Date.now().toString(),
                    certificateData
                );
                
                universityChain.addBlock(newBlock);
                
                results.push({
                    ...certificateData,
                    blockHash: newBlock.hash,
                    blockIndex: newBlock.index,
                    status: "success"
                });
            } catch (error) {
                errors.push({
                    row: processedCount + 1,
                    error: error.message,
                    data: certificateData
                });
            }
            
            processedCount++;
        })
        .on('end', () => {
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            
            res.json({
                message: `Processed ${processedCount} certificates`,
                successful: results.length,
                failed: errors.length,
                results,
                errors
            });
        })
        .on('error', (error) => {
            fs.unlinkSync(req.file.path);
            res.status(500).json({ error: "CSV processing error", details: error.message });
        });
});

// Verification endpoint
// app.get("/api/verify/:certificateId", (req, res) => {
//     const { certificateId } = req.params;
    
//     // Search through blockchain for certificate
//     for (let i = 1; i < universityChain.chain.length; i++) {
//         const block = universityChain.chain[i];
//         if (block.data && block.data.certificateId === certificateId) {
//             return res.json({
//                 exists: true,
//                 certificate: block.data,
//                 blockHash: block.hash,
//                 blockIndex: block.index,
//                 timestamp: block.timestamp,
//                 chainValid: universityChain.isChainValid()
//             });
//         }
//     }
    
//     res.status(404).json({ exists: false });
// });

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

// Blockchain status endpoint
app.get("/api/blockchain/status", (req, res) => {
    res.json({
        length: universityChain.chain.length,
        isValid: universityChain.isChainValid(),
        difficulty: universityChain.difficulty,
        lastBlock: universityChain.getLatestBlock()
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));