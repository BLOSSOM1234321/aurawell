// Test Therapist Account Creator
// Run this in your browser console (F12) while on localhost:5173

const testTherapist = {
  id: "test-therapist-001",
  name: "Dr. Sarah Thompson",
  email: "therapist@test.com",
  password: "password123",
  user_type: "therapist",
  verification_status: "verified",
  onboardingComplete: true,

  // Therapist onboarding data
  licenseType: "Licensed Clinical Psychologist (PhD)",
  licenseNumber: "PSY12345",
  yearsExperience: "10",
  specializations: ["Anxiety", "Depression", "Trauma", "Relationships"],
  therapeuticApproaches: ["Cognitive Behavioral Therapy (CBT)", "Mindfulness-Based Therapy", "Trauma-Focused Therapy"],
  education: "PhD in Clinical Psychology from Stanford University",
  clientDemographics: ["Adults (18-64)", "Young Adults (18-25)", "LGBTQ+"],
  languages: ["English", "Spanish"],
  insuranceAccepted: "yes",
  sessionRate: "$150",
  practiceType: "Private Practice",

  // Mock document data (in real app these would be file URLs)
  licenseDocument: { name: "license.pdf", uploaded: true },
  idDocument: { name: "id.pdf", uploaded: true },
  selfiePhoto: { name: "selfie.jpg", uploaded: true },

  documentsSubmitted: true,
  submittedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),

  // Additional therapist fields
  bio: "Experienced therapist specializing in anxiety, depression, and trauma recovery.",
  availability: ["Monday", "Tuesday", "Wednesday", "Thursday"],
};

// Get existing users
const existingUsers = JSON.parse(localStorage.getItem('aurawell_users') || '[]');

// Check if test therapist already exists
const existingTherapist = existingUsers.find(u => u.email === 'therapist@test.com');

if (existingTherapist) {
  console.log('✅ Test therapist already exists!');
  console.log('Email: therapist@test.com');
  console.log('Password: password123');
} else {
  // Add test therapist to users
  existingUsers.push(testTherapist);
  localStorage.setItem('aurawell_users', JSON.stringify(existingUsers));

  console.log('✅ Test therapist account created successfully!');
  console.log('');
  console.log('📧 Email: therapist@test.com');
  console.log('🔑 Password: password123');
  console.log('');
  console.log('You can now log in with these credentials!');
}