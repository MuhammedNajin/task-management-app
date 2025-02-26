import mongoose, { Schema, Document } from 'mongoose';

export interface User {
  _id?: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface UserDocument extends Document, Omit<User, '_id'> {

  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema: Schema<UserDocument> = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret._id = ret._id.toString();
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
      virtuals: true,
    },
  }
);

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);