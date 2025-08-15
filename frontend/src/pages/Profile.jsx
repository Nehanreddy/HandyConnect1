import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from "../services/api";
import { Pen, X, Check } from "lucide-react";

const fields = [
  { key: "name", label: "Full Name", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "city", label: "City", type: "text" },
  { key: "state", label: "State", type: "text" }
];

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: ""
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [temp, setTemp] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/auth/profile', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          state: res.data.state || ""
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        toast.error("Failed to load profile. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchProfile();
  }, [user]);

  const handleEdit = (fieldKey) => {
    if (updating) return; // Prevent editing during update
    setEditing(fieldKey);
    setTemp(profile[fieldKey]);
  };

  const handleCancel = () => {
    setEditing(null);
    setTemp("");
  };

  const handleTempChange = (e) => {
    setTemp(e.target.value);
  };

  const handleSaveField = (fieldKey) => {
    if (temp.trim() === "") {
      toast.warning("Field cannot be empty");
      return;
    }
    setProfile((p) => ({ ...p, [fieldKey]: temp }));
    setEditing(null);
    setTemp("");
    toast.success("Field updated locally. Don't forget to save changes!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await API.put("/auth/profile", profile, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      toast.success("Profile updated successfully! 🎉");
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.msg || "Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center"
      >
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center mb-6">
          <span className="text-3xl text-cyan-600 font-bold">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">{profile.name || "Your Name"}</h2>
        <p className="text-gray-500 mb-6 text-center">{profile.email || "your@email.com"}</p>

        {/* Editable Fields */}
        <div className="w-full space-y-6 mb-8">
          {fields.map(({ key, label, type }) => (
            <div className="flex items-center justify-between gap-2" key={key}>
              <span className="font-medium text-gray-700 w-1/3">{label}:</span>
              
              {editing === key ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type={type}
                    value={temp}
                    autoFocus
                    onChange={handleTempChange}
                    disabled={updating}
                    className="border border-gray-300 rounded-md px-3 py-1 w-full text-gray-800 outline-none focus:ring-2 focus:ring-cyan-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveField(key);
                      if (e.key === "Escape") handleCancel();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveField(key)}
                    disabled={updating}
                    className="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    tabIndex={0}
                    aria-label="Save"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={updating}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    tabIndex={0}
                    aria-label="Cancel"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center gap-2">
                  <span className={`${profile[key] ? "text-gray-800" : "text-gray-400 italic"} flex-1`}>
                    {profile[key] || "Not set"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEdit(key)}
                    disabled={updating}
                    className="text-cyan-700 hover:text-cyan-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    tabIndex={0}
                    aria-label={`Edit ${label}`}
                  >
                    <Pen size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={updating || editing !== null}
          className={`w-full py-3 rounded-lg font-medium text-white shadow-md transition flex items-center justify-center
          ${updating || editing !== null 
            ? "bg-cyan-400 cursor-not-allowed"
            : "bg-cyan-600 hover:bg-cyan-700"
          }`}
        >
          {updating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Profile;
