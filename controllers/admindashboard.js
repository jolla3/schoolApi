const{User,Teacher,Parent,Classroom,Student}=require('../models/schoolDb')

// get dashboard
exports.adminDashStats= async(req,res)=>{
    try {
        // we run all count oparations parellel for better performance
        const [
          totalStudents,totalTeachers,totalClassrooms,totalParents,activeUsers,] = 
        await Promise.all([
          Student.countDocuments(),
          Teacher.countDocuments(),
          Classroom.countDocuments(),
          Parent.countDocuments(),
          User.countDocuments({ isActive: true }),
        ]);

        // get the most recent students to be registerd(sorted by newest)
        const recentStudents = await Student.find()
        .sort({ createdAt: -1})
        .limit(5) 
        
        // get the most recent teachers to be registerd(sorted by newest)
        const recentTeachers = await Teacher.find()
          .sort({ createdAt: -1 })
          .limit(5); 
        
        // return all stats
        res.status(200).json({totalStudents,
            totalTeachers,
            totalClassrooms,
            totalParents,
            activeUsers,
            recentStudents,
            recentTeachers  })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
 