import {
  type User, type InsertUser, users,
  type Doctor, type InsertDoctor, doctors,
  type Patient, type InsertPatient, patients,
  type MedicalRecord, type InsertMedicalRecord, medicalRecords,
  type Referral, type InsertReferral, referrals,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Doctors
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor | undefined>;
  deleteDoctor(id: number): Promise<boolean>;

  // Patients
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined>;
  deletePatient(id: number): Promise<boolean>;

  // Medical Records
  getMedicalRecords(): Promise<MedicalRecord[]>;
  getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]>;
  getMedicalRecord(id: number): Promise<MedicalRecord | undefined>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord | undefined>;
  deleteMedicalRecord(id: number): Promise<boolean>;

  // Referrals
  getReferrals(): Promise<Referral[]>;
  getReferral(id: number): Promise<Referral | undefined>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  updateReferral(id: number, referral: Partial<InsertReferral>): Promise<Referral | undefined>;
  deleteReferral(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    return db.select().from(doctors);
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const [created] = await db.insert(doctors).values(doctor).returning();
    return created;
  }

  async updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor | undefined> {
    const [updated] = await db.update(doctors).set(doctor).where(eq(doctors.id, id)).returning();
    return updated;
  }

  async deleteDoctor(id: number): Promise<boolean> {
    const result = await db.delete(doctors).where(eq(doctors.id, id)).returning();
    return result.length > 0;
  }

  // Patients
  async getPatients(): Promise<Patient[]> {
    return db.select().from(patients);
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [created] = await db.insert(patients).values(patient).returning();
    return created;
  }

  async updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient | undefined> {
    const [updated] = await db.update(patients).set(patient).where(eq(patients.id, id)).returning();
    return updated;
  }

  async deletePatient(id: number): Promise<boolean> {
    const result = await db.delete(patients).where(eq(patients.id, id)).returning();
    return result.length > 0;
  }

  // Medical Records
  async getMedicalRecords(): Promise<MedicalRecord[]> {
    return db.select().from(medicalRecords);
  }

  async getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]> {
    return db.select().from(medicalRecords).where(eq(medicalRecords.patientId, patientId));
  }

  async getMedicalRecord(id: number): Promise<MedicalRecord | undefined> {
    const [record] = await db.select().from(medicalRecords).where(eq(medicalRecords.id, id));
    return record;
  }

  async createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const [created] = await db.insert(medicalRecords).values(record).returning();
    return created;
  }

  async updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord | undefined> {
    const [updated] = await db.update(medicalRecords).set(record).where(eq(medicalRecords.id, id)).returning();
    return updated;
  }

  async deleteMedicalRecord(id: number): Promise<boolean> {
    const result = await db.delete(medicalRecords).where(eq(medicalRecords.id, id)).returning();
    return result.length > 0;
  }

  // Referrals
  async getReferrals(): Promise<Referral[]> {
    return db.select().from(referrals);
  }

  async getReferral(id: number): Promise<Referral | undefined> {
    const [referral] = await db.select().from(referrals).where(eq(referrals.id, id));
    return referral;
  }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    const [created] = await db.insert(referrals).values(referral).returning();
    return created;
  }

  async updateReferral(id: number, referral: Partial<InsertReferral>): Promise<Referral | undefined> {
    const [updated] = await db.update(referrals).set(referral).where(eq(referrals.id, id)).returning();
    return updated;
  }

  async deleteReferral(id: number): Promise<boolean> {
    const result = await db.delete(referrals).where(eq(referrals.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
