"use client"
import { useState } from "react"
import { User, Mail, Lock, Camera, Trash2, Save, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { toast } from "react-toastify"
import { deleteUser, setLoader,updateProfileImage } from "../../../slices/authSlice"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import Spinner from "../common/spinner"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const router = useRouter()
  const user = useSelector((state) => state.auth.user)
  const loader = useSelector((state) => state.auth.loader)
  const token = useSelector((state)=>state.auth.token)
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=120&width=120")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const [modifiedFields, setModifiedFields] = useState({})
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || " ",
    lastName: user?.lastName || " ",
    email: user?.email || " ",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleFieldChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value })
    if (user[field] !== value) {
      setModifiedFields({ ...modifiedFields, [field]: true })
    } else {
      const updatedModifiedFields = { ...modifiedFields }
      delete updatedModifiedFields[field]
      setModifiedFields(updatedModifiedFields)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    if (Object.keys(modifiedFields).length === 0) {
      toast.info("No changes were made to your profile")
      return
    }
    dispatch(setLoader(true))
    try {
      const updateData = {}
      Object.keys(modifiedFields).forEach(field => {
        updateData[field] = profileData[field]
      })
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/editprofile`,
        updateData,
        { withCredentials: true }
      )
      console.log("edit profile response", response.data)
      if (response.data.success) {
        toast.success(response.data.message || "Profile updated successfully")
        setModifiedFields({})
      } else {
        toast.error(response.data.message || "Failed to update profile")
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.message)
      toast.error(error.response?.data?.message || "An error occurred while updating profile" )
    } finally {
      dispatch(setLoader(false))
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!")
      return
    }
    dispatch(setLoader(true))
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/changepassword`,
        {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmNewPassword: passwordData.confirmPassword
        },
        { withCredentials: true }
      )
      console.log("change password response", response.data)
      if (response.data.success) {
        toast.success(response.data.message || "Password updated successfully")
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast.error(response.data.message || "Failed to update password")
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.message)
      toast.error(error.response?.data?.message || "An error occurred while changing password")
    } finally {
      dispatch(setLoader(false))
    }
  }

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    dispatch(setLoader(true));

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/editprofileimage`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (response.data.success) {
      const newImage = response.data.updateProfileImage?.image; // ✅ correct path
      if (newImage) {
        setProfileImage(newImage);
        dispatch(updateProfileImage(newImage)); // make sure your slice supports this
        toast.success("Profile image updated successfully!");
      } else {
        toast.error("Image URL missing in response");
      }
    } else {
      toast.error(response.data.message || "Failed to update image");
    }
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    toast.error(error.response?.data?.message || "Image upload failed");
  } finally {
    dispatch(setLoader(false));
  }
};


  const handleDeleteAccount = async() => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm account deletion")
      return
    }
    dispatch(setLoader(true))
    try {
  const response = await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });

  // Check if response exists and success true
  if (response?.data?.success) {
    toast.success(response.data.message || "Account deleted successfully");
    dispatch(deleteUser());
    router.push("/login");
  } else {
    toast.success("Account deleted successfully");
    dispatch(deleteUser());
    router.push("/login");
  }
} catch (error) {
  console.log("Delete account error:", error.response?.data || error.message);
  toast.error(error.response?.data?.message || error.message || "Error deleting account");
}
 finally {
      dispatch(setLoader(false))
      setShowDeleteModal(false)
      setDeleteConfirmation("")
    }
  }

  const tabs = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ]

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {loader && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <Spinner />
          </div>
        )}
               
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={user?.image}
                  alt="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-white text-purple-600 p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                  <Camera className="h-4 w-4" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              {/* Profile Info */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {profileData?.firstName || " "} {profileData?.lastName || ""}
                </h2>
                <p className="text-purple-100 mb-1">{profileData?.email || ""}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => handleFieldChange("firstName", e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => handleFieldChange("lastName", e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={Object.keys(modifiedFields).length === 0}
                      className={`px-6 py-3 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                        Object.keys(modifiedFields).length === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Password Requirements:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Include uppercase and lowercase letters</li>
                      <li>• Include at least one number</li>
                      <li>• Include at least one special character</li>
                    </ul>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === "danger" && (
              <div>
                <h3 className="text-xl font-semibold text-red-600 mb-6">Danger Zone</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                      <p className="text-red-700 text-sm mb-4">
                        Once you delete your account, there is no going back. Please be certain. All your notes, data,
                        and settings will be permanently removed.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center gap-3 p-6 border-b border-gray-200">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Confirm Account Deletion</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you absolutely sure you want to delete your account? This action cannot be undone.
              </p>
              <p className="text-sm text-red-600 mb-6">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-6"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteConfirmation("")
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:bg-red-300 disabled:cursor-not-allowed"
                  disabled={deleteConfirmation !== "DELETE"}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
