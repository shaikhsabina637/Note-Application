import express from "express"
import { addNote, deleteNote, editNote, pinnedNote, unPinnedNote, userNotes ,getActiveNotes,getTrashNotes,getArchivedNotes,updateNoteStatus} from "../controllers/note.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/addnote",auth,addNote)
router.patch("/updatenote/:id",auth,editNote)
router.delete("/deletenote/:noteId",auth,deleteNote)
router.get("/usernotes",auth,userNotes)
router.patch("/pinnednote/:noteId",auth,pinnedNote)
router.patch("/unpinnednote/:noteId",auth,unPinnedNote)
router.get("/active", auth, getActiveNotes)
router.get("/archived", auth, getArchivedNotes)
router.get("/trash", auth, getTrashNotes)
router.put("/:noteId/status", auth, updateNoteStatus)
export default router;