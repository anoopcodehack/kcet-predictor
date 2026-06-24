import mongoose from 'mongoose';
import { COLLEGES, BRANCHES, generateCutoffs, College, Branch, Cutoff, CATEGORIES } from '../data/mockDatabase.js';

// Define Mongoose Schemas (if MongoDB is used)
const CollegeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Government', 'Aided', 'Private'], required: true },
  fee: { type: Number, required: true },
  ranking: { type: Number, required: true },
  website: { type: String, required: true },
  intake: { type: Number, required: true }
});

const BranchSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  intake: { type: Number, required: true }
});

const CutoffSchema = new mongoose.Schema({
  collegeCode: { type: String, required: true },
  branchCode: { type: String, required: true },
  year: { type: Number, required: true },
  round: { type: Number, required: true },
  category: { type: String, required: true },
  cutoffRank: { type: Number, required: true }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth users
  salt: { type: String },     // Used for password hashing
  name: { type: String, required: true },
  googleId: { type: String },
  picture: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const SessionSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

// Create Mongoose models
export const CollegeModel = mongoose.models.College || mongoose.model('College', CollegeSchema);
export const BranchModel = mongoose.models.Branch || mongoose.model('Branch', BranchSchema);
export const CutoffModel = mongoose.models.Cutoff || mongoose.model('Cutoff', CutoffSchema);
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const SessionModel = mongoose.models.Session || mongoose.model('Session', SessionSchema);

let isMongoConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.log('No MongoDB connection URI found in environment. Falling back to high-fidelity In-Memory Database Mode.');
    return false;
  }

  try {
    // 5-second timeout for rapid failover
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('Successfully connected to MongoDB!');
    
    // Seed MongoDB if empty
    await seedMongoDatabase();
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB. Falling back to In-Memory Mode:', error);
    console.error('Confirm your MongoDB URI and Atlas user/password are correct. Use MONGODB_URI or MONGO_URI.');
    isMongoConnected = false;
    return false;
  }
}

async function seedMongoDatabase() {
  try {
    const collegeCount = await CollegeModel.countDocuments();
    if (collegeCount < 300) {
      console.log('Seeding Colleges database to MongoDB (updating to 300 colleges)...');
      await CollegeModel.deleteMany({});
      await CollegeModel.insertMany(COLLEGES);
      
      // Wiping old cutoffs so they are re-seeded for the new 300 colleges roster
      console.log('Wiping old cutoff records for clean re-seed...');
      await CutoffModel.deleteMany({});
    }
    
    const branchCount = await BranchModel.countDocuments();
    if (branchCount === 0) {
      console.log('Seeding Branches database to MongoDB...');
      await BranchModel.insertMany(BRANCHES);
    }

    const cutoffCount = await CutoffModel.countDocuments();
    if (cutoffCount < 300) {
      console.log('Seeding Cutoffs database to MongoDB (this may take a moment for 300 colleges)...');
      const cutoffs = generateCutoffs();
      // Chunk insertions for reliability
      const chunkSize = 1500;
      for (let i = 0; i < cutoffs.length; i += chunkSize) {
        const chunk = cutoffs.slice(i, i + chunkSize);
        await CutoffModel.insertMany(chunk);
      }
      console.log('Successfully seeded MongoDB database cutoffs!');
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
  }
}

// Memory database copy
let memoryColleges: College[] = [...COLLEGES];
let memoryBranches: Branch[] = [...BRANCHES];
let memoryCutoffs: Cutoff[] = [];
let memoryUsers: any[] = [];
let memorySessions: any[] = [];

// Service layer accessor methods supporting dual mode
export const dbService = {
  isMongo: () => isMongoConnected,

  getColleges: async (): Promise<College[]> => {
    if (isMongoConnected) {
      return await CollegeModel.find({} as any).sort({ ranking: 1 });
    }
    return memoryColleges.sort((a, b) => a.ranking - b.ranking);
  },

  getBranches: async (): Promise<Branch[]> => {
    if (isMongoConnected) {
      return await BranchModel.find({} as any);
    }
    return memoryBranches;
  },

  getCategories: () => {
    return CATEGORIES;
  },

  getCutoffs: async (query: any = {}): Promise<Cutoff[]> => {
    if (isMongoConnected) {
      return await CutoffModel.find(query);
    }
    
    if (memoryCutoffs.length === 0) {
      memoryCutoffs = generateCutoffs();
    }

    let results = memoryCutoffs;
    if (query.collegeCode) results = results.filter(c => c.collegeCode === query.collegeCode);
    if (query.branchCode) results = results.filter(c => c.branchCode === query.branchCode);
    if (query.year) results = results.filter(c => c.year === parseInt(query.year));
    if (query.round) results = results.filter(c => c.round === parseInt(query.round));
    if (query.category) results = results.filter(c => c.category === query.category);
    
    return results;
  },

  addCollege: async (college: College): Promise<College> => {
    if (isMongoConnected) {
      const newCol = new CollegeModel(college);
      await newCol.save();
      return newCol.toObject();
    }
    memoryColleges.push(college);
    return college;
  },

  addCutoff: async (cutoff: Cutoff): Promise<Cutoff> => {
    if (isMongoConnected) {
      const newCut = new CutoffModel(cutoff);
      await newCut.save();
      return newCut.toObject();
    }
    if (memoryCutoffs.length === 0) {
      memoryCutoffs = generateCutoffs();
    }
    memoryCutoffs.push(cutoff);
    return cutoff;
  },

  importCSVs: async (cutoffs: Cutoff[]): Promise<{ count: 0 | number }> => {
    if (isLiveDBConnected()) {
      // Direct database insert
      // For simplicity/safeguard, we handle chunked insert if MongoDB is active
      await CutoffModel.insertMany(cutoffs);
    } else {
      if (memoryCutoffs.length === 0) {
        memoryCutoffs = generateCutoffs();
      }
      memoryCutoffs.push(...cutoffs);
    }
    return { count: cutoffs.length };
  },

  getUserByEmail: async (email: string): Promise<any> => {
    if (isLiveDBConnected()) {
      return await (UserModel as any).findOne({ email: email.toLowerCase() });
    }
    return memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  createUser: async (user: any): Promise<any> => {
    const userData = { ...user, email: user.email.toLowerCase() };
    if (isLiveDBConnected()) {
      const newUser = new UserModel(userData);
      await newUser.save();
      return newUser.toObject();
    }
    memoryUsers.push(userData);
    return userData;
  },

  createSession: async (token: string, userEmail: string): Promise<any> => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    if (isLiveDBConnected()) {
      const newSession = new SessionModel({ token, userEmail: userEmail.toLowerCase(), expiresAt });
      await newSession.save();
      return newSession.toObject();
    }
    const sessionObj = { token, userEmail: userEmail.toLowerCase(), expiresAt };
    memorySessions.push(sessionObj);
    return sessionObj;
  },

  getSession: async (token: string): Promise<any> => {
    if (isLiveDBConnected()) {
      const s = await (SessionModel as any).findOne({ token });
      if (s && s.expiresAt > new Date()) return s;
      return null;
    }
    const s = memorySessions.find(x => x.token === token);
    if (s && s.expiresAt > new Date()) return s;
    return null;
  },

  deleteSession: async (token: string): Promise<any> => {
    if (isLiveDBConnected()) {
      await (SessionModel as any).deleteOne({ token });
    } else {
      memorySessions = memorySessions.filter(x => x.token !== token);
    }
    return true;
  }
};

function isLiveDBConnected() {
  return isMongoConnected && mongoose.connection.readyState === 1;
}
