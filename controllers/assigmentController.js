const {Assigment,User,Classroom}= require('../models/schoolDb')

// get all assigment(admin view
exports.getAllAssigment=async(req,res)=>{
    try {
        const assigments= await Assigment.find()
        .populate('classroom','name gradeLevel ClassYear')
        .populate('postedBy', 'name email phone')
        res.status(200).json(assigments)
    
        
    } catch (error) {
        req.status(400).json({
            message:error.message
        })
    }
}


// add assigment only teachers
// validate user and Classroom existence

exports.addAssigment= async(req,res)=>{
    try {
        // get logged in User
        const userId= req.user.userId
        // fetch the users and populate the teacher field if it exists/
        console.log(userId)
        const user= await User.findById(userId)
        .populate('teacher')

        // BLOCK NON EACHERR FROM POSTING
        if(!user || !user.teacher) return res.status(403).json({
            message:'Only teachers can add assigments'
        })

        // extract the classroomId from the posting/
        const {classroom:classroomId}= req.body

        // check if the classroom exists first
        const classroomExist= await Classroom.findById(classroomId)
        if(!classroomExist) return res.status(404).json({
            message:'Classroom does not exist'
        })

        // prepare the assigments data
        const assigmentData= { 
            ...req.body,
            
            postedBy: user.teacher._id,
        }
        // save the assigment to the db
        const newAssigment= new Assigment(assigmentData)
        const SavedAssigment=await newAssigment.save()
        res.status(201).json({
            message:'Assigment added successfully', SavedAssigment
        })

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

// single assigment
exports.getAssigmentById= async(req,res)=>{
    try {
        const assigment= await Assigment.findById(req.params.id)
        .populate('classroom')
        .populate('postedBy')

        if (!assigment)
            return res.status(404).json({message:" Assigment not found"})
        res.json(assigment)

    } catch (error) {
        res.status(500).json({
            message:error.message
        }) 
    }
}

// update assigment
exports.updateAssigment= async(req,res)=>{
    try {
        // find the asssignment by first

        const assignments= await Assigment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        if (!updateAssigment) 
            return res.status(404).json({message:" Assigment not found"})
        res.status(201).json({message:"Assigment Updated Succesfully",updateAssigment}) 
        } catch (error) {
            res.status(500).json({
                message:error.message
                })
}
}

// getteachers assigment
// included classroom and teacher info
