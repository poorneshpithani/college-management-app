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
  const [materials, setMaterials] = useState([]);

  const [branches, setBranches] = useState([]); // ✅ dynamic branches
  const [years, setYears] = useState([]); // ✅ dynamic years for selected branch
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyMaterials();
    fetchBranches();
  }, []);

  // ✅ Fetch uploaded materials
  const fetchMyMaterials = async () => {
    try {
      const res = await API.get("/materials/teacher");
      setMaterials(res.data);
    } catch (err) {
      console.error("❌ Failed to load materials", err);
    }
  };

  // ✅ Fetch all branches
  const fetchBranches = async () => {
    try {
      // const res = await API.get("/admin/exams/branches");
      const res = await API.get("/admin/exams/public/branches");
      setBranches(res.data);
    } catch (err) {
      console.error("❌ Failed to load branches:", err);
    }
  };

  // ✅ Fetch semesters (and extract years) for a branch
  const fetchYearsByBranch = async (branchId) => {
    try {
      const res = await API.get(`/admin/exams/public/semesters/${branchId}`);
      const uniqueYears = [...new Set(res.data.map((s) => s.year))]; // remove duplicates
      setYears(uniqueYears);
    } catch (err) {
      console.error("❌ Failed to load years:", err);
    }
  };

  // ✅ Handle branch change
  const handleBranchChange = (e) => {
    const selectedBranch = e.target.value;
    setFormData({ ...formData, branch: selectedBranch, year: "" });
    if (selectedBranch) fetchYearsByBranch(selectedBranch);
    else setYears([]);
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
      setMaterials([res.data, ...materials]);
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

        {/* ✅ Dynamic Branch Dropdown */}
        <select
          name="branch"
          value={formData.branch}
          onChange={handleBranchChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Branch</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* ✅ Dynamic Year Dropdown */}
        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          disabled={!years.length}
        >
          <option value="">Select Year</option>
          {years.map((y, i) => (
            <option key={i} value={y}>
              Year {y}
            </option>
          ))}
        </select>

        {/* Custom File Upload */}
        <label
          htmlFor="fileInput"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <svg
            className="w-10 h-10 text-gray-500 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
            />
          </svg>
          <span className="text-sm text-gray-600">
            {file ? file.name : "Upload Material"}
          </span>
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            required
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Uploaded File Preview */}
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

      {/* Uploaded Materials List */}
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
                    href={`${API.defaults.baseURL}/materials/download/${m._id}`}
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
