// Mock therapist data for local development

export const mockTherapists = [
  {
    id: "therapist-1",
    name: "Dr. Sarah Martinez",
    email: "sarah.martinez@aurawell.com",
    user_type: "therapist",
    verification_status: "verified",
    specialization: "Anxiety & Depression",
    bio: "With over 10 years of experience, I specialize in helping individuals overcome anxiety and depression through evidence-based approaches.",
    therapeutic_approaches: ["Cognitive Behavioral Therapy (CBT)", "Mindfulness-Based Therapy"],
    areas_of_expertise: ["Anxiety Disorders", "Depression", "Stress Management", "Mindfulness"],
    license_number: "PSY-12345",
    years_of_experience: 10,
    accepting_new_clients: true,
    session_rate: 150,
    languages: ["English", "Spanish"],
    profile_image_url: null,
    createdAt: "2020-01-15T00:00:00.000Z"
  },
  {
    id: "therapist-2",
    name: "Dr. Michael Chen",
    email: "michael.chen@aurawell.com",
    user_type: "therapist",
    verification_status: "verified",
    specialization: "Trauma & PTSD",
    bio: "I work with individuals who have experienced trauma, helping them heal and reclaim their lives using trauma-informed care.",
    therapeutic_approaches: ["EMDR", "Trauma-Focused CBT", "Somatic Therapy"],
    areas_of_expertise: ["PTSD", "Trauma Recovery", "Complex PTSD", "Emotional Regulation"],
    license_number: "LCSW-67890",
    years_of_experience: 8,
    accepting_new_clients: true,
    session_rate: 175,
    languages: ["English", "Mandarin"],
    profile_image_url: null,
    createdAt: "2021-03-20T00:00:00.000Z"
  },
  {
    id: "therapist-3",
    name: "Dr. Emily Johnson",
    email: "emily.johnson@aurawell.com",
    user_type: "therapist",
    verification_status: "verified",
    specialization: "Relationship & Family Therapy",
    bio: "I help couples and families navigate challenges, improve communication, and build stronger relationships.",
    therapeutic_approaches: ["Emotionally Focused Therapy (EFT)", "Gottman Method", "Family Systems Therapy"],
    areas_of_expertise: ["Couples Therapy", "Family Therapy", "Communication Issues", "Conflict Resolution"],
    license_number: "LMFT-24680",
    years_of_experience: 12,
    accepting_new_clients: false,
    session_rate: 200,
    languages: ["English"],
    profile_image_url: null,
    createdAt: "2019-06-10T00:00:00.000Z"
  },
  {
    id: "therapist-4",
    name: "Dr. James Williams",
    email: "james.williams@aurawell.com",
    user_type: "therapist",
    verification_status: "verified",
    specialization: "Addiction & Substance Abuse",
    bio: "Specializing in addiction recovery, I provide compassionate support to help individuals break free from substance dependence.",
    therapeutic_approaches: ["Motivational Interviewing", "12-Step Facilitation", "Relapse Prevention"],
    areas_of_expertise: ["Substance Abuse", "Addiction Recovery", "Relapse Prevention", "Co-Occurring Disorders"],
    license_number: "LCADC-13579",
    years_of_experience: 15,
    accepting_new_clients: true,
    session_rate: 160,
    languages: ["English"],
    profile_image_url: null,
    createdAt: "2018-09-01T00:00:00.000Z"
  },
  {
    id: "therapist-5",
    name: "Dr. Aisha Patel",
    email: "aisha.patel@aurawell.com",
    user_type: "therapist",
    verification_status: "verified",
    specialization: "Child & Adolescent Therapy",
    bio: "I work with children and teenagers, helping them navigate emotional challenges and develop healthy coping skills.",
    therapeutic_approaches: ["Play Therapy", "CBT for Children", "Parent-Child Interaction Therapy"],
    areas_of_expertise: ["Child Therapy", "Adolescent Therapy", "Behavioral Issues", "School-Related Stress"],
    license_number: "LPC-98765",
    years_of_experience: 7,
    accepting_new_clients: true,
    session_rate: 140,
    languages: ["English", "Hindi", "Gujarati"],
    profile_image_url: null,
    createdAt: "2022-01-10T00:00:00.000Z"
  },
  {
    id: "therapist-6",
    name: "Dr. Robert Thompson",
    email: "robert.thompson@aurawell.com",
    user_type: "therapist",
    verification_status: "verified",
    specialization: "OCD & Phobias",
    bio: "I specialize in treating OCD and phobias using evidence-based exposure therapy and cognitive techniques.",
    therapeutic_approaches: ["Exposure and Response Prevention (ERP)", "CBT", "Acceptance and Commitment Therapy (ACT)"],
    areas_of_expertise: ["OCD", "Phobias", "Anxiety Disorders", "Panic Disorder"],
    license_number: "PSY-54321",
    years_of_experience: 9,
    accepting_new_clients: true,
    session_rate: 165,
    languages: ["English"],
    profile_image_url: null,
    createdAt: "2020-11-05T00:00:00.000Z"
  },
  {
    id: "therapist-7",
    name: "Dr. Maria Garcia",
    email: "maria.garcia@aurawell.com",
    user_type: "therapist",
    verification_status: "verified",
    specialization: "Eating Disorders",
    bio: "With a focus on eating disorders, I help individuals develop a healthier relationship with food and their bodies.",
    therapeutic_approaches: ["Dialectical Behavior Therapy (DBT)", "CBT-E", "Family-Based Treatment"],
    areas_of_expertise: ["Anorexia", "Bulimia", "Binge Eating Disorder", "Body Image Issues"],
    license_number: "LCSW-11223",
    years_of_experience: 11,
    accepting_new_clients: true,
    session_rate: 180,
    languages: ["English", "Spanish", "Portuguese"],
    profile_image_url: null,
    createdAt: "2019-04-22T00:00:00.000Z"
  },
  {
    id: "therapist-8",
    name: "Dr. David Lee",
    email: "david.lee@aurawell.com",
    user_type: "therapist",
    verification_status: "verified",
    specialization: "Grief & Loss",
    bio: "I provide compassionate support to individuals navigating grief and loss, helping them find meaning and healing.",
    therapeutic_approaches: ["Grief Therapy", "Existential Therapy", "Mindfulness-Based Therapy"],
    areas_of_expertise: ["Grief Counseling", "Bereavement", "Life Transitions", "End-of-Life Issues"],
    license_number: "LMHC-33445",
    years_of_experience: 14,
    accepting_new_clients: true,
    session_rate: 155,
    languages: ["English", "Korean"],
    profile_image_url: null,
    createdAt: "2018-07-18T00:00:00.000Z"
  }
];

// Mock therapist clients data
export const mockTherapistClients = [
  {
    id: "client-1",
    client_name: "John Anderson",
    client_email: "john.anderson@example.com",
    therapist_email: "sarah.martinez@aurawell.com",
    status: "active",
    connection_date: "2024-01-15T00:00:00.000Z",
    first_session_date: "2024-01-15T00:00:00.000Z",
    last_session_date: "2024-12-10T00:00:00.000Z",
    session_count: 24,
    total_sessions: 24,
    primary_concerns: ["Anxiety", "Panic Attacks", "Work Stress"],
    notes: "Making great progress with anxiety management techniques."
  },
  {
    id: "client-2",
    client_name: "Emily Roberts",
    client_email: "emily.roberts@example.com",
    therapist_email: "sarah.martinez@aurawell.com",
    status: "active",
    connection_date: "2024-03-20T00:00:00.000Z",
    first_session_date: "2024-03-20T00:00:00.000Z",
    last_session_date: "2024-12-08T00:00:00.000Z",
    session_count: 18,
    total_sessions: 18,
    primary_concerns: ["Depression", "Low Self-Esteem"],
    notes: "Working through depression, showing consistent improvement."
  },
  {
    id: "client-3",
    client_name: "Michael Chang",
    client_email: "michael.chang@example.com",
    therapist_email: "michael.chen@aurawell.com",
    status: "active",
    connection_date: "2024-02-10T00:00:00.000Z",
    first_session_date: "2024-02-10T00:00:00.000Z",
    last_session_date: "2024-12-12T00:00:00.000Z",
    session_count: 20,
    total_sessions: 20,
    primary_concerns: ["PTSD", "Trauma", "Sleep Issues"],
    notes: "PTSD treatment progressing well with EMDR therapy."
  }
];

// Mock therapy sessions data
export const mockTherapySessions = [
  {
    id: "session-1",
    therapist_email: "sarah.martinez@aurawell.com",
    client_email: "john.anderson@example.com",
    client_name: "John Anderson",
    scheduled_date: "2024-12-18T14:00:00.000Z",
    duration_minutes: 50,
    status: "scheduled",
    session_type: "individual",
    notes: ""
  },
  {
    id: "session-2",
    therapist_email: "sarah.martinez@aurawell.com",
    client_email: "emily.roberts@example.com",
    client_name: "Emily Roberts",
    scheduled_date: "2024-12-19T10:00:00.000Z",
    duration_minutes: 50,
    status: "scheduled",
    session_type: "individual",
    notes: ""
  },
  {
    id: "session-3",
    therapist_email: "michael.chen@aurawell.com",
    client_email: "michael.chang@example.com",
    client_name: "Michael Chang",
    scheduled_date: "2024-12-20T15:00:00.000Z",
    duration_minutes: 60,
    status: "scheduled",
    session_type: "individual",
    notes: ""
  }
];

// Mock therapist messages data
export const mockTherapistMessages = [
  {
    id: "message-1",
    therapist_email: "sarah.martinez@aurawell.com",
    client_email: "john.anderson@example.com",
    sender_email: "john.anderson@example.com",
    message: "Hi Dr. Martinez, I wanted to let you know I've been practicing the breathing exercises and they're really helping.",
    is_read: false,
    sent_at: "2024-12-15T09:30:00.000Z"
  },
  {
    id: "message-2",
    therapist_email: "sarah.martinez@aurawell.com",
    client_email: "emily.roberts@example.com",
    sender_email: "emily.roberts@example.com",
    message: "Thank you for the session yesterday. I feel much better about the situation now.",
    is_read: false,
    sent_at: "2024-12-14T16:45:00.000Z"
  },
  {
    id: "message-3",
    therapist_email: "michael.chen@aurawell.com",
    client_email: "michael.chang@example.com",
    sender_email: "michael.chang@example.com",
    message: "I had a difficult day today and used the grounding techniques we discussed. They helped a lot.",
    is_read: false,
    sent_at: "2024-12-16T11:20:00.000Z"
  }
];

// Mock client notes data
export const mockClientNotes = [
  {
    id: "note-1",
    therapist_email: "sarah.martinez@aurawell.com",
    client_email: "john.anderson@example.com",
    note_title: "Session 24 - Breakthrough Moment",
    note_content: "John had a significant breakthrough today. He was able to identify the root cause of his anxiety attacks and connect it to past experiences. We discussed coping strategies and he seems ready to implement them.",
    tags: ["breakthrough", "anxiety", "progress"],
    is_important: true,
    created_date: "2024-12-10T14:30:00.000Z"
  },
  {
    id: "note-2",
    therapist_email: "sarah.martinez@aurawell.com",
    client_email: "emily.roberts@example.com",
    note_title: "Progress Check",
    note_content: "Emily is showing steady improvement in her mood. She reported fewer episodes of low mood this week and is more engaged in daily activities.",
    tags: ["progress", "depression", "improvement"],
    is_important: false,
    created_date: "2024-12-08T10:15:00.000Z"
  }
];