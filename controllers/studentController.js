//database
const {Student , Classroom, Parent}=require('../models/schoolDb')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
//file location folder
const upload = multer({dest: 'uploads/'})
exports.uploadStudentPhoto = upload.single('photo')
exports.addStudent = async (req, res) => {
    try {
        //destructure
        const{name,dateOfBirth,gender,admissionNumber,parentNationalId,classroomID}=req.body
        //check if parent exists
        const existParent = await Parent.findOne({nationalId:parentNationalId})
        if(!existParent){
            return res.json({message:"Parent with provided ID does not exist"})
        }
        const existStudent = await Student.findOne({admissionNumber})
        //check if the admisssion is already taken
        if(existStudent){
            return res.json({message:"Admission Number already exists"})
        }
        //check if classroom exists
        const existClassroom = await Classroom.findById(classroomID)
        if(!existClassroom){
            return res.json({message:"Classroom does not exist"})
        }
        //prep the student photo
        let photo = null
        if(req.file){
            const ext = path.extname(req.file.originalname)
            const newFilename = Date.now() + ext
            const newPath = path.join('uploads', newFilename)
            fs.renameSync(req.file.path, newPath)
            photo = newPath.replace(/\\/g, '/')
        }
        // create Student
        const newStudent = new Student({
            name,
            dateOfBirth,
            gender,
            admissionNumber,
            classroom: classroomID,
            parent: existParent._id,
            photo
        })
        const savedStudent = await newStudent.save()
        // adding a student to classroom using the addToSet to avoid duplication
        await Classroom.findByIdAndUpdate(classroomID,{$addToSet:{students:savedStudent._id}})
        res.json({ message: 'Student created successfully', student: savedStudent })

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message })        
    }
}

//get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
        .populate('classroom','name gradeLevel classYear')
        .populate('parent','name email phone')
        res.json(students)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}

// get student by id
exports.getStudentById = async (req, res) => {
    try {
        const studentID = req.params.id
        const student = await Student.findById(studentID)
        .populate('classroom','name gradeLevel classYear')
        .populate('parent','name email phone')
        if(!student){
            return res.json({message:"Student does not exist"})
            }
        res.json(student)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
 }

 // update student 
 exports.updateStudent = async (req, res) => {
     try {
         const studentID = req.params.id
         const updatedStudent = await Student.findByIdAndUpdate(studentID, req.body, { new: true })
         if (!updatedStudent) {
             return res.json({ message: 'Student not found' })
         }
         res.json({ message: 'Student updated successfully', student: updatedStudent })
     } catch (error) {
         res.status(500).json({ message: 'Internal server error', error: error.message })
     }
 }

 //delete student
 exports.deleteStudent = async (req, res) => {
    try {
        const studentID = req.params.id
        const deletedStudent = await Student.findByIdAndDelete(studentID)
        if (!deletedStudent) {
            return res.json({ message: 'Student not found' })
        }

         // remove photo from storage
        if (deletedStudent.photo && fs.existsSync(deletedStudent.photo)) {
            fs.unlinkSync(deletedStudent.photo)
        }
        
        //remove student from classroom
        await Classroom.updateMany(
            { students: deletedStudent._id },
             { $pull: { students: deletedStudent._id } })
        res.json({ message: 'Student deleted successfully', student: deletedStudent })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}