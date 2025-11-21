// src/models/user.js

import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

// userSchema.pre - означає виконай цю функцію перед тим, як документ
// буде збережено у базу (save).
// function (next) - Це звичайна функція, а не стрілочна, бо потрібно
// мати доступ до this.

userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});

// Перевизначаємо метод toJSON (буде використовуввтися при наданні res
// - без паролю)
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
