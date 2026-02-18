import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (for authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  specialty: text("specialty"),
  licenseNumber: text("license_number"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Doctors table
export const doctors = pgTable("doctors", {
  id: serial("doctor_id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  specialty: text("specialty"),
  licenseNumber: text("license_number").unique(),
  hireDate: date("hire_date"),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({ id: true });
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;

// Patients table
export const patients = pgTable("patients", {
  id: serial("patient_id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dob: date("dob").notNull(),
  gender: text("gender"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  emergencyName: text("emergency_name"),
  emergencyPhone: text("emergency_phone"),
});

export const insertPatientSchema = createInsertSchema(patients).omit({ id: true });
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

// Medical Records table
export const medicalRecords = pgTable("medical_records", {
  id: serial("record_id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  creationDate: timestamp("creation_date").defaultNow(),
  visitType: text("visit_type"),
  diagnosis: text("diagnosis"),
  treatmentPlan: text("treatment_plan"),
  allergies: text("allergies"),
  vitals: text("vitals"),
  labResults: text("lab_results"),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({ id: true, creationDate: true, updatedAt: true });
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type MedicalRecord = typeof medicalRecords.$inferSelect;

// Referrals table
export const referrals = pgTable("referrals", {
  id: serial("referral_id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  referringDoctorId: integer("referring_doctor_id").notNull(),
  referredDoctorId: integer("referred_doctor_id").notNull(),
  dateTime: timestamp("date_time").notNull(),
  status: text("status").default("pending"),
  notes: text("notes"),
});

export const insertReferralSchema = createInsertSchema(referrals).omit({ id: true });
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;
