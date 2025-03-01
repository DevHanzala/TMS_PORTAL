import User from "../models/userModel.js";

// ✅ Fetch all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    // Convert image binary data to base64 for client-side display
    const usersWithImages = users.map((user) => ({
      ...user.toJSON(),
      image: user.image ? `data:image/jpeg;base64,${user.image.toString("base64")}` : null,
    }));

    res.status(200).json(usersWithImages);
  } catch (error) {
    console.error("Fetch error:", error.stack); // Improved error logging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Register a new user
export const registerUser = async (req, res) => {
  try {
    const { 
      employee_id, 
      registration_date, 
      joining_date, 
      post_applied_for, 
      full_name, 
      gender, 
      cnic, 
      dob, 
      permanent_address, 
      contact_number, 
      email,
      degree,
      institute,
      grade,
      year,
      teaching_subjects,
      teaching_institute,
      teaching_contact,
      position,
      organization,
      skills,
      description,
      in_time,
      out_time,
      Salary_Cap
    } = req.body;

    if (req.file && req.file.mimetype !== "image/jpeg") {
      return res.status(400).json({ message: "Only JPEG images are allowed." });
    }
    const image = req.file ? req.file.buffer : null;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({
      employee_id, 
      registration_date, 
      joining_date, 
      post_applied_for, 
      full_name, 
      gender, 
      cnic, 
      dob, 
      permanent_address, 
      contact_number, 
      email,
      image,
      degree,
      institute,
      grade,
      year,
      teaching_subjects,
      teaching_institute,
      teaching_contact,
      position,
      organization,
      skills: skills ? JSON.parse(skills) : null, // Safely parse skills or set to null
      description,
      in_time,
      out_time,
      Salary_Cap
    });

    console.log("User created:", newUser.toJSON()); // Log successful creation
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration error:", error.stack); // Improved error logging
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// ✅ Update user by ID
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { 
      employee_id, 
      registration_date, 
      joining_date, 
      post_applied_for, 
      full_name, 
      gender, 
      cnic, 
      dob, 
      permanent_address, 
      contact_number, 
      email,
      degree,
      institute,
      grade,
      year,
      teaching_subjects,
      teaching_institute,
      teaching_contact,
      position,
      organization,
      skills,
      description,
      in_time,
      out_time,
      Salary_Cap
    } = req.body;

    if (req.file && req.file.mimetype !== "image/jpeg") {
      return res.status(400).json({ message: "Only JPEG images are allowed." });
    }
    const image = req.file ? req.file.buffer : user.image;

    await user.update({
      employee_id: employee_id || user.employee_id,
      registration_date: registration_date || user.registration_date,
      joining_date: joining_date || user.joining_date,
      post_applied_for: post_applied_for || user.post_applied_for,
      full_name: full_name || user.full_name,
      gender: gender || user.gender,
      cnic: cnic || user.cnic,
      dob: dob || user.dob,
      permanent_address: permanent_address || user.permanent_address,
      contact_number: contact_number || user.contact_number,
      email: email || user.email,
      image,
      degree: degree || user.degree,
      institute: institute || user.institute,
      grade: grade || user.grade,
      year: year || user.year,
      teaching_subjects: teaching_subjects || user.teaching_subjects,
      teaching_institute: teaching_institute || user.teaching_institute,
      teaching_contact: teaching_contact || user.teaching_contact,
      position: position || user.position,
      organization: organization || user.organization,
      skills: skills ? JSON.parse(skills) : user.skills,
      description: description || user.description,
      in_time: in_time || user.in_time,
      out_time: out_time || user.out_time,
      Salary_Cap: Salary_Cap || user.Salary_Cap
    });

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update error:", error.stack); // Improved error logging
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// ✅ Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.stack); // Improved error logging
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};