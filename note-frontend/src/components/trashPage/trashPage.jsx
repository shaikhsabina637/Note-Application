"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreVertical, RotateCcw, Trash2, AlertTriangle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setTrash, removeFromTrash, setUserNotes } from "../../../slices/noteSlice"
import { setLoader } from "../../../slices/authSlice"
import Spinner from "../common/spinner"

export default function TrashPage() {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const trashedNotes = useSelector((state) => state.note.trash || [])
  const token = useSelector((state) => state.auth.token)
  const loader = useSelector((state) => state.auth.loader)   // ✅ Loader from redux

  // Fetch trashed notes from API
  useEffect(() => {
    const fetchTrashedNotes = async () => {
      dispatch(setLoader(true))
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/trash`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        dispatch(setTrash(res.data?.notes || []))
      } catch (err) {
        console.error("Error fetching trashed notes:", err)
      } finally {
        dispatch(setLoader(false))
      }
    }

    if (token) fetchTrashedNotes()
  }, [dispatch, token])

  const categories = ["all", "work", "personal", "creative", "health"]

  // Filter notes based on search and category
  const filteredNotes = trashedNotes.filter((note) => {
    const title = note.title || ""
    const content = note.content || ""
    const category = note.category || ""
    
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort notes by deletion date (most recent first)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const dateA = a.deletedAt ? new Date(a.deletedAt) : new Date(0)
    const dateB = b.deletedAt ? new Date(b.deletedAt) : new Date(0)
    return dateB - dateA
  })

  // Calculate days left until permanent deletion (30 days after deletion)
  const calculateDaysLeft = (deletedAt) => {
    if (!deletedAt) return 0
    const deletedDate = new Date(deletedAt)
    const permanentDeleteDate = new Date(deletedDate)
    permanentDeleteDate.setDate(permanentDeleteDate.getDate() + 30)
    const today = new Date()
    const timeDiff = permanentDeleteDate.getTime() - today.getTime()
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysLeft > 0 ? daysLeft : 0
  }

  // Restore a note from trash
  const handleRestore = async (note) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/${note._id}/status`,
        { status: "active" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const updatedNote = res.data?.note || res.data?.notes || res.data?.restoredNote;
      if (updatedNote) {
        dispatch(removeFromTrash(note._id))
        dispatch(setUserNotes([updatedNote]))
      }
    } catch (err) {
      console.error("Error restoring note:", err)
    }
  }

  // Permanently delete a note
  const handlePermanentDelete = async (note) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/deletenote/${note._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data?.success) {
        dispatch(removeFromTrash(note._id))
        setShowDeleteModal(false)
        setNoteToDelete(null)
      }
    } catch (err) {
      console.error("Error permanently deleting note:", err)
    }
  }

  // Empty all trash
  const emptyTrash = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all notes in trash? This action cannot be undone.")) return
    try {
      const deletePromises = trashedNotes.map(note => 
        axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/deletenote/${note._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(deletePromises);
      dispatch(setTrash([]))
    } catch (err) {
      console.error("Error emptying trash:", err)
    }
  }

  // Open delete confirmation modal
  const confirmDelete = (note) => {
    setNoteToDelete(note)
    setShowDeleteModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* ✅ Spinner (no black overlay) */}
      {loader && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Trash</h1>
          <p className="text-gray-600">Notes in trash will be permanently deleted after 30 days</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <button
            onClick={emptyTrash}
            disabled={trashedNotes.length === 0}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Empty Trash ({trashedNotes.length})
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search trashed notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white min-w-[150px]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Trashed Notes Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedNotes.map((note) => {
            const daysLeft = calculateDaysLeft(note.deletedAt || note.updatedAt)
            const isExpired = daysLeft <= 0
            return (
              <div
                key={note._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 relative border-l-4 border-red-400"
              >
                <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-medium ${
                  isExpired 
                    ? "bg-gray-100 text-gray-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {isExpired ? "Expired" : `${daysLeft} days left`}
                </div>
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2 pr-8 opacity-75">{note.title || "Untitled Note"}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3 opacity-75">{note.content || "No content"}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="bg-gray-100 px-2 py-1 rounded-full">{note.category || "uncategorized"}</span>
                    <span>Deleted: {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : "Unknown date"}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleRestore(note)}
                    className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Restore
                  </button>
                  <button
                    onClick={() => confirmDelete(note)}
                    className="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {sortedNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Trash2 className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Trash is empty
            </h3>
            <p className="text-gray-500">
              Deleted notes will appear here
            </p>
          </div>
        )}
      </div>

      {showDeleteModal && (
  <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
    {/* Background blur */}
    <div className="absolute inset-0 backdrop-blur-sm pointer-events-none"></div>

    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[70vh] overflow-y-auto pointer-events-auto relative z-10">
      <div className="flex items-center gap-3 p-6 border-b border-gray-200">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <h2 className="text-xl font-semibold text-gray-900">Confirm Permanent Deletion</h2>
      </div>
      <div className="p-6">
        <p className="text-gray-700 mb-6">
          Are you sure you want to permanently delete this note? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowDeleteModal(false)
              setNoteToDelete(null)
            }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => handlePermanentDelete(noteToDelete)}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Delete Forever
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  )
}
