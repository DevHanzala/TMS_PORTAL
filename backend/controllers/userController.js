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
    console.error("Fetch error:", error.stack);
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
      Salary_Cap,
      guardian_phone,
      reference_name,
      reference_contact,
      has_disease,
      disease_description,
    } = req.body;

    // Validate required fields based on the model
    const requiredFields = {
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
      in_time,
      out_time,
      Salary_Cap,
      guardian_phone,
      has_disease,
    };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        return res.status(400).json({ message: `${key} is required` });
      }
    }

    // Conditional validation for disease_description
    if (has_disease === "Yes" && (!disease_description || disease_description.trim() === "")) {
      return res.status(400).json({ message: "Disease description is required when has_disease is 'Yes'" });
    }

    // Validate image format
    if (req.file && req.file.mimetype !== "image/jpeg") {
      return res.status(400).json({ message: "Only JPEG images are allowed." });
    }
    const image = req.file ? req.file.buffer : null;

    // Check for existing user
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Parse skills safely
    let parsedSkills = null;
    if (skills) {
      try {
        parsedSkills = typeof skills === "string" ? JSON.parse(skills) : skills;
        if (!Array.isArray(parsedSkills) || parsedSkills.length > 5) {
          return res.status(400).json({ message: "Skills must be an array with a maximum of 5 items" });
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid skills format", error: error.message });
      }
    }

    // Convert dates and times to appropriate formats
    const formattedRegistrationDate = new Date(registration_date);
    const formattedJoiningDate = new Date(joining_date);
    const formattedDob = new Date(dob);

    if (isNaN(formattedRegistrationDate.getTime()) || isNaN(formattedJoiningDate.getTime()) || isNaN(formattedDob.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Create the user with new fields
    const newUser = await User.create({
      employee_id,
      registration_date: formattedRegistrationDate,
      joining_date: formattedJoiningDate,
      post_applied_for,
      full_name,
      gender,
      cnic,
      dob: formattedDob,
      permanent_address,
      contact_number,
      email,
      image,
      degree,
      institute,
      grade,
      year: parseInt(year, 10),
      teaching_subjects: teaching_subjects || null,
      teaching_institute: teaching_institute || null,
      teaching_contact: teaching_contact || null,
      position: position || null,
      organization: organization || null,
      skills: parsedSkills,
      description: description || null,
      in_time,
      out_time,
      Salary_Cap: parseInt(Salary_Cap, 10),
      guardian_phone,
      reference_name: reference_name || null,
      reference_contact: reference_contact || null,
      has_disease,
      disease_description: disease_description || null,
    });

    console.log("User created:", newUser.toJSON());
    res.status(201).json({ message: "User registered successfully", user: newUser.toJSON() });
  } catch (error) {
    console.error("Registration error:", error.stack);
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.errors.map((e) => e.message).join(", "),
      });
    }
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
      Salary_Cap,
      guardian_phone,
      reference_name,
      reference_contact,
      has_disease,
      disease_description,
    } = req.body;

    if (req.file && req.file.mimetype !== "image/jpeg") {
      return res.status(400).json({ message: "Only JPEG images are allowed." });
    }
    const image = req.file ? req.file.buffer : user.image;

    // Conditional validation for disease_description during update
    if (has_disease === "Yes" && (!disease_description || disease_description.trim() === "")) {
      return res.status(400).json({ message: "Disease description is required when has_disease is 'Yes'" });
    }

    // Parse skills safely (Fixed)
    let parsedSkills = user.skills; // Default to existing skills
    if (skills) {
      try {
        parsedSkills = typeof skills === "string" 
          ? JSON.parse(skills) // If skills is a JSON string like "[\"Java\", \"C++\"]"
          : skills; // If already an array (unlikely from frontend)
        if (!Array.isArray(parsedSkills) || parsedSkills.length > 5) {
          return res.status(400).json({ message: "Skills must be an array with a maximum of 5 items" });
        }
      } catch (error) {
        // If parsing fails (e.g., "Java,C++,Designing"), assume it’s a comma-separated string
        parsedSkills = skills.split(",").map(skill => skill.trim());
        if (parsedSkills.length > 5) {
          return res.status(400).json({ message: "Skills must have a maximum of 5 items" });
        }
      }
    }

    // Convert dates if provided
    const formattedRegistrationDate = registration_date ? new Date(registration_date) : user.registration_date;
    const formattedJoiningDate = joining_date ? new Date(joining_date) : user.joining_date;
    const formattedDob = dob ? new Date(dob) : user.dob;

    if ((registration_date && isNaN(formattedRegistrationDate.getTime())) ||
        (joining_date && isNaN(formattedJoiningDate.getTime())) ||
        (dob && isNaN(formattedDob.getTime()))) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    await user.update({
      employee_id: employee_id || user.employee_id,
      registration_date: formattedRegistrationDate,
      joining_date: formattedJoiningDate,
      post_applied_for: post_applied_for || user.post_applied_for,
      full_name: full_name || user.full_name,
      gender: gender || user.gender,
      cnic: cnic || user.cnic,
      dob: formattedDob,
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
      skills: parsedSkills,
      description: description || user.description,
      in_time: in_time || user.in_time,
      out_time: out_time || user.out_time,
      Salary_Cap: Salary_Cap || user.Salary_Cap,
      guardian_phone: guardian_phone || user.guardian_phone,
      reference_name: reference_name || user.reference_name,
      reference_contact: reference_contact || user.reference_contact,
      has_disease: has_disease || user.has_disease,
      disease_description: disease_description || user.disease_description,
    });

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update error:", error.stack);
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
    console.error("Delete error:", error.stack);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};