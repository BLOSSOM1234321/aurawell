# Support Rooms System - User Guide

## Overview

The Support Rooms system provides stage-based (beginner/intermediate/advanced) chat rooms for mental health support groups. All data is stored in browser localStorage - no backend required.

## Quick Start

### 1. Initialize Support Groups

First, you need to seed the database with Support Groups:

1. Navigate to: `http://localhost:5180/InitializeSupportGroups`
2. Click "Initialize Support Groups"
3. This will create 6 default Support Groups in localStorage:
   - Anxiety Support
   - Depression Support
   - Trauma Recovery & PTSD
   - Bipolar & Mood Disorder Support
   - Borderline Personality Disorder (BPD) Support
   - ADHD & Neurodivergence Support

### 2. View Support Groups

1. Navigate to: `http://localhost:5180/Community`
2. Click on "Support Groups"
3. Browse available Support Groups

### 3. Join a Support Room

1. Click on any Support Group
2. Select your stage level:
   - **Beginner**: Just starting your journey
   - **Intermediate**: Making progress
   - **Advanced**: Experienced members
3. You'll be automatically placed in an appropriate chat room (max 10 members per room)
4. Start chatting with others at your stage level

### 4. Enable Moderator Access (Optional)

If you want to access the Moderator Dashboard:

1. Navigate to: `http://localhost:5180/AdminTools`
2. Click "Upgrade to Moderator" or "Upgrade to Admin"
3. Navigate to: `http://localhost:5180/ModeratorDashboard`
4. View all active rooms and perform moderation actions

## System Architecture

### localStorage Storage Keys

- `aurawell_SupportGroup` - Support Groups (Anxiety, Depression, etc.)
- `aurawell_SupportRoom` - Individual chat rooms (stage-based)
- `aurawell_SupportRoomMember` - Room memberships
- `aurawell_SupportRoomMessage` - Chat messages
- `aurawell_ModerationAction` - Audit trail of moderation actions
- `aurawell_users` - User accounts
- `aurawell_current_user` - Currently logged-in user

### Key Features

1. **Stage-Based Rooms**: Each Support Group has three stages (beginner/intermediate/advanced)
2. **Auto-Room Management**:
   - Rooms auto-create when needed
   - Max 10 members per room
   - New rooms created when existing ones are full
3. **Access Control**:
   - Banned users cannot join rooms
   - Suspended users see countdown until suspension ends
   - Auto-unsuspend when suspension period expires
4. **Moderation Tools**:
   - Kick users from rooms
   - Suspend users (temporary ban)
   - Ban users (permanent ban)
   - Delete messages
   - Archive rooms
   - View moderation history

## File Structure

### Core API Files

- **src/api/entities.js** - localStorage-based entity system (CRUD operations)
- **src/api/supportRooms.js** - Room joining/leaving logic with access control
- **src/api/moderation.js** - Moderation actions (kick, suspend, ban, etc.)

### Pages

- **src/pages/Groups.jsx** - List all Support Groups
- **src/pages/SupportGroupStageSelection.jsx** - Choose stage level
- **src/pages/SupportRoomChat.jsx** - Chat room interface
- **src/pages/ModeratorDashboard.jsx** - Moderator oversight dashboard
- **src/pages/AdminTools.jsx** - Tool to upgrade user roles
- **src/pages/InitializeSupportGroups.jsx** - One-click data seeding

### Utilities

- **src/utils/seedSupportGroups.js** - Seed data script (can run in console)

## User Flow

```
1. User logs in
   ↓
2. Navigates to Community → Support Groups
   ↓
3. Clicks on a Support Group (e.g., "Anxiety Support")
   ↓
4. Selects stage (Beginner/Intermediate/Advanced)
   ↓
5. System checks:
   - Is user banned? → Block with error
   - Is user suspended? → Show suspension info
   - Already in a room for this group/stage? → Return existing room
   - Any rooms with space? → Join existing room
   - All rooms full? → Create new room
   ↓
6. User enters chat room
   ↓
7. User can send messages, leave room, etc.
```

## Moderation Flow

```
1. User upgrades to moderator via AdminTools
   ↓
2. Navigates to ModeratorDashboard
   ↓
3. Views all active rooms
   ↓
4. For each room, can:
   - View member list
   - Kick specific users
   - View user moderation history
   ↓
5. All actions logged to ModerationAction entity
```

## Testing the System

### Basic Testing Steps:

1. **Initialize Data**: Visit `/InitializeSupportGroups` and click the button
2. **Create Test User**: Sign up via `/auth`
3. **Join Room**: Navigate to Community → Support Groups → Any Group → Select Stage
4. **Test Chat**: Send a few messages in the room
5. **Test Moderation**:
   - Visit `/AdminTools` to upgrade to moderator
   - Visit `/ModeratorDashboard` to see your room
   - Try kicking yourself from the room (will work even as moderator)
6. **Test Access Control**:
   - Visit `/AdminTools` and upgrade to regular user
   - Try joining a room - should work
   - Manually edit localStorage to set user status to 'banned'
   - Try joining again - should be blocked

### Manual Data Inspection:

Open browser DevTools → Application → Local Storage → http://localhost:5180

You can view/edit all data:
```javascript
// View Support Groups
JSON.parse(localStorage.getItem('aurawell_SupportGroup'))

// View Rooms
JSON.parse(localStorage.getItem('aurawell_SupportRoom'))

// View Room Members
JSON.parse(localStorage.getItem('aurawell_SupportRoomMember'))

// View Messages
JSON.parse(localStorage.getItem('aurawell_SupportRoomMessage'))

// View Moderation Actions
JSON.parse(localStorage.getItem('aurawell_ModerationAction'))

// View Current User
JSON.parse(localStorage.getItem('aurawell_current_user'))
```

## Clearing All Data

To reset the entire Support Rooms system:

1. Visit `/InitializeSupportGroups`
2. Click "Clear All Support Groups Data"

Or manually via console:
```javascript
localStorage.removeItem('aurawell_SupportGroup');
localStorage.removeItem('aurawell_SupportRoom');
localStorage.removeItem('aurawell_SupportRoomMember');
localStorage.removeItem('aurawell_SupportRoomMessage');
localStorage.removeItem('aurawell_ModerationAction');
```

## Routes

- `/Community` - Community hub
- `/Groups` - List all Support Groups
- `/support-group/:groupId` - Stage selection for a specific group
- `/support-room/:roomId` - Chat room
- `/ModeratorDashboard` - Moderator tools (requires moderator role)
- `/AdminTools` - Upgrade user role
- `/InitializeSupportGroups` - Initialize Support Groups data

## Known Limitations

1. **No Real-Time Updates**: Messages don't auto-refresh (users must manually reload)
2. **No Persistence Across Browsers**: Data is browser-specific
3. **No True Atomic Operations**: localStorage doesn't support transactions (retry logic compensates)
4. **No Server Validation**: All validation happens client-side

## Future Enhancements

- Add WebSocket support for real-time messages
- Add backend API to persist data across devices
- Add file/image upload to chat
- Add message reactions/likes
- Add typing indicators
- Add read receipts
- Add notification system for new messages
- Add search/filter for Support Groups
- Add user profiles with avatars

## Troubleshooting

### "No groups available"
- Visit `/InitializeSupportGroups` to seed data

### "Unauthorized access" on ModeratorDashboard
- Visit `/AdminTools` to upgrade your user role

### Messages not showing up
- Check browser console for errors
- Verify localStorage has data
- Try refreshing the page

### Room stuck at "full" with fewer than 10 members
- This can happen if users leave without properly decrementing memberCount
- Clear and re-initialize data via `/InitializeSupportGroups`

## Development Notes

- All entity operations return Promises (even though localStorage is synchronous)
- This maintains API compatibility if we later switch to a real backend
- The retry logic in `joinStageRoom()` helps handle race conditions
- Moderation actions are logged to an audit trail for accountability