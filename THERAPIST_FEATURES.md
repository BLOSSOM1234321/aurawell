# Therapist Features Documentation

## 🔐 Therapist Settings & Controls

Access via: **Settings → Therapist Tab** (only visible for therapist accounts)

### Privacy Controls
- **Profile Visibility**: Public, Verified Users Only, Clients Only, or Private
- **Show Contact Information**: Toggle email/phone visibility
- **Allow Client Reviews**: Control client review permissions

### Messaging & Communication
- **Who Can Message**: Anyone, Verified Clients, Current Clients, or No One
- **Who Can Comment**: Anyone, Verified Users, Clients Only, or Disabled
- **Auto-Reply System**: Customizable automatic responses to new messages

### Availability Scheduling
- **Available Days**: Select days of the week
- **Working Hours**: Set start and end times
- **Accepting New Clients**: Toggle availability status
- **Max Clients Per Week**: Set capacity limits

### Notification Preferences
- Email notifications toggle
- New client request alerts
- Session reminders
- Urgent messages only mode

### Content Moderation Filters
- Profanity filter
- Spam detection
- Message approval requirements

### Trigger Topic Opt-Out
10 sensitive topics you can opt out of:
- Self-harm
- Suicide
- Sexual assault
- Domestic violence
- Child abuse
- Substance abuse
- Eating disorders
- PTSD/Trauma
- Grief/Loss
- Relationship violence

### Data Export
- Export client notes
- Export session history
- Export all professional data

### Professional Liability Disclaimer
- Customizable disclaimer editor
- Displayed on profile and in communications

### Emergency Escalation Preferences
- Emergency contact system
- Crisis protocol documentation
- Backup contact information

---

## 💬 Secure Messaging System

Access via: **Dashboard → Messages** or navigate to `/TherapistMessages`

### Security Features
- **End-to-End Encrypted**: All messages are marked as encrypted
- **HIPAA Compliant**: Built with healthcare compliance in mind
- **Secure Indicators**: Lock icons and encryption badges throughout

### Message Types

#### 1. Text Messages
- Standard text communication
- Support for multi-line messages
- Message labels (see below)

#### 2. Quick Therapeutic Responses
Three pre-built therapeutic templates:

**Grounding Exercise** (5-4-3-2-1 Technique)
- Helps clients return to the present moment
- Interactive sensory awareness exercise
- Automatically labeled as "Grounding Exercise"

**Breathing Exercise** (Box Breathing)
- Structured breathing pattern
- 4-count breathing technique
- Automatically labeled as "Breathing Prompt"

**Crisis Resources**
- Emergency hotline numbers
- Crisis text line information
- Safety protocols
- Automatically labeled as "Crisis Resource"

### Message Labels
Tag every message with context:
- **Emotional Check-in** (Blue badge)
- **Session Follow-up** (Green badge)
- **Urgent** (Red badge)
- **General** (Gray badge)

### Auto-Boundary Reminders
Occasional automatic reminders appear below therapist messages:
- "This platform does not replace emergency care. For crisis support, call 988."
- Displayed with shield icon
- Helps maintain professional boundaries

### Crisis Keyword Detection
Automatically detects crisis-related keywords:
- suicide, kill myself, end my life, want to die
- self harm, cutting, hurt myself, overdose
- kill, harm others, shoot, weapon

**When detected:**
1. Shows crisis alert modal
2. Displays emergency protocol
3. Options to cancel or log & send
4. Prompts therapist to follow emergency procedures

### Conversation Management

#### Conversation List
- Client name and status
- Last message preview
- Unread message count
- Urgent indicators
- Search functionality

#### Conversation Summaries (Therapist-Only)
Generate conversation statistics:
- Total message count
- Client vs therapist message ratio
- Label distribution
- Date range

#### Message Archiving
- Archive conversations per client
- Remove from active list
- Preserved for record-keeping

### User Interface Features
- Clean, professional layout
- Real-time message updates
- Smooth animations
- Mobile-responsive design
- Quick response shortcuts
- Easy label selection

---

## 🔑 Access the Messaging System

### For Therapists:
1. Log in with therapist account
2. Go to Dashboard
3. Click "Messages" or navigate to `/TherapistMessages`
4. Select a conversation to begin

### Test Account:
- **Email**: therapist@test.com
- **Password**: password123

---

## 📋 localStorage Data Structure

### Conversations
Stored at: `therapist_conversations`
```json
{
  "id": "1",
  "clientName": "John D.",
  "clientId": "client-1",
  "lastMessage": "Thank you for the session today",
  "lastMessageTime": "2025-01-15T10:30:00.000Z",
  "unreadCount": 0,
  "status": "active",
  "archived": false,
  "hasUrgent": false
}
```

### Messages
Stored at: `messages_{conversationId}`
```json
{
  "id": "1",
  "conversationId": "1",
  "senderId": "therapist-001",
  "senderName": "Dr. Sarah Thompson",
  "message": "How are you feeling today?",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "label": "emotional-checkin",
  "isTherapist": true,
  "boundaryReminder": false
}
```

### Therapist Settings
Stored in user object: `therapist_settings`

---

## 🎯 Best Practices

### For Message Safety:
1. Always review crisis alerts carefully
2. Follow your documented emergency protocol
3. Use appropriate message labels
4. Archive completed conversations
5. Regular conversation summaries for documentation

### For Professional Boundaries:
1. Customize your liability disclaimer
2. Set clear availability hours
3. Use auto-boundary reminders
4. Configure opt-out topics
5. Set appropriate response time expectations

### For Client Communication:
1. Use quick responses for common situations
2. Apply appropriate message labels
3. Monitor urgent indicators
4. Maintain professional language
5. Document important conversations

---

## 🚀 Future Enhancement Ideas
- Video call integration
- Session scheduling within messages
- Automated appointment reminders
- Client intake forms
- Progress note templates
- Billing integration
- Multi-therapist practice support
- Client portal access