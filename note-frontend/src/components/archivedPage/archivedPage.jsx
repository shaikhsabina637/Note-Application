"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreVertical, RotateCcw, Archive, Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setArchivedNotes, removeFromArchive, setTrash } from "../../../slices/noteSlice"
import { setLoader } from "../../../slices/authSlice"
import Spinner from "@/components/common/spinner"

export default function ArchivedPage() {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [loadingActions, setLoadingActions] = useState({
    unarchiveAll: false,
    unarchiving: new Set(),
    movingToTrash: new Set(),
  })

  const archivedNotes = useSelector((state) => state.note.archived || [])
  const token = useSelector((state) => state.auth.token)

  // Fetch archived notes from API
  useEffect(() => {
    const fetchNotes = async () => {
      dispatch(setLoader(true))
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/archived`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        dispatch(setArchivedNotes(res.data?.notes || []))
      } catch (err) {
        console.error("Error fetching notes:", err)
      } finally {
        dispatch(setLoader(false))
      }
    }

    if (token) fetchNotes()
  }, [dispatch, token])

  const categories = ["all", "work", "personal", "creative", "health"]

  // Filter notes based on search and category
  const filteredNotes = archivedNotes.filter((note) => {
    // Add null checks for note properties
    const title = note.title || ""
    const content = note.content || ""
    const category = note.category || ""

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) || content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort notes by archived date (most recent first)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const dateA = a.archivedAt ? new Date(a.archivedAt) : new Date(0)
    const dateB = b.archivedAt ? new Date(b.archivedAt) : new Date(0)
    return dateB - dateA
  })

  // Update note status API call
  const handleStatusChange = async (note, status) => {
    const actionType = status === "active" ? "unarchiving" : "movingToTrash"

    setLoadingActions((prev) => ({
      ...prev,
      [actionType]: new Set([...prev[actionType], note._id]),
    }))

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/${note._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Handle different API response formats
      const updatedNote = res.data?.note || res.data?.notes || res.data?.pinnedNote || res.data?.unpinnedNote

      if (updatedNote) {
        if (status === "active") {
          // Remove from archived list in Redux
          dispatch(removeFromArchive(note._id))
        } else if (status === "trash") {
          // Remove from archived and add to trash
          dispatch(removeFromArchive(note._id))
          dispatch(setTrash(updatedNote))
        }
      }
    } catch (err) {
      console.error("Error updating status:", err)
    } finally {
      setLoadingActions((prev) => {
        const newSet = new Set(prev[actionType])
        newSet.delete(note._id)
        return {
          ...prev,
          [actionType]: newSet,
        }
      })
      setActiveDropdown(null)
    }
  }

  const toggleDropdown = (noteId) => {
    setActiveDropdown(activeDropdown === noteId ? null : noteId)
  }

  const unarchiveAll = async () => {
    if (!window.confirm("Are you sure you want to unarchive all notes? They will be moved back to your active notes."))
      return

    setLoadingActions((prev) => ({ ...prev, unarchiveAll: true }))

    try {
      // Create an array of promises for all unarchive operations
      const unarchivePromises = archivedNotes.map((note) =>
        axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/${note._id}/status`,
          { status: "active" },
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      )

      // Wait for all API calls to complete
      await Promise.all(unarchivePromises)

      // Clear the archived notes in Redux
      dispatch(setArchivedNotes([]))
    } catch (err) {
      console.error("Error unarchiving all notes:", err)
    } finally {
      setLoadingActions((prev) => ({ ...prev, unarchiveAll: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Archived Notes</h1>
          <p className="text-gray-600">Your completed and stored notes for future reference</p>
        </div>

        {/* Stats and Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-sm text-gray-600">Total Archived: </span>
            <span className="font-semibold text-purple-600">{archivedNotes.length}</span>
          </div>
          <button
            onClick={unarchiveAll}
            disabled={archivedNotes.length === 0 || loadingActions.unarchiveAll}
            className={`px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
              loadingActions.unarchiveAll ? "opacity-75" : ""
            }`}
          >
            {loadingActions.unarchiveAll ? (
              <>
                <Spinner />
                <span>Unarchiving All...</span>
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                Unarchive All
              </>
            )}
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search archived notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Category Filter */}
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

      {/* Archived Notes Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedNotes.map((note) => {
            const isUnarchiving = loadingActions.unarchiving.has(note._id)
            const isMovingToTrash = loadingActions.movingToTrash.has(note._id)

            return (
              <div
                key={note._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 relative border-l-4 border-amber-400"
              >
                {/* Archived indicator */}
                <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <Archive className="h-3 w-3" />
                  Archived
                </div>

                {/* Three dots menu */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleDropdown(note._id)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    disabled={isUnarchiving || isMovingToTrash}
                  >
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === note._id && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-[160px]">
                      <button
                        onClick={() => handleStatusChange(note, "active")}
                        disabled={isUnarchiving || isMovingToTrash}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-purple-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUnarchiving ? (
                          <>
                            <Spinner />
                            <span>Unarchiving...</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-4 w-4" />
                            Unarchive
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleStatusChange(note, "trash")}
                        disabled={isUnarchiving || isMovingToTrash}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isMovingToTrash ? (
                          <>
                            <Spinner />
                            <span>Moving...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Move to Trash
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Note Content */}
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2 pr-8">{note.title || "Untitled Note"}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{note.content || "No content"}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded-full">{note.category || "uncategorized"}</span>
                    <span>
                      Created: {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : "Unknown date"}
                    </span>
                  </div>
                  
                </div>

                {/* Quick Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleStatusChange(note, "active")}
                    disabled={isUnarchiving || isMovingToTrash}
                    className={`flex-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      isUnarchiving ? "opacity-75" : ""
                    }`}
                  >
                    {isUnarchiving ? (
                      <>
                        <Spinner />
                        <span>Unarchiving...</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-3 w-3" />
                        Unarchive
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleStatusChange(note, "trash")}
                    disabled={isUnarchiving || isMovingToTrash}
                    className={`px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      isMovingToTrash ? "opacity-75" : ""
                    }`}
                  >
                    {isMovingToTrash ? (
                      <>
                        <Spinner />
                      </>
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {sortedNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Archive className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {archivedNotes.length === 0 ? "No archived notes" : "No notes found"}
            </h3>
            <p className="text-gray-500">
              {archivedNotes.length === 0
                ? "Archived notes will appear here when you archive them from your active notes"
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="max-w-4xl mx-auto mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Archive className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-2">About Archived Notes</h3>
            <p className="text-amber-700 text-sm leading-relaxed">
              Archived notes are stored safely and won't appear in your main notes view. They're perfect for completed
              projects, reference materials, or notes you want to keep but don't need to see regularly. You can always
              unarchive them to bring them back to your active notes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
