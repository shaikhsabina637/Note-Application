import dotenv from "dotenv"
import User from "../models/user.models.js"
import Note from "../models/note.models.js"
import {v2 as cloudinary} from "cloudinary"
dotenv.config()
// creating a note
export const addNote = async(req,res)=>{
    try{
    // get data from the user title- category - content - image or pdf 
    const {title,category,content} = req.body;
    // Object.values() ek JavaScript built-in method hai jo kisi object ke saare values ko ek array me convert karta hai.iske key ko ignore karta hai req.files:{file 1: name :cat} result [name]
    const attachments= req.files ? Object.values(req.files) : []
    // validate the information
    if(!title || !category){
        return res.status(400).json({
            success:false,
            message:"Title and Category is must!"
        })
    }
    if(!content && attachments.length == 0){
        return res.status(400).json({
            success:false,
            message:"Content or Attachement is must!"
        })
    }
    // getting user id to insert the note 
    const userId = req.user.id;
    // validate the userId 
    if(!userId){
        return res.status(400).json({
            success:false,
            message:"UserId not exits!"
        })
    }
    // if user id exits insert the note in db
    const user = await User.findById(userId)
    if(!user){
        return res.status(400).json({
            success:false,
            message:"Can't find user with this id!"
        })
    }
     // Upload attachments to Cloudinary (agar files hain)
    let uploadedFiles = [];
    if (attachments.length > 0) {
      for (let file of attachments) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "notes-app",
          resource_type: "auto", // images/pdfs/videos all
        });

        uploadedFiles.push(
           result.secure_url,
        );
      }
    }
    const note = await Note.create({
       user:userId,
       title,
       category,
       content: content || null,
       noteAttachment:uploadedFiles,
    })
    user.notes.push(note._id)
    await user.save()
    // return response 
    return res.status(200).json({
        success:true,
        message:"Note created",
        note,
    })
    }catch(error){
       console.log(error)
       return res.status(500).json({
        success:false,
        message:"Error in server Try Again later!",
        error:error.message
       })
    }
   
}
// editing a note
export const editNote = async (req, res) => {
  try {
    // get the data from the user 
    const { title, category, content } = req.body;
    const noteId = req.params.id;

    // Handle file input properly (single or multiple)
    let attachments = [];
    if (req.files && req.files.attachments) {
      if (Array.isArray(req.files.attachments)) {
        attachments = req.files.attachments; // multiple files
      } else {
        attachments = [req.files.attachments]; // single file
      }
    }

    // validate the data from the user
    if (!title && !category && !content && attachments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Data Provided to update!",
      });
    }

    // find the user by id
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Don't find user",
      });
    }

    // find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    // Upload new files if available
    let uploadedFiles = [];
    if (attachments.length > 0) {
      for (let file of attachments) {
        if (!file.tempFilePath) {
          return res.status(400).json({
            success: false,
            message: "File upload error: tempFilePath missing",
          });
        }

        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "notes-app",
          resource_type: "auto", // images/pdfs/videos all
        });

        uploadedFiles.push(result.secure_url);
      }
    }

    // find note with id 
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(400).json({
        success: false,
        message: "Can't find Note",
      });
    }

    // update fields
    if (title) note.title = title;
    if (category) note.category = category;
    if (content) note.content = content;
    if (attachments.length > 0) note.noteAttachment = uploadedFiles;

    await note.save();

    if (!user.notes.includes(note._id)) {
      user.notes.push(note._id);
      await user.save();
    }

    // return res
    return res.status(200).json({
      success: true,
      message: "Updated note!",
      note,
    });
  } catch (error) {
    console.log("Error in editNote:", error);
    return res.status(500).json({
      success: false,
      message: "Error in Server while Editing a Note!",
      error: error.message,
    });
  }
};

// deleting a note
export const deleteNote = async(req,res)=>{
      try{
        //  get the note id 
        const noteId = req.params.noteId
        if(!noteId){
            return res.status(400).json({
                success:false,
                message:"Provide noteId!"
            })
        }
        // get the user id 
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Invalid Id!"
            })
        }
        
        // find by id and the note 
        const deleteNote = await Note.findByIdAndDelete({_id:noteId},{new:true})
        await User.findByIdAndUpdate(
  userId,               // jis user ke notes me remove karna hai
  { $pull: { notes: noteId } },  // array me se noteId remove
  { new: true }         // updated document return kare
);

        // return the response
        return res.status(200).json({
            success:true,
            message:"Delete a Note!",
            deleteNote
        })
      }catch(error){
        console.log("error",error)
        return res.status(500).json({
            success:false,
            message:"Error in Server while deleting a note!",
            error:error.message
        })
      }
}
// get note of a particular user
export const userNotes = async(req,res)=>{
   try{
       
        // get the user id 
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Invalid Id!"
            })
        }
        // find user note 
        const user = await User.findById(userId).populate("notes")
        // return the response
        return res.status(200).json({
            success:true,
            message:"Fetch User Notes!",
            user,
        })
   }catch(error){
    console.log("error",error)
    return res.status(500).json({
        success:false,
        message:"Error in server while Fetching user notes",
        error:error.message
    })
   }
}
// pinned a note 
export const pinnedNote = async (req,res)=>{
       try{
        // get the note id 
        const noteId = req.params.noteId;
        // validate the noteid
        if(!noteId){
            return res.status(400).json({
                success:false,
                message:"Invalid Id!"
            })
        }
        // find note by id and update the note doc
        const pinnedNote = await Note.findByIdAndUpdate(noteId,
        {
          $set:{isPinned:true}
        },{new:true})
        // return the response
        return res.status(200).json({
            success:true,
            message:"Pinned the Note!",
            pinnedNote,
        })
       }catch(error){
         console.log("error",error);
         return res.status(500).json({
            success:false,
            message:"Error in Server while pinnedNote!",
            error:error.message
         })
       }
}
// unpinned a note 
export const unPinnedNote = async (req,res)=>{
    try{
        // get the note id 
        const noteId = req.params.noteId;
        // validate the noteid
        if(!noteId){
            return res.status(400).json({
                success:false,
                message:"Invalid Id!"
            })
        }
        // find note by id and update the note doc
        const unPinnedNote = await Note.findByIdAndUpdate(noteId,
        {
          $set:{isPinned:false}
        },{new:true})
        // return the response
        return res.status(200).json({
            success:true,
            message:"UnPinned the Note!",
            unPinnedNote,
        })
       }catch(error){
         console.log("error",error);
         return res.status(500).json({
            success:false,
            message:"Error in Server while unPinnedNote!",
            error:error.message
         })
       }
    
}
export const getActiveNotes = async (req, res) => {
    try {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId invalid!",
    });
  }

  const user = await User.findById(userId).populate({
    path: "notes",
    match: { status: "active" },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User Not Found!",
    });
  }

  return res.status(200).json({
    success: true,
    notes: user.notes, // sirf active notes milenge
  });
} catch (error) {
  console.error(error);
  return res.status(500).json({
    success: false,
    message: "Server error",
  });
}

};


// ✅ 2. Get Archived Notes
export const getArchivedNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId invalid!",
      });
    }

    // Query notes directly with the user filter
    const archivedNotes = await Note.find({
      user: userId,
      status: "archived"
    });

    return res.status(200).json({
      success: true,
      notes: archivedNotes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

// ✅ 3. Get Trash Notes
export const getTrashNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId invalid!",
      });
    }

    // Query notes directly with the user filter
    const archivedNotes = await Note.find({
      user: userId,
      status: "trash"
    });

    return res.status(200).json({
      success: true,
      notes: archivedNotes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }

}

// ✅ 4. Update Note Status (Archive / Trash / Active)
export const updateNoteStatus = async (req, res) => {
  try {
    const { noteId } = req.params
    const { status } = req.body // "archived" | "trash" | "active"

    if (!["active", "archived", "trash"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" })
    }
    const note = await Note.findById(noteId)
    if(!note){
        return res.status(400).json({
            success:false,
            message:"Invalid Note!"
        })
    }
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: req.user.id },
      { status },
      { new: true }
    )

    if (!updatedNote) {
      return res.status(404).json({ success: false, message: "Note not found" })
    }

    return res.json({ success: true, note: updatedNote })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}