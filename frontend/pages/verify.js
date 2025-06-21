import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");
    setIsLoading(true);
    
   try {
			const res = await fetch(
				`http://localhost:4000/api/verify?certificateId=${encodeURIComponent(
					certificateId
				)}`
			);
			const data = await res.json();
      
      if (res.ok) {
        if (data.valid) {
          setResult(data.certificate);
        } else {
          setError(data.message || "Certificate not found or invalid");
        }
      } else {
        setError(data.error || "Error verifying certificate");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Verify Certificate | Certify</title>
        <meta name="description" content="Verify the authenticity of your certificate" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Certificate</h1>
            <p className="text-gray-600">Check the authenticity of any issued certificate</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate ID
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="certificateId"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      placeholder="Enter certificate ID"
                      required
                      className="flex-1 min-w-0 block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      'Verify Certificate'
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">This certificate is valid and authentic</p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate Details</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Certificate ID</p>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{result.certificateId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">University</p>
                        <p className="mt-1 text-sm text-gray-900">{result.university}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Student Name</p>
                        <p className="mt-1 text-sm text-gray-900">{result.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Course</p>
                        <p className="mt-1 text-sm text-gray-900">{result.course}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm font-medium text-gray-500">Date of Issue</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(result.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => {
                        setCertificateId("");
                        setResult(null);
                      }}
                    //   className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    // >

                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                        
                      Verify Another Certificate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/">
                ← Return to homepage
              
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}