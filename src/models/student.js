// src/models/student.js

import { Schema, model } from 'mongoose';

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    avgMark: {
      type: Number,
      required: true,
    },
    onDuty: {
      type: Boolean,
      default: false,
    },
    // Нова властивість
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Додаємо текстовий індекс: кажемо MongoDB, що по полю name можна робити $text
studentSchema.index(
  { name: 'text' },
  {
    name: 'StudentTextIndex',
    weights: { name: 10 },
    default_language: 'english',
  },
);

export const Student = model('Student', studentSchema);
