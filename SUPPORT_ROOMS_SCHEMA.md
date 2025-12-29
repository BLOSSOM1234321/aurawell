# Support Rooms System - Base44 Schema

## CRITICAL: Add these entities to your Base44 Dashboard

Navigate to: https://base44.io/dashboard → Your App → Entities

---

## 1. Update User Entity

Add these fields to your existing **User** entity:

```
role (enum)
  - Options: user, therapist, moderator, admin
  - Default: user

status (enum)
  - Options: active, suspended, banned
  - Default: active

suspendedUntil (datetime, nullable)
  - Description: When suspension expires

moderation_notes (text, nullable)
  - Description: Internal notes for moderators
```

---

## 2. SupportGroup Entity (NEW)

```
name (text, required)
  - Example: "Anxiety Support"

description (text)
  - Example: "A safe space for anxiety management"

enabledStages (text[], required)
  - Options: ["beginner", "intermediate", "advanced"]
  - Default: ["beginner", "intermediate", "advanced"]

icon (text, nullable)
  - Icon name or URL

isActive (boolean)
  - Default: true

createdAt (datetime, auto)
```

---

## 3. SupportRoom Entity (NEW)

```
supportGroupId (relation → SupportGroup, required)
  - Links to parent support group

stage (enum, required)
  - Options: beginner, intermediate, advanced

roomNumber (integer, required)
  - Auto-incremented room number per group+stage

status (enum, required)
  - Options: open, full, archived
  - Default: open

memberCount (integer, required)
  - Default: 0
  - Max: 10

maxMembers (integer, required)
  - Default: 10

createdAt (datetime, auto)

archivedAt (datetime, nullable)

---

UNIQUE CONSTRAINT: (supportGroupId, stage, roomNumber)
```

---

## 4. SupportRoomMember Entity (NEW)

```
roomId (relation → SupportRoom, required)
  - Which room the user is in

userId (relation → User, required)
  - Which user is a member

joinedAt (datetime, auto)

roleInRoom (enum, nullable)
  - Options: member, roomModerator
  - Default: member

leftAt (datetime, nullable)
  - When user left/was removed

---

UNIQUE CONSTRAINT: (roomId, userId)
```

---

## 5. SupportRoomMessage Entity (NEW)

```
roomId (relation → SupportRoom, required)
  - Which room the message belongs to

userId (relation → User, required)
  - Who sent the message

text (text, required)
  - Message content

createdAt (datetime, auto)

deletedAt (datetime, nullable)
  - When message was deleted (soft delete)

deletedBy (relation → User, nullable)
  - Which moderator deleted it

moderationReason (text, nullable)
  - Why the message was deleted

isEdited (boolean)
  - Default: false
```

---

## 6. ModerationAction Entity (NEW - Audit Log)

```
moderatorId (relation → User, required)
  - Which moderator performed the action

actionType (enum, required)
  - Options: suspend, unsuspend, ban, unban, kick, delete_message, warn, archive_room

targetUserId (relation → User, nullable)
  - User being moderated

targetRoomId (relation → SupportRoom, nullable)
  - Room being moderated

targetMessageId (relation → SupportRoomMessage, nullable)
  - Message being moderated

reason (text, required)
  - Why the action was taken

metadata (json, nullable)
  - Additional context (duration, previous values, etc.)

createdAt (datetime, auto)
```

---

## INDEXES (Performance Optimization)

Add these indexes in Base44:

```
SupportRoom:
  - (supportGroupId, stage, status) - For finding open rooms
  - (status, memberCount) - For room availability queries

SupportRoomMember:
  - (userId, leftAt) - For finding user's active rooms
  - (roomId) - For room member queries

SupportRoomMessage:
  - (roomId, createdAt) - For message timeline
  - (deletedAt) - For filtering deleted messages

ModerationAction:
  - (targetUserId, createdAt) - For user moderation history
  - (moderatorId, createdAt) - For moderator activity
```

---

## AFTER ADDING ENTITIES

1. Go to Base44 Dashboard → API
2. Generate new SDK types
3. Update your `src/api/entities.js` file