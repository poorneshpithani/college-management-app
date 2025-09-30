import { useEffect, useState } from "react";
import API from "../../api/axiosInstance.js";

const UploadMaterial = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    branch: "",
    year: "",
  });
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [materials, setMaterials] = useState([]); // ✅ list of all teacher uploads
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyMaterials();
  }, []);

  // ✅ Fetch teacher’s uploaded files
  const fetchMyMaterials = async () => {
    try {
      const res = await API.get("/materials/teacher");
      setMaterials(res.data);
    } catch (err) {
      console.error("❌ Failed to load materials", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("branch", formData.branch);
    data.append("year", formData.year);
    data.append("file", file);

    try {
      setLoading(true);
      const res = await API.post("/materials/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedFile(res.data);
      setMaterials([res.data, ...materials]); // ✅ add to top of list
      setFormData({ title: "", description: "", branch: "", year: "" });
      setFile(null);
      alert("✅ Material uploaded successfully");
    } catch (err) {
      alert("❌ Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Material
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      await API.delete(`/materials/${id}`);
      setMaterials(materials.filter((m) => m._id !== id));
      alert("✅ Material deleted");
    } catch (err) {
      alert("❌ Failed to delete");
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded space-y-6">
      <h2 className="text-xl font-bold">📂 Upload Course Material</h2>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Branch</option>
          <option>Computer Science Engineering</option>
          <option>Mechanical Engineering</option>
          <option>Electrical and Electronics Engineering</option>
          {/* add more */}
        </select>
        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Year</option>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
        </select>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* ✅ Uploaded File Preview */}
      {uploadedFile && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <h3 className="font-semibold">{uploadedFile.title}</h3>
          <p className="text-sm text-gray-600">{uploadedFile.description}</p>
          <a
            href={uploadedFile.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View File
          </a>
        </div>
      )}

      {/* ✅ List All Teacher Materials */}
      <div>
        <h2 className="text-lg font-bold mt-6 mb-2">📑 My Uploaded Materials</h2>
        {materials.length === 0 ? (
          <p className="text-gray-500">No materials uploaded yet</p>
        ) : (
          <ul className="space-y-2">
            {materials.map((m) => (
              <li
                key={m._id}
                className="p-3 border rounded bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="text-sm text-gray-600">{m.description}</p>
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Download
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UploadMaterial;
