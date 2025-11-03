require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const connectDB = require('./configs/db');

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log('Seeding DB...');

    await User.deleteMany({});
    const users = [
      {
        name: 'Alice Farmer',
        email: 'alice@farm.local',
        password: 'password123',
        role: 'farmer',
        profile: { bio: 'Smallholder farmer', location: 'Nairobi' }
      },
      {
        name: 'Bob Agronomist',
        email: 'bob@agro.local',
        password: 'password123',
        role: 'agronomist',
        profile: { bio: 'Crop specialist', location: 'Nairobi', skills: ['soil', 'pests'] },
        wallet: { balance: 0 }
      }
    ];
    for (const u of users) {
      await User.create(u);
    }
    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
