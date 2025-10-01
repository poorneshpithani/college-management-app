import { useEffect, useState } from "react";
import API from "../../api/axiosInstance.js";

const StudentMaterials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await API.get("/materials/student");
      setMaterials(res.data);
    } catch (err) {
      console.error("❌ Failed to load materials", err);
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded mt-6">
      <h2 className="text-xl font-bold mb-3">📂 Course Materials</h2>
      {materials.length === 0 ? (
        <p className="text-gray-500">No materials available</p>
      ) : (
        <ul className="space-y-2">
          {materials.map((m) => (
            <li key={m._id} className="p-3 border rounded bg-gray-50">
              <h3 className="font-semibold">{m.title}</h3>
              <p className="text-sm text-gray-600">{m.description}</p>
              {/* <a
          href={`${m.fileUrl}?fl_attachment=${m.title || "material"}.pdf`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          Download
        </a> */}
<a
  href={`${import.meta.env.VITE_API_RENDER_URL || "http://localhost:5000/api"}/materials/download/${m._id}`}
  className="text-blue-600 underline"
>
  Download
</a>



            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentMaterials;
