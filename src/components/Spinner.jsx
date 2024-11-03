// src/components/Spinner.jsx
function Spinner() {
  return (
    <div className="fixed inset-0 bg-white p-6">
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export default Spinner;
