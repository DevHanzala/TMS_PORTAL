import React, { useState, useEffect } from "react";
import { useUserStore } from "../Store/userStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "../Scheema/userScheema";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaGraduationCap, FaBriefcase, FaPlus, FaArrowRight, FaArrowLeft, FaCheckCircle, FaClock, FaMoneyBillWave, FaSchool, FaChalkboardTeacher, FaPhone, FaHeartbeat } from "react-icons/fa";

// Popup Message Component
const PopupMessage = ({ message, type }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

const RegisterUser = () => {
  const { registerUser, loading, error } = useUserStore();
  const [imagePreview, setImagePreview] = useState(null);
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [popupMessage, setPopupMessage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({ resolver: zodResolver(registerUserSchema), mode: "onChange" });

  const formValues = watch();

  const requiredFields = [
    "employee_id", "registration_date", "joining_date", "post_applied_for",
    "full_name", "gender", "cnic", "dob", "permanent_address", "contact_number",
    "email", "degree", "institute", "grade", "year", "in_time", "out_time",
    "Salary_Cap", "guardian_phone"
  ];

  useEffect(() => {
    const totalRequiredFields = requiredFields.length;
    const filledRequiredFields = requiredFields.filter(field =>
      formValues[field] !== undefined && formValues[field] !== ""
    ).length;
    const optionalFields = Object.keys(formValues).filter(key => !requiredFields.includes(key));
    const filledOptionalFields = optionalFields.filter(field =>
      formValues[field] !== undefined && formValues[field] !== ""
    ).length;
    const totalFields = requiredFields.length + optionalFields.length;
    const baseProgress = (filledRequiredFields / totalRequiredFields) * 100;
    const optionalBonus = optionalFields.length > 0 ? (filledOptionalFields / totalFields) * 10 : 0;
    setProgress(Math.min(baseProgress + optionalBonus, 100));
  }, [formValues]);

  const showPopup = (text, type = "success") => {
    setPopupMessage({ text, type });
    setTimeout(() => setPopupMessage(null), 3000); // Auto-dismiss after 3 seconds
  };

  const onSubmit = async (data) => {
    if (!isValid) {
      console.error("❌ Validation failed:", errors);
      showPopup("Validation failed. Please check your inputs.", "error");
      return;
    }

    try {
      const result = await registerUser(data);
      if (result) {
        showPopup("User added successfully!");
        reset();
        setImagePreview(null);
        setStep(1);
        setProgress(0);
      }
    } catch (error) {
      console.error("❌ Submission error:", error);
      showPopup(error.message || "Failed to register user", "error");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      const step1Required = ["full_name", "email", "gender", "cnic", "dob", "contact_number", "permanent_address", "guardian_phone"];
      const hasErrors = step1Required.some((field) => errors[field]);
      if (!hasErrors) setStep(2);
    } else if (step === 2) {
      const step2Required = ["degree", "institute", "grade", "year"];
      const hasErrors = step2Required.some((field) => errors[field]);
      if (!hasErrors) setStep(3);
    }
  };

  const prevStep = () => setStep(step - 1);

  const hasDisease = watch("has_disease") === "Yes";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaUser className="mr-2" /> Register Employee
      </h2>

      {error && !popupMessage && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <motion.div
          className="bg-gray-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-4 border-b pb-4">
                <h3 className="text-lg font-semibold flex items-center"><FaUser className="mr-2" /> Personal Information</h3>
                <input type="text" {...register("full_name")} placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.full_name && <p className="text-red-500">{errors.full_name.message}</p>}

                <input type="email" {...register("email")} placeholder="Email Address" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                <select {...register("gender")} defaultValue="" className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="" disabled>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}

                <input type="text" {...register("cnic")} placeholder="CNIC Number (13 digits)" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.cnic && <p className="text-red-500">{errors.cnic.message}</p>}

                <label className="text-sm font-thin">Date of Birth</label>
                <input type="date" {...register("dob")} className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}

                <input type="text" {...register("contact_number")} placeholder="Contact Number (11 digits)" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.contact_number && <p className="text-red-500">{errors.contact_number.message}</p>}

                <input type="text" {...register("permanent_address")} placeholder="Permanent Address" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.permanent_address && <p className="text-red-500">{errors.permanent_address.message}</p>}

                <input
                  type="text"
                  {...register("guardian_phone")}
                  placeholder="Guardian/Alternate Phone (11 digits)"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.guardian_phone && <p className="text-red-500">{errors.guardian_phone.message}</p>}

                <input
                  type="text"
                  {...register("reference_name")}
                  placeholder="Reference Person Name (optional)"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.reference_name && <p className="text-red-500">{errors.reference_name.message}</p>}

                <input
                  type="text"
                  {...register("reference_contact")}
                  placeholder="Reference Contact (11 digits, optional)"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.reference_contact && <p className="text-red-500">{errors.reference_contact.message}</p>}

                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border border-gray-300 rounded-md" />
                {imagePreview && (
                  <motion.img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-md border border-gray-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                {errors.image && <p className="text-red-500">{errors.image.message}</p>}
              </div>

              <motion.button
                type="button"
                onClick={nextStep}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={Object.keys(errors).length > 0}
              >
                Next <FaArrowRight className="ml-2" />
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-4 border-b pb-4">
                <h3 className="text-lg font-semibold flex items-center"><FaGraduationCap className="mr-2" /> Last Education</h3>
                <input type="text" {...register("degree")} placeholder="Degree" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.degree && <p className="text-red-500">{errors.degree.message}</p>}

                <input type="text" {...register("institute")} placeholder="Institute" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.institute && <p className="text-red-500">{errors.institute.message}</p>}

                <input type="text" {...register("grade")} placeholder="Grade" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.grade && <p className="text-red-500">{errors.grade.message}</p>}

                <input type="number" {...register("year")} placeholder="Year" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.year && <p className="text-red-500">{errors.year.message}</p>}
              </div>

              <div className="space-y-4 border-b pb-4">
                <h3 className="text-lg font-semibold flex items-center"><FaChalkboardTeacher className="mr-2" /> Past Teaching Experience</h3>
                <input type="text" {...register("teaching_subjects")} placeholder="Teaching Subjects (optional)" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.teaching_subjects && <p className="text-red-500">{errors.teaching_subjects.message}</p>}

                <input type="text" {...register("teaching_institute")} placeholder="Teaching Institute (optional)" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.teaching_institute && <p className="text-red-500">{errors.teaching_institute.message}</p>}

                <input
                  type="text"
                  {...register("teaching_contact")}
                  placeholder="Teaching Contact (11 digits, optional)"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.teaching_contact && <p className="text-red-500">{errors.teaching_contact.message}</p>}
              </div>

              <div className="space-y-4 border-b pb-4">
                <h3 className="text-lg font-semibold flex items-center"><FaBriefcase className="mr-2" /> Other Experience</h3>
                <input type="text" {...register("position")} placeholder="Position (optional)" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.position && <p className="text-red-500">{errors.position.message}</p>}

                <input type="text" {...register("organization")} placeholder="Organization (optional)" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.organization && <p className="text-red-500">{errors.organization.message}</p>}

                <input
                  type="text"
                  {...register("skills")}
                  placeholder="Skills (e.g., Java,C++,Python, optional)"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => setValue("skills", e.target.value)}
                />
                {errors.skills && <p className="text-red-500">{errors.skills.message}</p>}
              </div>

              <div className="flex justify-between">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowLeft className="mr-2" /> Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={Object.keys(errors).length > 0}
                >
                  Next <FaArrowRight className="ml-2" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-4 border-b pb-4">
                <h3 className="text-lg font-semibold flex items-center"><FaSchool className="mr-2" /> Office Details</h3>
                <input type="text" {...register("employee_id")} placeholder="Employee ID" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.employee_id && <p className="text-red-500">{errors.employee_id.message}</p>}

                <label className="text-sm font-thin">Registration Date</label>
                <input type="date" {...register("registration_date")} className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.registration_date && <p className="text-red-500">{errors.registration_date.message}</p>}

                <label className="text-sm font-thin">Joining Date</label>
                <input type="date" {...register("joining_date")} className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.joining_date && <p className="text-red-500">{errors.joining_date.message}</p>}

                <select {...register("post_applied_for")} defaultValue="" className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="" disabled>Post Applied For</option>
                  <option value="Employee">Employee</option>
                  <option value="Internship">Internship</option>
                </select>
                {errors.post_applied_for && <p className="text-red-500">{errors.post_applied_for.message}</p>}

                <label className="font-thin text-sm">Check-In-Time</label>
                <input
                  type="time"
                  {...register("in_time")}
                  placeholder="In Time (e.g., 09:00)"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.in_time && <p className="text-red-500">{errors.in_time.message}</p>}

                <label className="font-thin text-sm">Check-Out-Time</label>
                <input
                  type="time"
                  {...register("out_time")}
                  placeholder="Out Time (e.g., 16:00)"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.out_time && <p className="text-red-500">{errors.out_time.message}</p>}

                <motion.input
                  type="number"
                  {...register("Salary_Cap")}
                  placeholder="Salary Cap (e.g., 50000)"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
                {errors.Salary_Cap && <p className="text-red-500">{errors.Salary_Cap.message}</p>}

                <textarea {...register("description")} placeholder="Description (optional)" className="w-full p-2 border border-gray-300 rounded-md" />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-4 border-b pb-4">
                <h3 className="text-lg font-semibold flex items-center"><FaHeartbeat className="mr-2" /> Health Information</h3>
                <select
                  {...register("has_disease")}
                  defaultValue=""
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>Any Disease?</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.has_disease && <p className="text-red-500">{errors.has_disease.message}</p>}

                {hasDisease && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <textarea
                      {...register("disease_description")}
                      placeholder="Describe the disease"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.disease_description && <p className="text-red-500">{errors.disease_description.message}</p>}
                  </motion.div>
                )}
              </div>

              <div className="flex justify-between">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowLeft className="mr-2" /> Back
                </motion.button>

                <motion.button
                  type="submit"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? "Submitting..." : "Register"} <FaCheckCircle className="ml-2" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      <PopupMessage message={popupMessage?.text} type={popupMessage?.type} />
    </motion.div>
  );
};

export default RegisterUser;