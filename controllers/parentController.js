const { Parent, User } = require('../models/schoolDb');
const bcrypt = require('bcrypt');

// Add parent
exports.addParent = async (req, res) => {
    try {
        const { email, nationalId, name } = req.body;

        // Check if email already exists in User
        const existingParentEmail = await User.findOne({ email });
        if (existingParentEmail) {
            return res.json({ message: 'A user already exists with this email address' });
        }

        // Check if parent already exists with the same national ID
        const existingParentId = await Parent.findOne({ nationalId });
        if (existingParentId) {
            return res.json({ message: 'A parent already exists with this National ID' });
        }

        // Save new parent
        const newParent = new Parent(req.body);
        const savedParent = await newParent.save();

        // Hash default password
        const defaultPassword = 'parent1234';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create user account
        const newUser = new User({
            email,
            password: hashedPassword,
            role: 'parent',
            parent: savedParent._id,
            name,
        });

        await newUser.save();

        res.json({ parent: savedParent, message: 'Parent account created successfully' });

    } catch (error) {
        console.error('Error creating parent:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// get all parent
exports.getAllParents = async (req, res) => {
    try {
        const parents = await Parent.find();
        res.json(parents);
        console.log(parents)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}


// update parent by admin
exports.updateParent = async (req, res) => {
    try {
        const updateParent = await Parent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true })

        if (!updateParent)
            return res.json({ message: 'Parent not found' })
        res.json({ updateParent, message: 'Parent updated successfully' });
        res.json(updateParent);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// delete parent by admin
exports.deleteParent = async (req, res) => {
  try {
    const deleteParent = await Parent.findByIdAndDelete(req.params.id);
    if (!deleteParent)
      return res.json({ message: `Parent  not found `});
    res
      
      .json({ message: `Parent ${deleteParent.name} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

