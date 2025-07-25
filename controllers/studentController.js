const { Student,Classroom,Parent } = require("../models/schoolDb")

const multer=require('multer')
const fs= require('fs')
const path=require('path');
const { populate } = require("dotenv");

// file location folder/directory
const upload = multer({ dest: "uploads" }); 
exports.UploadStudentPhoto = upload.single("file")
exports.addStudent = async (req, res) => {
  try {
    const { name, dateOfBirth, admissionNumber, parentNationalId, classroomId, gender } = req.body;

    const parentExist = await Parent.findOne({ nationalId: parentNationalId });
    if (!parentExist) return res.status(404).json({ message: "Parent not found by National ID" });

    const studentExist = await Student.findOne({ admissionNumber });
    if (studentExist) return res.status(400).json({ message: "Admission number already exists" });

    const classExist = await Classroom.findById(classroomId);
    if (!classExist) return res.status(404).json({ message: "Classroom not found" });

    let photo = null;
    if (req.file) {
      try {
        const ext = path.extname(req.file.originalname);
        const newfileName = Date.now() + ext;
        const newPath = path.join('uploads', newfileName);
        fs.renameSync(req.file.path, newPath);
        photo = newPath.replace(/\\/g, '/');
      } catch (fileErr) {
        return res.status(500).json({ message: "File upload failed", error: fileErr.message });
      }
    }

    const newStudent = new Student({
      name, dateOfBirth, gender, admissionNumber, photo,
      parent: parentExist._id, classroom: classExist._id
    });

    const savedStudent = await newStudent.save();

    await Classroom.findByIdAndUpdate(classExist._id, {
      $addToSet: { students: savedStudent._id }
    });

    res.status(201).json({ message: "Student added successfully", savedStudent });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.findById(req.params.id)
          .populate("classroom")
          .populate("parent");
        if(!students)
            return res.status(404).json({ message: "No students found" })
        res.status(200).json(students);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get by id
exports.getStudentsbyId=






// update student
exports.updateStudent= async(req,res)=>{
    try {
        const updateStudent = await Student.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        )
        if(!updateStudent)
            return res.status(404).json({ message: "No student found" })
        res.status(200).json(updateStudent)
    } catch (error) {
       res.status(500).json({ message: error.message }) 
    }
}


// delete student
exports.deleteStudent=async(req,res)=>{
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id)
    if(!deletedStudent)
        return res.status(404).json({ message: "No student found" })
   
    // remove the student from the classroom
    await Classroom.updateMany(
      {student:deletedStudent._id},
      { $pull: { student: deletedStudent._id } }
      )
  
    res.status(200).json({ message: "student deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
}