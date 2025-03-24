import { z } from "zod";

export const payrollSchema = z.object({
  employee_id: z.string().min(1, "Employee ID is required"),
  full_name: z.string().min(1, "Full name is required"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
  total_working_hours: z.number().min(0, "Total working hours must be non-negative"),
  not_allowed_hours: z.number().min(0, "Not allowed hours must be non-negative"),
  official_working_days: z.number().int().min(0, "Official working days must be non-negative"),
  adjusted_working_days: z.number().int().min(0, "Adjusted working days must be non-negative"),
  effective_allowance_days: z.number().int().min(0, "Effective allowance days must be non-negative"),
  hourly_wage: z.number().min(0, "Hourly wage must be non-negative"),
  daily_allowance_rate: z.number().min(0, "Daily allowance rate must be non-negative"),
  daily_allowance_total: z.number().min(0, "Daily allowance total must be non-negative"),
  official_leaves: z.number().int().min(0, "Official leaves must be non-negative"),
  allowed_hours_per_day: z.number().min(0, "Allowed hours per day must be non-negative"),
  hourly_salary: z.number().min(0, "Hourly salary must be non-negative"),
  gross_salary: z.number().min(0, "Gross salary must be non-negative"),
  late_count: z.number().int().min(0, "Late count must be a non-negative integer"),
  early_count: z.number().int().min(0, "Early count must be a non-negative integer"),
  absent_count: z.number().int().min(0, "Absent count must be a non-negative integer"),
  effective_absent_count: z.number().int().min(0, "Effective absent count must be non-negative"),
  late_dates: z.array(z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Invalid date format")),
  early_dates: z.array(z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Invalid date format")),
  absent_dates: z.array(z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Invalid date format")),
  table_section_data: z.array(z.array(z.string())), // Array of rows, each row is an array of strings
  Salary_Cap: z.number().min(0, "Salary cap must be a positive number"),
});

export const payrollUpdateSchema = payrollSchema.partial(); // For partial updates