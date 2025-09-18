import { createSlice } from "@reduxjs/toolkit";

let userNote = null;
let userArchived = null;
let userTrash = null;

if (typeof window !== "undefined") {
  const storedUserNotes = localStorage.getItem("userNotes");
  const storedUserArchived = localStorage.getItem("userArchived");
  const storedUserTrash = localStorage.getItem("userTrash");

  if (storedUserNotes && storedUserNotes !== "undefined") {
    userNote = JSON.parse(storedUserNotes);
  }

  if (storedUserArchived && storedUserArchived !== "undefined") {
    userArchived = JSON.parse(storedUserArchived);
  }

  if (storedUserTrash && storedUserTrash !== "undefined") {
    userTrash = JSON.parse(storedUserTrash);
  }
}

const initialState = {
  note: userNote || [],
  archived: userArchived || [],
  trash: userTrash || [],
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setUserNotes: (state, action) => {
      state.note = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userNotes", JSON.stringify(state.note));
      }
    },
    addNote: (state, action) => {
      state.note.push(action.payload); 
      if (typeof window !== "undefined") {
        localStorage.setItem("userNotes", JSON.stringify(state.note));
      }
    },
    archiveNote: (state, action) => {
      state.note = state.note.filter((note) => note._id !== action.payload._id);
      state.archived.push(action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("userNotes", JSON.stringify(state.note));
        localStorage.setItem("userArchived", JSON.stringify(state.archived));
      }
    },
    setArchivedNotes :(state,action)=>{
      state.archived = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userArchived", JSON.stringify(state.archived));
      }
    },
   setTrash: (state, action) => {
  if (Array.isArray(action.payload)) {
    // overwrite with array (when fetching from backend)
    state.trash = action.payload;
  } else {
    // single note (when moving one note to trash)
    state.note = state.note.filter((note) => note._id !== action.payload._id);
    state.trash.push(action.payload);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("userNotes", JSON.stringify(state.note));
    localStorage.setItem("userTrash", JSON.stringify(state.trash));
  }
},

    // ✅ NEW reducer for pin/unpin
    togglePinNote: (state, action) => {
      const { id, isPinned } = action.payload;
      state.note = state.note.map((note) =>
        note._id === id ? { ...note, isPinned } : note
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("userNotes", JSON.stringify(state.note));
      }
    },
     removeFromArchive: (state, action) => {
      state.archived = state.archived.filter(note => note._id !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("userArchived", JSON.stringify(state.archived));
      }
    },
    
    // ✅ NEW reducer for adding to active notes from archive
    unarchiveNote: (state, action) => {
      const noteToUnarchive = state.archived.find(note => note._id === action.payload);
      if (noteToUnarchive) {
        state.archived = state.archived.filter(note => note._id !== action.payload);
        state.note.push({...noteToUnarchive, status: "active"});
        
        if (typeof window !== "undefined") {
          localStorage.setItem("userNotes", JSON.stringify(state.note));
          localStorage.setItem("userArchived", JSON.stringify(state.archived));
        }
      }
    },
    removeFromTrash: (state, action) => {
  state.trash = state.trash.filter(note => note._id !== action.payload);
  if (typeof window !== "undefined") {
    localStorage.setItem("userTrash", JSON.stringify(state.trash));
  }
},
restoreFromTrash: (state, action) => {
  const noteToRestore = state.trash.find(note => note._id === action.payload);
  if (noteToRestore) {
    state.trash = state.trash.filter(note => note._id !== action.payload);
    state.note.push({...noteToRestore, status: "active"});
    
    if (typeof window !== "undefined") {
      localStorage.setItem("userNotes", JSON.stringify(state.note));
      localStorage.setItem("userTrash", JSON.stringify(state.trash));
    }
  }
}
  }
});

export const { 
  addNote,
  setUserNotes,
  archiveNote,
  setTrash,
  setArchivedNotes,
  togglePinNote, // ✅ export new reducer
  removeFromArchive,
  unarchiveNote,
  removeFromTrash,
  restoreFromTrash
} = noteSlice.actions;

export default noteSlice.reducer;
