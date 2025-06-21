const readline = require("readline");
const { Blockchain, Block } = require("./blockchain");
const { lstat } = require("fs");

const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout,
});

const universityChain = new Blockchain();

function prompt() {
 rl.question("\nEnter command (issue, verify, exit): ", (command) => {
  if (command === "issue") {
   issueCertificate();
  } else if (command === "verify") {
   verifyCertificate();
  } else if (command === "exit") {
   console.log("Exiting...");
   rl.close();
  } else {
   console.log(
    'Unknown command. Please enter "issue", "verify", or "exit".'
   );
   prompt();
  }
 });
}

function issueCertificate() {
 rl.question("Enter certificate ID: ", (certificateId) => {
  rl.question("Enter university name: ", (university) => {
   rl.question("Enter student name: ", (studentName) => {
    rl.question("Enter course name: ", (course) => {
     rl.question("Enter date of issue (YYYY-MM-DD): ", (date) => {
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
      console.log("Certificate issued and added to blockchain.");
      prompt();
     });
    });
   });
  });
 });
}

function verifyCertificate() {
 rl.question("Enter certificate ID to verify: ", (certificateId) => {
  const cert = universityChain.findCertificate(certificateId);
  if (cert) {
   console.log("Certificate found:");
   console.log(cert);
  } else {
   console.log("Certificate not found or invalid.");
  }
  prompt();
 });
}

console.log("University Blockchain Certification Verification System");
prompt();