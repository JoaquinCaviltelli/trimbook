// src/components/Spinner.jsx
function Spinner() {
  return (
    <div className="fixed inset-0 bg-white p-6">
      <div className="flex items-center justify-center h-full bg-gray-100">
      <span className="loader"></span>
      </div>
    </div>
  );
}

export default Spinner;
