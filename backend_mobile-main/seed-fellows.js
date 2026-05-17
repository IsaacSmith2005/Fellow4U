const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FellowProfile = require('./src/models/FellowProfile.model');
const User = require('./src/models/User.model');
const Trip = require('./src/models/Trip.model');
const guides = require('./guides.json');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const seedTrips = async () => {
  try {
    // Clear existing trips
    await Trip.deleteMany({});
    
    console.log('Cleared existing trips');

    // Tìm user traveler đầu tiên (hoặc tạo mới nếu chưa có)
    let traveler = await User.findOne({ role: 'traveler' });
    if (!traveler) {
      traveler = await User.create({
        firstName: 'Yoo',
        lastName: 'Jin',
        email: 'yoojin@gmail.com',
        password: 'password123',
        role: 'traveler',
        avatar: 'https://res.cloudinary.com/dqe5syxc0/image/upload/v1772716233/avatar_cpp4hl.png'
      });
      console.log('Created traveler user:', traveler.email);
    }

    // Tìm guide đầu tiên để làm host
    let guide = await User.findOne({ role: 'guide' });
    if (!guide) {
      // Tạo guide mới nếu chưa có
      guide = await User.create({
        firstName: 'Tuan',
        lastName: 'Tran',
        email: 'tuan@example.com',
        password: 'password123',
        role: 'guide',
        avatar: 'https://res.cloudinary.com/dqe5syxc0/image/upload/v1772716233/avatar_cpp4hl.png'
      });
      console.log('Created guide user:', guide.email);
    }

    // Sample trips data - phù hợp với frontend UI cho năm 2026
    const sampleTrips = [
      // Past trips - completed (2025)
      {
        user: traveler._id,
        title: 'Dragon Bridge Trip',
        destination: 'Da Nang, Vietnam',
        startDate: new Date('2025-01-30'),
        endDate: new Date('2025-01-30'),
        startTime: '13:00',
        endTime: '15:00',
        travelerCount: 2,
        maxBudget: 50,
        requiredLanguages: ['English', 'Vietnamese'],
        imageUrl: 'https://res.cloudinary.com/dqe5syxc0/image/upload/v1772716308/mytrip_drogan_qtwsyr.png',
        host: guide._id,
        status: 'completed'
      },
      {
        user: traveler._id,
        title: 'Ho Guom Trip',
        destination: 'Hanoi, Vietnam',
        startDate: new Date('2025-02-02'),
        endDate: new Date('2025-02-02'),
        startTime: '09:00',
        endTime: '12:00',
        travelerCount: 1,
        maxBudget: 30,
        requiredLanguages: ['English'],
        imageUrl: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=500',
        host: guide._id,
        status: 'completed'
      },
      {
        user: traveler._id,
        title: 'Ho Chi Minh Mausoleum',
        destination: 'Hanoi, Vietnam',
        startDate: new Date('2025-02-02'),
        endDate: new Date('2025-02-02'),
        startTime: '08:00',
        endTime: '10:00',
        travelerCount: 2,
        maxBudget: 40,
        requiredLanguages: ['English', 'Korean'],
        imageUrl: 'https://res.cloudinary.com/dqe5syxc0/image/upload/v1772716971/Mask_Group_jyste0.png',
        host: guide._id,
        status: 'completed'
      },
      {
        user: traveler._id,
        title: 'Duc Ba Church',
        destination: 'Ho Chi Minh, Vietnam',
        startDate: new Date('2025-02-10'),
        endDate: new Date('2025-02-10'),
        startTime: '08:00',
        endTime: '10:00',
        travelerCount: 3,
        maxBudget: 45,
        requiredLanguages: ['Vietnamese'],
        imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=500',
        host: guide._id,
        status: 'completed'
      },
      {
        user: traveler._id,
        title: 'Quoc Tu Giam Temple',
        destination: 'Hanoi, Vietnam',
        startDate: new Date('2025-03-15'),
        endDate: new Date('2025-03-15'),
        startTime: '10:00',
        endTime: '12:00',
        travelerCount: 1,
        maxBudget: 25,
        requiredLanguages: ['English'],
        imageUrl: 'https://res.cloudinary.com/dqe5syxc0/image/upload/v1772717026/Mask_Group_1_slf7cu.png',
        host: guide._id,
        status: 'completed'
      },
      {
        user: traveler._id,
        title: 'Dinh Doc Lap',
        destination: 'Ho Chi Minh, Vietnam',
        startDate: new Date('2025-03-20'),
        endDate: new Date('2025-03-20'),
        startTime: '08:00',
        endTime: '10:00',
        travelerCount: 2,
        maxBudget: 35,
        requiredLanguages: ['English'],
        imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=500',
        guide: guide._id,
        status: 'cancelled'
      },
      // Current trip - confirmed (đang diễn ra)
      {
        user: traveler._id,
        title: 'Marble Mountains Tour',
        destination: 'Da Nang, Vietnam',
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-05-01'),
        startTime: '14:00',
        endTime: '17:00',
        travelerCount: 2,
        maxBudget: 60,
        requiredLanguages: ['English'],
        imageUrl: 'https://res.cloudinary.com/dqe5syxc0/image/upload/v1772716308/mytrip_drogan_qtwsyr.png',
        host: guide._id,
        status: 'confirmed'
      },
      // Next trips - waiting (đã book nhưng chưa xác nhận)
      {
        user: traveler._id,
        title: 'Golden Bridge Trip',
        destination: 'Da Nang, Vietnam',
        startDate: new Date('2026-06-15'),
        endDate: new Date('2026-06-15'),
        startTime: '09:00',
        endTime: '12:00',
        travelerCount: 3,
        maxBudget: 80,
        requiredLanguages: ['Korean', 'English'],
        imageUrl: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=500',
        host: null,
        status: 'waiting'
      },
      {
        user: traveler._id,
        title: 'My Khe Beach',
        destination: 'Da Nang, Vietnam',
        startDate: new Date('2026-06-20'),
        endDate: new Date('2026-06-20'),
        startTime: '06:00',
        endTime: '09:00',
        travelerCount: 2,
        maxBudget: 40,
        requiredLanguages: ['Vietnamese', 'English'],
        imageUrl: 'https://res.cloudinary.com/dqe5syxc0/image/upload/v1772716308/mytrip_drogan_qtwsyr.png',
        host: null,
        status: 'waiting'
      },
      {
        user: traveler._id,
        title: 'Hue Imperial City',
        destination: 'Hue, Vietnam',
        startDate: new Date('2026-07-05'),
        endDate: new Date('2026-07-06'),
        startTime: '08:00',
        endTime: '17:00',
        travelerCount: 4,
        maxBudget: 150,
        requiredLanguages: ['English'],
        imageUrl: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=500',
        host: null,
        status: 'waiting'
      }
    ];

    // Insert trips
    await Trip.insertMany(sampleTrips);
    console.log('Successfully seeded trips data');

    process.exit();
  } catch (error) {
    console.error('Error seeding trips:', error);
    process.exit(1);
  }
};

seedTrips();