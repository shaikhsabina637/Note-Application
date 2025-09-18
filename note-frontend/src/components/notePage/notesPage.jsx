"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Filter, MoreVertical, Plus, X } from "lucide-react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { setUserNotes, addNote, archiveNote, setTrash, togglePinNote } from "../../../slices/noteSlice"
import Spinner from "../common/spinner"
import { setLoader } from "../../../slices/authSlice"

export default function NotesPage() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const notes = useSelector((state) => state.note.note)
  const loader = useSelector((state) => state.auth.loader)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "Personal",
    file: null,
  })
  const [editingNote, setEditingNote] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null) // ✅ added for dropdown state
  const [loadingStates, setLoadingStates] = useState({
    addingNote: false,
    pinning: new Set(),
    archiving: new Set(),
    trashing: new Set(),
  })

  // Client flag to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  // fetch notes of a user
  useEffect(() => {
    if(!token){
      return 
    }
    const fetchNotes = async () => {
      dispatch(setLoader(true))
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/active`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const userNotes = res.data?.notes || []
        dispatch(setUserNotes(userNotes))
        dispatch(setLoader(false))
      } catch (err) {
        console.error("Error fetching notes:", err)
      }
    }
    fetchNotes()
  }, [dispatch, token])

  // add or update note
  const handleAddOrUpdate = async (e) => {
    e.preventDefault()
    if (!newNote.title.trim() || !newNote.content.trim()) return

    setLoadingStates((prev) => ({ ...prev, addingNote: true }))

    try {
      const formData = new FormData()
      formData.append("title", newNote.title)
      formData.append("content", newNote.content)
      formData.append("category", newNote.category)
      if (newNote.file) formData.append("file", newNote.file)

      if (editingNote) {
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/updatenote/${editingNote._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        )
        const updatedFromRes = res.data?.note
        if (updatedFromRes) {
          const updatedNotes = notes.map((note) =>
            note._id === editingNote._id ? { ...note, ...updatedFromRes } : note,
          )
          dispatch(setUserNotes(updatedNotes))
        }
        setEditingNote(null)
      } else {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/addnote`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        const newNoteFromRes = res.data.note
        dispatch(addNote(newNoteFromRes))
      }
      setNewNote({ title: "", content: "", category: "Personal", file: null })
      setIsModalOpen(false)
    } catch (err) {
      console.error("Error saving note:", err)
    } finally {
      setLoadingStates((prev) => ({ ...prev, addingNote: false }))
    }
  }

  // filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const title = (note?.title || "").toLowerCase()
      const content = (note?.content || "").toLowerCase()
      const matchesSearch = title.includes(searchTerm.toLowerCase()) || content.includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || note.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [notes, searchTerm, selectedCategory])

  // pin/unpin
  const togglePin = async (id, isPinned) => {
    console.log("Toggling pin for:", id, "Current state:", isPinned)

    setLoadingStates((prev) => ({
      ...prev,
      pinning: new Set([...prev.pinning, id]),
    }))

    // Optimistically update the UI first
    dispatch(togglePinNote({ id, isPinned: !isPinned }))
    setOpenMenuId(null)

    try {
      const url = isPinned
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/unpinnednote/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/pinnednote/${id}`

      const res = await axios.patch(url, {}, { headers: { Authorization: `Bearer ${token}` } })

      // Verify the server's response matches our optimistic update
      let updatedNote

      if (isPinned) {
        updatedNote = res.data?.unpinnedNote || res.data?.note
      } else {
        updatedNote = res.data?.pinnedNote || res.data?.note
      }

      // Only update if server response differs from our optimistic update
      if (updatedNote && updatedNote.isPinned !== !isPinned) {
        console.log("Syncing with server state")
        dispatch(togglePinNote({ id, isPinned: updatedNote.isPinned }))
      }
    } catch (err) {
      console.error("Error pin/unpin:", err)
      // Revert the optimistic update on error
      dispatch(togglePinNote({ id, isPinned }))
    } finally {
      setLoadingStates((prev) => {
        const newPinning = new Set(prev.pinning)
        newPinning.delete(id)
        return { ...prev, pinning: newPinning }
      })
    }
  }

  // update status (archived / trashed) and move to respective slice
  const handleStatusChange = async (note, status) => {
    const actionType = status === "archived" ? "archiving" : "trashing"

    setLoadingStates((prev) => ({
      ...prev,
      [actionType]: new Set([...prev[actionType], note._id]),
    }))

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/note/${note._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      const updatedNote = res.data?.note
      if (updatedNote) {
        if (status === "archived") {
          dispatch(archiveNote(updatedNote))
        } else if (status === "trash") {
          dispatch(setTrash(updatedNote))
        }
      }
    } catch (err) {
      console.error("Error updating status:", err)
    } finally {
      setLoadingStates((prev) => {
        const newSet = new Set(prev[actionType])
        newSet.delete(note._id)
        return { ...prev, [actionType]: newSet }
      })
    }
    setOpenMenuId(null) // ✅ close menu after action
  }

  // edit handler
  const startEdit = (note) => {
    setEditingNote(note)
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      file: note.file || null,
    })
    setIsModalOpen(true)
    setOpenMenuId(null) // ✅ close menu after action
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
          <Spinner />
        </div>
      )} */}

      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Notes</h1>
          <p className="text-gray-600">Organize your thoughts and ideas in one place</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search notes..."
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
              <option value="All">All</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 relative"
              >
                {note.isPinned && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                    Pinned
                  </div>
                )}

                <div className="absolute top-3 right-3">
                  <div className="relative">
                    <button
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      onClick={() => setOpenMenuId(openMenuId === note._id ? null : note._id)}
                    >
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </button>
                    {openMenuId === note._id && (
                      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] z-10">
                        <button
                          onClick={() => togglePin(note._id, note.isPinned)}
                          disabled={loadingStates.pinning.has(note._id)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {loadingStates.pinning.has(note._id) ? (
                            <>
                              <Spinner />
                              <span>{note.isPinned ? "Unpinning..." : "Pinning..."}</span>
                            </>
                          ) : (
                            <span>{note.isPinned ? "Unpin" : "Pin"}</span>
                          )}
                        </button>
                        <button
                          onClick={() => handleStatusChange(note, "archived")}
                          disabled={loadingStates.archiving.has(note._id)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {loadingStates.archiving.has(note._id) ? (
                            <>
                              <Spinner />
                              <span>Archiving...</span>
                            </>
                          ) : (
                            <span>Archived</span>
                          )}
                        </button>
                        <button
                          onClick={() => startEdit(note)}
                          className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleStatusChange(note, "trash")}
                          disabled={loadingStates.trashing.has(note._id)}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {loadingStates.trashing.has(note._id) ? (
                            <>
                              <Spinner />
                              <span>Moving...</span>
                            </>
                          ) : (
                            <span>Trash</span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2 pr-8">{note.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 whitespace-pre-line">{note.content}</p>
                  {note.noteAttachment && note.noteAttachment.length > 0 && (
                    <div className="mb-3">
                      {note.noteAttachment.map((fileUrl, idx) =>
                        fileUrl.endsWith(".pdf") ? (
                          <iframe
                            key={fileUrl || idx}
                            src={fileUrl}
                            title={`PDF-${idx}`}
                            className="w-full h-40 rounded-lg border"
                          />
                        ) : (
                          <img
                            key={fileUrl || idx}
                            src={fileUrl || "/placeholder.svg"}
                            alt={`Attachment-${idx}`}
                            className="rounded-lg max-h-40 w-full object-cover"
                          />
                        ),
                      )}
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="bg-gray-100 px-2 py-1 rounded-full">{note.category}</span>
                    <span>
                      {isClient ? (note.createdAt ? new Date(note.createdAt).toLocaleDateString() : note.date) : null}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add / Edit Modal */}
{/* Add / Edit Modal */}
{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
    {/* Background blur */}
    <div className="absolute inset-0 backdrop-blur-sm pointer-events-none"></div>

    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto pointer-events-auto relative z-10">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{editingNote ? "Edit Note" : "Add New Note"}</h2>
        <button
          onClick={() => {
            setIsModalOpen(false)
            setEditingNote(null)
            setNewNote({ title: "", content: "", category: "Personal", file: null })
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="p-6">
        <form onSubmit={handleAddOrUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              placeholder="Enter note title..."
              value={newNote.title}
              onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={newNote.category}
              onChange={(e) => setNewNote((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Creative">Creative</option>
              <option value="Health">Health</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              rows={4}
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attach Image or PDF</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) =>
                setNewNote((prev) => ({ ...prev, file: e.target.files ? e.target.files[0] : null }))
              }
              className="w-full text-sm text-gray-600"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setEditingNote(null)
                setNewNote({ title: "", content: "", category: "Personal", file: null })
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loadingStates.addingNote}
              className={`flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                loadingStates.addingNote ? "opacity-75" : ""
              }`}
            >
              {loadingStates.addingNote ? (
                <>
                  <Spinner />
                  <span>{editingNote ? "Updating..." : "Adding..."}</span>
                </>
              ) : (
                <span>{editingNote ? "Update Note" : "Add Note"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}



    </div>
  )
}
