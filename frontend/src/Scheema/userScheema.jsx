import z from "zod";

export const registerUserSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  registration_date: z.coerce.date().refine((date) => !isNaN(date.getTime()), { message: "Invalid Registration Date" }),
  joining_date: z.coerce.date().refine((date) => !isNaN(date.getTime()), { message: "Invalid Joining Date" }),
  post_applied_for: z.enum(["Employee", "Internship"], { message: "Post applied for must be either 'Employee' or 'Internship'" }),
  full_name: z.string().min(5, "Full Name must be at least 5 characters"),
  gender: z.enum(["Male", "Female"], { message: "Gender must be either 'Male' or 'Female'" }),
  cnic: z.string().length(13, "CNIC must be exactly 13 digits").regex(/^\d+$/, "CNIC must contain only digits"),
  dob: z.coerce.date().refine((date) => !isNaN(date.getTime()), { message: "Invalid Date of Birth" }),
  permanent_address: z.string().min(12, "Permanent Address must be at least 12 characters"),
  contact_number: z.string().length(11, "Contact Number must be exactly 11 digits").regex(/^\d+$/, "Contact Number must contain only digits"),
  email: z.string().email("Invalid email format"),
  image: z.instanceof(File, { message: "Image must be a file" }).optional(),
  degree: z.string().min(1, "Degree is required"),
  institute: z.string().min(1, "Institute is required"),
  grade: z.string().min(1, "Grade is required"),
  year: z.coerce.number().int().min(1900, "Year must be a valid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  teaching_subjects: z.string().optional(),
  teaching_institute: z.string().optional(),
  teaching_contact: z.string()
    .optional()
    .refine((val) => !val || (val.length === 11 && /^\d+$/.test(val)), {
      message: "Teaching contact must be exactly 11 digits if provided",
    }),
  position: z.string().optional(),
  organization: z.string().optional(),
  skills: z.string().optional(), // Kept as string for backend compatibility
  description: z.string().optional(),
  // Change 1: Updated in_time and out_time to strictly enforce HH:MM in 24-hour format
  in_time: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "In Time must be in HH:MM 24-hour format (e.g., 09:00 or 13:00)") // Removed transform, accepts HH:MM directly
    .refine((val) => val.length === 5, { message: "In Time must be exactly 5 characters (HH:MM)" }), // Ensures strict HH:MM
  out_time: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Out Time must be in HH:MM 24-hour format (e.g., 16:00 or 20:00)") // Removed transform, accepts HH:MM directly
    .refine((val) => val.length === 5, { message: "Out Time must be exactly 5 characters (HH:MM)" }), // Ensures strict HH:MM
  Salary_Cap: z.coerce.number()
    .int("Salary Cap must be a whole number (e.g., 50000)")
    .min(0, "Salary Cap must be a positive number")
    .max(2147483647, "Salary Cap must not exceed 2,147,483,647"),
});