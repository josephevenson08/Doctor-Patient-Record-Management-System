import { mysqlTable, text, varchar, int, date, timestamp, datetime } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (for authentication)
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  password: text("password").notNull(),
  firstName: varchar("first_name", { length: 64 }).notNull(),
  lastName: varchar("last_name", { length: 64 }).notNull(),
  email: varchar("email", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 15 }),
  specialty: varchar("specialty", { length: 50 }),
  licenseNumber: varchar("license_number", { length: 30 }),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Doctors table
export const doctors = mysqlTable("doctors", {
  id: int("doctor_ID").primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 64 }).notNull(),
  lastName: varchar("last_name", { length: 64 }).notNull(),
  email: varchar("email", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 15 }),
  specialty: varchar("specialty", { length: 50 }),
  licenseNumber: varchar("license_number", { length: 30 }).unique(),
  hireDate: date("hire_date"),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({ id: true });
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;

// Patients table
export const patients = mysqlTable("patients", {
  id: int("patient_ID").primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 64 }).notNull(),
  lastName: varchar("last_name", { length: 64 }).notNull(),
  dob: date("dob").notNull(),
  gender: varchar("gender", { length: 10 }),
  email: varchar("email", { length: 120 }),
  phone: varchar("phone", { length: 15 }),
  address: text("address"),
  emergencyName: varchar("emergency_name", { length: 64 }),
  emergencyPhone: varchar("emergency_phone", { length: 15 }),
});

export const insertPatientSchema = createInsertSchema(patients).omit({ id: true });
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

// Medical Records table
export const medicalRecords = mysqlTable("medical_records", {
  id: int("record_ID").primaryKey().autoincrement(),
  patientId: int("patient_ID").notNull(),
  doctorId: int("doctor_ID").notNull(),
  creationDate: datetime("creation_date").default(new Date()),
  visitType: text("visit_type"),
  diagnosis: text("diagnosis"),
  treatmentPlan: text("treatment_plan"),
  allergies: text("allergies"),
  vitals: text("vitals"),
  labResults: text("lab_results"),
  notes: text("notes"),
  updatedAt: datetime("updated_at").default(new Date()),
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({ id: true, creationDate: true, updatedAt: true });
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type MedicalRecord = typeof medicalRecords.$inferSelect;

// Referrals table
export const referrals = mysqlTable("referrals", {
  id: int("referral_ID").primaryKey().autoincrement(),
  patientId: int("patient_ID").notNull(),
  referringDoctorId: int("referring_doctor_ID").notNull(),
  referredDoctorId: int("referred_doctor_ID").notNull(),
  dateTime: datetime("date_time").notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  notes: text("notes"),
});

export const insertReferralSchema = createInsertSchema(referrals).omit({ id: true });
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;