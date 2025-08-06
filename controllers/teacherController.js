const{Teacher,User, Classroom}= require('../models/schoolDb')
const bcrypt = require('bcryptjs');
// add a teacher
exports.addTeacher = async (req, res) => {
    try {
        // check if user exists
        const {email}= req.body
        const existEmail= await Teacher.findOne({email})
        if (existEmail) return res.json({message:"Email already existing"})
         
        const existUserEmail= await Teacher.findOne({email})
        if (existUserEmail) return res.json({message:"Email already existing"})

            // create the new Teacher
            const newTeacher= new Teacher(req.body)
            const savedTeacher= await newTeacher.save()
             
            // we create a corresponding 
            const defaultPassword= "teacher11234"
            const password= await bcrypt.hash(defaultPassword,10)
            const newUser= new User({
                name:savedTeacher.name,
                email:savedTeacher.email,
                password,
                role:"teacher",
                teacher:savedTeacher._id
            })
            await newUser.save()
            res.status(201).json({message:`Teacher  ${savedTeacher.name},registered succesfully`,newUser} )
    } catch (error) {
        res.json({message:error.message})
    }
}


exports.getAllTeachers= async(req,res)=>{
    try {
      console.log("getTeacher")
          const classroom= await Teacher.find()
        res.json(classroom)
    } catch (error) {
      console.log("catch")
      console.log(error)
        res.json({message:error.message})
    }
}

// get by Id
exports.getTeacherById= async (req, res) => {
    try {
        const teacher= await Teacher.findById(req.params.id)
        if (!teacher) return res.json({message:"Teacher not found"})
            res.json({teacher})
    } catch (error) {
        res.json({message:error.message})
    }
}

exports.updateTeacher = async (req, res) => {
  try {
    const userId = req.params.id
    const teacherId = req.params.id;

    const { name, email, password, ...otherFields } = req.body;
    const existUser= await User.findById(userId);
    if (!existUser) {
      return res.json({ message: 'User not found' });
    }
    // 1. Update teacher info
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { name, email, ...otherFields },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.json({ message: 'Teacher not found' });
    }

    // 2. Find and update the corresponding user
    const user = await User.findOne({ teacher: teacherId });
    if (!user) {
      return res.json({ message: 'Linked user not found' });
    }

    // 3. Update user fields
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: 'Teacher and linked user updated successfully',
      updatedTeacher,
      updatedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.json({ message: error.message });
  }
}

// delete classroom

exports.deledtTeacher= async (req,res)=>{
    // find the class room and delete by id
    try {
        const deledtTeacher= await Teacher.findByIdAndDelete(req.params.id)
        if(!deledtTeacher) return res.json({message:"Classroom Not Found"})

        await Classroom.updateMany(
            {classroom:deledtTeacher._id},
            {$set:{teacher:null}}
        )
  
            res.json({message:` Teacher ${deledtTeacher.name} deleted succesfully`})
    } catch (error) {
                res.json({message:error.message})

    }
}


// get teacher
exports.getMyClasses = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("teacher");

    if (!user || !user.teacher) {
      return res.json({ message: "Teacher not found" });
    }

    const classes = await Classroom.find({ teacher: user.teacher._id })
      .populate('students');

    res.json({ message: "Classes", classes });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};


exports.getMyAssigments = async (req, res) => {
  try {
    const userId = req.user.userId
    const user = await User.findById(userId).populate("teacher");

    if (!user || !user.teacher) {
      return res.json({ message: "Teacher not found" });
    }

    const assigments = await Classroom.find({ postedBy: user.teacher._id })
      .populate('classroom', 'name gradeLevel classYear')
      .populate('postedBy', 'name email phone');

    res.json({ message: "Assignments fetched", assigments });
  } catch (error) {
    res.json({ message: error.message });
  }
}



