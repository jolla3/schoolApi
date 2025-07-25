const { User, Assigment, Classroom } = require('../models/schoolDb')

// teachers dashboard

exports.teacherDash = async (req, res) => {
    try {
        // the logged in user who is the teacher
        const userId = req.user.userId
        // fetch the teachers object from ehe id of the user
        const user = await User.findById(userId)

        // check if user is a teacher
        if (!user || !user.teacher)
            return res.status(400).json({ message: "teacher not found or linked to " });

        // extract the teacher id from the user object
        const teacherId = user.teacher

        // AGGREGATE THE Classroom to get the class count and the student total
        const classStat = await Classroom.aggregate([
            {
                $match: { teacher: teacherId }
            },
            {
                $group: {
                    _id: null,
                    classCount: { $sum: 1 },
                    studentTotal: { $sum: "$studentCount" }
                }
            }

        ])

        // count the assigments
        const totalAssigments = await Assigment.countDocuments({
          postedBy: teacherId,
        })
        // prepare the results
        const results = {
            totalClasses:classStat[0]?.totalClasses || 0,
            totalStudents: classStat[0]?.totalStudents || 0,
            totalAssigments
        }
        res.status(200).json(results);


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}