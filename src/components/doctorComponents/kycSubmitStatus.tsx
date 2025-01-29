import { FaCheckCircle } from "react-icons/fa";

function KycSubmitStatus() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white max-w-md p-6 rounded-lg shadow-md transform transition-transform hover:scale-105">
        <div className="flex flex-col items-center">
          <FaCheckCircle className="text-green-500 text-5xl mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            KYC Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-4 text-center">
            We have received your KYC information. Our admin team is reviewing
            your details, and you'll be notified soon.
          </p>
          {/* <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Back to Dashboard
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default KycSubmitStatus;