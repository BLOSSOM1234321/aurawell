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
        name: 'Schizophrenia Support',
        description: 'Understanding and support for those living with schizophrenia and related conditions',
        category: 'schizophrenia',
        group_type: 'support',
        icon: '🧠',
        color: '#6B7280'
      },
      {
        name: 'Bipolar & Mood Disorder Support',
        description: 'A safe space for navigating bipolar disorder and other mood disorders together',
        category: 'bipolar',
        group_type: 'support',
        icon: '⚖️',
        color: '#8B5CF6'
      },
      {
        name: 'Borderline Personality Disorder (BPD) Support',
        description: 'A supportive community for those with BPD, focusing on DBT skills and emotional regulation',
        category: 'bpd',
        group_type: 'support',
        icon: '💗',
        color: '#EC4899'
      },
      {
        name: "Men's Mental Wellness",
        description: 'A safe space for men to discuss mental health, break down stigma, and support each other',
        category: 'mens_health',
        group_type: 'support',
        icon: '👤',
        color: '#6B7280'
      },
      {
        name: "Women's Mental Wellness",
        description: 'Empowering women through shared experiences, support, and mental health advocacy',
        category: 'womens_health',
        group_type: 'support',
        icon: '💗',
        color: '#EC4899'
      },
      {
        name: 'Anxiety Support',
        description: 'Connect with others, share coping strategies for anxiety in a supportive environment',
        category: 'anxiety',
        group_type: 'support',
        icon: '😰',
        color: '#3B82F6'
      },
      {
        name: 'Chronic Illness & Mental Health',
        description: 'Support for those managing chronic illness alongside mental health challenges',
        category: 'chronic_illness',
        group_type: 'support',
        icon: '💚',
        color: '#10B981'
      },
      {
        name: 'ADHD & Neurodivergence Support',
        description: 'Support and strategies for ADHD and neurodivergent individuals navigating daily life',
        category: 'adhd',
        group_type: 'support',
        icon: '⚡',
        color: '#F59E0B'
      },
      {
        name: 'Depression Support',
        description: 'A compassionate community for those navigating depression and seeking hope',
        category: 'depression',
        group_type: 'support',
        icon: '🌧️',
        color: '#6366F1'
      },
      {
        name: 'Trauma Recovery & PTSD',
        description: 'Healing together through shared experiences and trauma-informed support',
        category: 'trauma',
        group_type: 'support',
        icon: '❤️‍🩹',
        color: '#EF4444'
      },
      {
        name: 'Mindfulness Meditation Circle',
        description: 'Daily meditation practice and mindfulness discussions',
        category: 'mindfulness',
        group_type: 'community',
        icon: '🙏',
        color: '#A78BFA'
      },
      {
        name: 'New Parents Support',
        description: 'Navigating parenthood through the journey of parenthood',
        category: 'parenting',
        group_type: 'community',
        icon: '👶',
        color: '#FBBF24'
      },
      {
        name: 'Creative Expression Group',
        description: 'Art, writing, and creativity as healing',
        category: 'creativity',
        group_type: 'community',
        icon: '🎨',
        color: '#F97316'
      }
    ];

    for (const group of supportGroups) {
      await pool.query(
        `INSERT INTO support_groups (name, description, category, group_type, icon, color)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [group.name, group.description, group.category, group.group_type, group.icon, group.color]
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
