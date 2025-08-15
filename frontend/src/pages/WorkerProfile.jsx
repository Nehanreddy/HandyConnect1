import { useState, useEffect } from "react";
import API from "../services/api";
import { useWorkerAuth } from "../context/WorkerAuthContext";
import { Pen, Check, X } from "lucide-react";
import WorkerNavbar from "../components/Workernavbar";

const WorkerProfile = () => {
  const { worker } = useWorkerAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    aadhaar: ""
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!worker?.token) {
        console.warn("⚠️ No token available");
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/worker/profile", {
          headers: {
            Authorization: `Bearer ${worker.token}`,
          },
        });
        setForm(res.data);
        console.log("✅ Profile loaded:", res.data);
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
        setMessage({ type: "error", text: "Failed to load profile. Please try again." });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [worker]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await API.put("/worker/profile", form, {
        headers: {
          Authorization: `Bearer ${worker?.token}`,
        },
      });
      console.log("✅ Profile updated:", res.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setEditingField(null);
      
      // Update form with response data to ensure consistency
      setForm(prevForm => ({ ...prevForm, ...res.data }));
    } catch (err) {
      console.error("❌ Update error:", err);
      setMessage({ 
        type: "error", 
        text: err.response?.data?.msg || "Profile update failed." 
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    // Reset form to original values
    fetchProfile();
  };

  if (loading) {
    return (
      <div>
        <WorkerNavbar />
        <div className="text-center py-20 text-gray-700 pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          Loading profile...
        </div>
      </div>
    );
  }

  const renderField = (fieldName, label, fullWidth = false, type = "text", editable = true, required = false) => {
    const isEditing = editingField === fieldName;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className={`${fullWidth ? "col-span-2" : ""} flex items-center border border-gray-300 rounded-lg px-3 py-2 shadow-sm ${isEditing ? 'ring-2 ring-blue-500' : ''}`}>
          {isEditing && editable ? (
            <input
              type={type}
              name={fieldName}
              value={form[fieldName] || ""} 
              onChange={handleChange}
              className="flex-grow border-none outline-none bg-transparent text-gray-800"
              aria-label={label}
              autoFocus
              required={required}
            />
          ) : (
            <p className="flex-grow text-gray-700">
              {form[fieldName] || <i className="text-gray-400">Not set</i>}
            </p>
          )}
          
          {editable && (
            <div className="flex items-center space-x-1 ml-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-green-600 hover:text-green-800 transition"
                    aria-label="Save changes"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-red-600 hover:text-red-800 transition"
                    aria-label="Cancel changes"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingField(fieldName)}
                  className="text-blue-600 hover:text-blue-800 transition"
                  aria-label={`Edit ${label}`}
                >
                  <Pen size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <WorkerNavbar /> 
      <div className="min-h-screen bg-gray-50 pt-24"> 
        <div className="max-w-4xl mx-auto p-8"> 
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Worker Profile</h2>

            {/* Message Display */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
              <div className="md:col-span-2">{renderField("name", "Full Name", true, "text", true, true)}</div>
              <div className="md:col-span-2">{renderField("phone", "Phone Number", true, "tel", true, true)}</div>
              <div className="md:col-span-2">{renderField("email", "Email Address", true, "email", true, true)}</div>
              <div className="md:col-span-2">{renderField("address", "Address", true, "text", true)}</div>
              {renderField("city", "City", false, "text", true)}
              {renderField("state", "State", false, "text", true)}
              {renderField("pincode", "Pincode", false, "text", true)}
              <div className="md:col-span-2">{renderField("aadhaar", "Aadhaar Number", true, "text", false)}</div>

              {/* Service Type Display (read-only) */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 shadow-sm bg-gray-50">
                  <p className="flex-grow text-gray-700 font-medium">
                    {worker?.serviceType || <i className="text-gray-400">Not set</i>}
                  </p>
                  <span className="text-xs text-gray-500">Cannot be changed</span>
                </div>
              </div>

              {/* Update Button - Only show if not in inline editing mode */}
              {!editingField && (
                <button
                  type="submit"
                  disabled={updating}
                  className={`md:col-span-2 py-3 text-lg font-medium rounded-xl transition ${
                    updating
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  }`}
                >
                  {updating ? "Updating..." : "Update All Fields"}
                </button>
              )}
            </form>

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
