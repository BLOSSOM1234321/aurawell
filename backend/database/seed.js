import { pool, testConnection } from '../config/database.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot proceed without database connection');
    process.exit(1);
  }

  try {
    // ============================================
    // SEED SUPPORT GROUPS
    // ============================================
    console.log('📝 Seeding support groups...');

    const supportGroups = [
      {
        name: 'Anxiety Support',
        description: 'A safe space for those dealing with anxiety and panic',
        category: 'anxiety',
        icon: 'brain',
        color: 'blue'
      },
      {
        name: 'Depression Warriors',
        description: 'Support for those battling depression',
        category: 'depression',
        icon: 'heart',
        color: 'purple'
      },
      {
        name: 'Trauma Healing',
        description: 'For survivors of trauma seeking healing and connection',
        category: 'trauma',
        icon: 'shield',
        color: 'green'
      },
      {
        name: 'PTSD Recovery',
        description: 'Community for PTSD recovery and support',
        category: 'ptsd',
        icon: 'umbrella',
        color: 'teal'
      },
      {
        name: 'Grief & Loss',
        description: 'Support through grief and loss',
        category: 'grief',
        icon: 'candle',
        color: 'gray'
      },
      {
        name: 'Self-Care Circle',
        description: 'Focusing on self-care and wellness',
        category: 'wellness',
        icon: 'flower',
        color: 'pink'
      }
    ];

    for (const group of supportGroups) {
      await pool.query(
        `INSERT INTO support_groups (name, description, category, icon, color)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [group.name, group.description, group.category, group.icon, group.color]
      );
    }
    console.log('✅ Support groups seeded\n');

    // ============================================
    // SEED TEST USERS
    // ============================================
    console.log('📝 Seeding test users...');

    const testPassword = await bcrypt.hash('password123', 10);

    const testUsers = [
      {
        email: 'user@test.com',
        username: 'testuser',
        full_name: 'Test User',
        user_type: 'regular'
      },
      {
        email: 'therapist@test.com',
        username: 'testtherapist',
        full_name: 'Dr. Test Therapist',
        user_type: 'therapist'
      },
      {
        email: 'admin@test.com',
        username: 'admin',
        full_name: 'Admin User',
        user_type: 'admin'
      }
    ];

    for (const user of testUsers) {
      await pool.query(
        `INSERT INTO users (email, password_hash, username, full_name, user_type)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO NOTHING`,
        [user.email, testPassword, user.username, user.full_name, user.user_type]
      );
    }
    console.log('✅ Test users seeded');
    console.log('   📧 Email: user@test.com | Password: password123');
    console.log('   📧 Email: therapist@test.com | Password: password123');
    console.log('   📧 Email: admin@test.com | Password: password123\n');

    // ============================================
    // SEED MEDITATIONS
    // ============================================
    console.log('📝 Seeding meditations...');

    const meditations = [
      {
        title: 'Deep Sleep Meditation',
        description: 'Relax and drift into peaceful sleep',
        audio_url: '/meditations/deep-sleep.mp3',
        duration: 1200,
        category: 'sleep',
        instructor: 'Sarah Chen'
      },
      {
        title: 'Anxiety Relief',
        description: 'Calm your anxious mind',
        audio_url: '/meditations/anxiety-relief.mp3',
        duration: 600,
        category: 'anxiety',
        instructor: 'Michael Brown'
      },
      {
        title: 'Morning Focus',
        description: 'Start your day with clarity',
        audio_url: '/meditations/morning-focus.mp3',
        duration: 480,
        category: 'focus',
        instructor: 'Emma Wilson'
      }
    ];

    for (const med of meditations) {
      await pool.query(
        `INSERT INTO meditations (title, description, audio_url, duration, category, instructor)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [med.title, med.description, med.audio_url, med.duration, med.category, med.instructor]
      );
    }
    console.log('✅ Meditations seeded\n');

    // ============================================
    // SEED ACHIEVEMENTS
    // ============================================
    console.log('📝 Seeding achievements...');

    const achievements = [
      {
        name: 'First Step',
        description: 'Completed your first mood entry',
        icon: 'star',
        points: 10,
        requirement_type: 'mood_entries',
        requirement_value: 1
      },
      {
        name: 'Week Warrior',
        description: 'Maintained a 7-day streak',
        icon: 'fire',
        points: 50,
        requirement_type: 'streak',
        requirement_value: 7
      },
      {
        name: 'Journal Master',
        description: 'Created 10 journal entries',
        icon: 'book',
        points: 100,
        requirement_type: 'journal_entries',
        requirement_value: 10
      }
    ];

    for (const achievement of achievements) {
      await pool.query(
        `INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [achievement.name, achievement.description, achievement.icon, achievement.points,
         achievement.requirement_type, achievement.requirement_value]
      );
    }
    console.log('✅ Achievements seeded\n');

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seeding
seedDatabase();
