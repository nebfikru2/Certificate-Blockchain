const { Blockchain, Block } = require("./blockchain");

function runTests() {
	const testChain = new Blockchain();

	console.log("Starting thorough tests for blockchain certification system...");

	// Test 1: Issue certificates
	const cert1 = {
		certificateId: "CERT001",
		university: "University A",
		studentName: "Alice",
		course: "Computer Science",
		date: "2023-06-01",
	};
	const cert2 = {
		certificateId: "CERT002",
		university: "University B",
		studentName: "Bob",
		course: "Mathematics",
		date: "2023-06-02",
	};

	testChain.addBlock(
		new Block(testChain.chain.length, Date.now().toString(), cert1)
	);
	testChain.addBlock(
		new Block(testChain.chain.length, Date.now().toString(), cert2)
	);

	console.log("Test 1: Certificates issued and added.");

	// Test 2: Verify existing certificates
	const foundCert1 = testChain.findCertificate("CERT001");
	const foundCert2 = testChain.findCertificate("CERT002");

	console.assert(foundCert1 !== null, "Test 2 Failed: CERT001 not found");
	console.assert(foundCert2 !== null, "Test 2 Failed: CERT002 not found");

	console.log("Test 2: Existing certificates verified.");

	// Test 3: Verify non-existent certificate
	const notFoundCert = testChain.findCertificate("CERT999");
	console.assert(
		notFoundCert === null,
		"Test 3 Failed: Non-existent certificate found"
	);

	console.log("Test 3: Non-existent certificate correctly not found.");

	// Test 4: Blockchain validity
	const isValid = testChain.isChainValid();
	console.assert(isValid === true, "Test 4 Failed: Blockchain invalid");

	console.log("Test 4: Blockchain validity confirmed.");

	// Test 5: Tampering test
	testChain.chain[1].data.studentName = "Eve"; // Tamper with data
	const isValidAfterTamper = testChain.isChainValid();
	console.assert(
		isValidAfterTamper === false,
		"Test 5 Failed: Tampering not detected"
	);

	console.log("Test 5: Tampering detection test passed.");

	console.log("All tests completed.");
}

runTests();
