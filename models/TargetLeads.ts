import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Interface
export interface ITargetLead extends Document {
  fullName: string;
  phone: string;
  email?: string; // META uchun qo'shildi
  price?: number; // Xarid summasi uchun qo'shildi
  location?: string;
  age?: number;
  businessType?: string;
  budget?: string;
  source: string;
  status: string;
  lastComment: string; 
  note?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  reminderDate?: string; 
  comments: Array<{
    text: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Schema
const TargetLeadSchema = new Schema<ITargetLead>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" }, // Qo'shildi
    price: { type: Number, default: 0 }, // Qo'shildi
    location: { type: String, trim: true, default: "" },
    age: { type: Number, min: 5, max: 120 },
    businessType: { type: String, default: "" },
    budget: { type: String, default: "" },
    source: { type: String, default: "website" },
    status: { type: String, default: "LID" },
    lastComment: { type: String, default: "", trim: true },
    note: { type: String, default: "" },
    utm_source: { type: String, default: "" },
    utm_medium: { type: String, default: "" },
    utm_campaign: { type: String, default: "" },
    utm_content: { type: String, default: "" },
    utm_term: { type: String, default: "" },
    reminderDate: { type: String, default: "" },
    comments: [
      {
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const TargetLeadModel: Model<ITargetLead> =
  mongoose.models.TargetLead || mongoose.model<ITargetLead>("TargetLead", TargetLeadSchema);

export default TargetLeadModel;