const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Admin = mongoose.model('Admin', AdminSchema);

const createFirstAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@handyconnect.com' });
    if (existingAdmin) {
      console.log('❌ Admin already exists');
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create({
      name: 'System Admin',
      email: 'admin@handyconnect.com',
      password: 'admin123', // Change this password!
    });

    console.log('✅ Admin created successfully:');
    console.log('Email: admin@handyconnect.com');
    console.log('Password: admin123');
    console.log('🔺 PLEASE CHANGE THE PASSWORD AFTER FIRST LOGIN!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createFirstAdmin();
