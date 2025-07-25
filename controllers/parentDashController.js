const {User,Parent,Classroom, Student, Assignment}= require('../models/schoolDb')



// get the chilren belonging to the logged in parernt
exports.parentDash= async(req,res)=>{
    try {
        // get loggeeeeeeed in user to link with the parent
        const userId= req.user.userId
        // find the parent using the user userId
        const user = await User.findById(userId)
        .populate("parent");
        console.log(user);
        const parent= user.parent
        // find the children belonging to the parent
        const children= await Student.find({parent:parent._id})
        .populate('classroom')
        console.log("children",children);
        
        res.status(200).json({parent,children})
        // res.status(200).json(parent)

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// get the students Assigment
exports.getClassAssigments= async(req,res)=>{
    try {
        const assigments = await Assigment.find({
            classroom:req.params.id})
            .populate('postedBy')
            .sort({dueDate:1})
            res.json(assigment)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
