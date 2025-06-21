import { useState } from "react";
import Link from "next/link";

export default function IssueCertificate() {
const [formData, setFormData] = useState({
  certificateId: "",
  university: "",
  otherUniversity: "", // Add this
  studentName: "",
  course: "",
  date: "",
});


const universities = [
                   "Addis Ababa University", "Adigrat University", "Aksum University", "Ambo University", "Arba Minch University", "Arsi University", "Assosa University", "Bahir Dar University", "Bonga University", "Borena University", "Bule Hora University", "Debark University", "Debre Berhan University", "Debre Markos University", "Debre Tabor University", "Dembi Dolo University", "Dila University", "Dire Dawa University", "Ethiopian Police University", "Gambella University", "Haramaya University", "Hawassa University", "Injibara University", "Jigjiga University", "Jimma University", "Jinka University", "Kebri Dehar University", "Kotebe Education University", "Madda Walabu University", "Mattu University", "Mekdela Amba University", 
                   "Mekelle University", "Adama Science and Technology University", "Semera University", "Wachemo University", "Wolaita Sodo University", "Wollega University", "Wollo University",
                    "Other"
                    ];

                    

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };


const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    
    try {
      const res = await fetch("http://localhost:4000/api/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ text: "Certificate issued successfully!", type: "success" });
        setFormData({
          certificateId: "",
          university: "",
          studentName: "",
          course: "",
          date: "",
        });
      } else {
        setMessage({ text: data.error || "Error issuing certificate", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Network error: " + error.message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="bg-indigo-600 py-4 px-8">
          <h1 className="text-2xl font-bold text-white">Issue Certificate</h1>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700">
                  Certificate ID
                </label>
                <input
                  type="text"
                  id="certificateId"
                  name="certificateId"
                  value={formData.certificateId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                  University
                </label>

                <select
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                        <option value="">Select a university</option>
                        {universities.map(university => (
                        <option key={university} value={university}>{university}</option>
                        ))}
                        </select>

                            {formData.university === "Other" && (
                                <div className="mt-2">
                                <input
                                    type="text"
                                    id="otherUniversity"
                                    name="otherUniversity"
                                    value={formData.otherUniversity || ""}
                                    onChange={handleChange}
                                    required
                                    placeholder="Please specify university name"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                </div>
                            )}
                            

              </div>

              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">
                  Student Name
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                  Course
                </label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date of Issue
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? 'Processing...' : 'Issue Certificate'}
              </button>

              <Link href="/verify" className="text-indigo-600 hover:text-blue-800 font-medium">
                Verify Certificate
              </Link>
            </div>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
