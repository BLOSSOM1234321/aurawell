import { User, SupportRoom, SupportRoomMember, SupportRoomMessage, ModerationAction } from './entities';

/**
 * MODERATION MIDDLEWARE
 * Checks if user is Blossom Alabor (the only authorized moderator)
 */
export async function requireModerator(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // ONLY Blossom Alabor has moderator access
  const isBlossomAlabor = user.name === 'Blossom Alabor' || (user.email && user.email.toLowerCase().includes('blossom'));

  if (!isBlossomAlabor) {
    throw new Error('Unauthorized: Moderator access required');
  }

  return user;
}

/**
 * Log moderation action to audit trail
 */
async function logModerationAction(moderatorId, actionType, data = {}) {
  try {
    await ModerationAction.create({
      moderatorId,
      actionType,
      targetUserId: data.targetUserId || null,
      targetRoomId: data.targetRoomId || null,
      targetMessageId: data.targetMessageId || null,
      reason: data.reason || 'No reason provided',
      metadata: JSON.stringify(data.metadata || {})
    });
  } catch (error) {
    console.error('Failed to log moderation action:', error);
    // Don't fail the whole operation if logging fails
  }
}

/**
 * KICK USER FROM ROOM
 * Removes user from room immediately
 *
 * @param {string} moderatorId - ID of moderator performing action
 * @param {string} userId - ID of user to kick
 * @param {string} roomId - ID of room to kick from
 * @param {string} reason - Reason for kick
 */
export async function kickUserFromRoom(moderatorId, userId, roomId, reason) {
  try {
    // Verify moderator status
    await requireModerator(moderatorId);

    // Find active membership
    const membership = await SupportRoomMember.findFirst({
      where: {
        userId: userId,
        roomId: roomId,
        leftAt: null
      }
    });

    if (!membership) {
      return { success: false, error: 'User is not in this room' };
    }

    // Mark as left
    await SupportRoomMember.update(membership.id, {
      leftAt: new Date()
    });

    // Decrement member count
    const room = await SupportRoom.findById(roomId);
    if (room && room.memberCount > 0) {
      await SupportRoom.update(roomId, {
        memberCount: room.memberCount - 1,
        status: 'open'
      });
    }

    // Log action
    await logModerationAction(moderatorId, 'kick', {
      targetUserId: userId,
      targetRoomId: roomId,
      reason: reason,
      metadata: { timestamp: new Date().toISOString() }
    });

    return { success: true };
  } catch (error) {
    console.error('kickUserFromRoom error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * SUSPEND USER
 * Temporarily bans user from all support groups
 *
 * @param {string} moderatorId
 * @param {string} userId
 * @param {number} durationDays - How many days to suspend
 * @param {string} reason
 */
export async function suspendUser(moderatorId, userId, durationDays, reason) {
  try {
    // Verify moderator status
    await requireModerator(moderatorId);

    const suspendedUntil = new Date();
    suspendedUntil.setDate(suspendedUntil.getDate() + durationDays);

    // Update user status
    await User.update(userId, {
      status: 'suspended',
      suspendedUntil: suspendedUntil
    });

    // Remove user from ALL active rooms
    const memberships = await SupportRoomMember.findMany({
      where: {
        userId: userId,
        leftAt: null
      }
    });

    for (const membership of memberships) {
      await SupportRoomMember.update(membership.id, {
        leftAt: new Date()
      });

      // Decrement member counts
      const room = await SupportRoom.findById(membership.roomId);
      if (room && room.memberCount > 0) {
        await SupportRoom.update(membership.roomId, {
          memberCount: room.memberCount - 1,
          status: 'open'
        });
      }
    }

    // Log action
    await logModerationAction(moderatorId, 'suspend', {
      targetUserId: userId,
      reason: reason,
      metadata: {
        durationDays: durationDays,
        suspendedUntil: suspendedUntil.toISOString(),
        roomsRemoved: memberships.length
      }
    });

    return { success: true, suspendedUntil };
  } catch (error) {
    console.error('suspendUser error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * UNSUSPEND USER
 * Removes suspension early
 */
export async function unsuspendUser(moderatorId, userId, reason) {
  try {
    await requireModerator(moderatorId);

    await User.update(userId, {
      status: 'active',
      suspendedUntil: null
    });

    await logModerationAction(moderatorId, 'unsuspend', {
      targetUserId: userId,
      reason: reason
    });

    return { success: true };
  } catch (error) {
    console.error('unsuspendUser error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * BAN USER
 * Permanently bans user from support groups
 */
export async function banUser(moderatorId, userId, reason) {
  try {
    await requireModerator(moderatorId);

    // Update user status
    await User.update(userId, {
      status: 'banned',
      suspendedUntil: null
    });

    // Remove from all active rooms
    const memberships = await SupportRoomMember.findMany({
      where: {
        userId: userId,
        leftAt: null
      }
    });

    for (const membership of memberships) {
      await SupportRoomMember.update(membership.id, {
        leftAt: new Date()
      });

      const room = await SupportRoom.findById(membership.roomId);
      if (room && room.memberCount > 0) {
        await SupportRoom.update(membership.roomId, {
          memberCount: room.memberCount - 1,
          status: 'open'
        });
      }
    }

    await logModerationAction(moderatorId, 'ban', {
      targetUserId: userId,
      reason: reason,
      metadata: { roomsRemoved: memberships.length }
    });

    return { success: true };
  } catch (error) {
    console.error('banUser error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * UNBAN USER
 */
export async function unbanUser(moderatorId, userId, reason) {
  try {
    await requireModerator(moderatorId);

    await User.update(userId, {
      status: 'active',
      suspendedUntil: null
    });

    await logModerationAction(moderatorId, 'unban', {
      targetUserId: userId,
      reason: reason
    });

    return { success: true };
  } catch (error) {
    console.error('unbanUser error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * DELETE MESSAGE (Soft Delete)
 */
export async function deleteMessage(moderatorId, messageId, reason) {
  try {
    await requireModerator(moderatorId);

    const message = await SupportRoomMessage.findById(messageId);

    if (!message) {
      return { success: false, error: 'Message not found' };
    }

    if (message.deletedAt) {
      return { success: false, error: 'Message already deleted' };
    }

    await SupportRoomMessage.update(messageId, {
      deletedAt: new Date(),
      deletedBy: moderatorId,
      moderationReason: reason
    });

    await logModerationAction(moderatorId, 'delete_message', {
      targetUserId: message.userId,
      targetRoomId: message.roomId,
      targetMessageId: messageId,
      reason: reason
    });

    return { success: true };
  } catch (error) {
    console.error('deleteMessage error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * GET MODERATION HISTORY for a user
 */
export async function getUserModerationHistory(moderatorId, userId) {
  try {
    await requireModerator(moderatorId);

    const actions = await ModerationAction.findMany({
      where: {
        targetUserId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        moderator: true
      }
    });

    return { success: true, actions };
  } catch (error) {
    console.error('getUserModerationHistory error:', error);
    return { success: false, error: error.message, actions: [] };
  }
}

/**
 * GET ALL ROOMS (Moderator view)
 */
export async function getAllRooms(moderatorId, filters = {}) {
  try {
    await requireModerator(moderatorId);

    const where = {};

    if (filters.supportGroupId) {
      where.supportGroupId = filters.supportGroupId;
    }

    if (filters.stage) {
      where.stage = filters.stage;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const rooms = await SupportRoom.findMany({
      where,
      include: {
        supportGroup: true,
        members: {
          include: {
            user: true
          },
          where: {
            leftAt: null
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { success: true, rooms };
  } catch (error) {
    console.error('getAllRooms error:', error);
    return { success: false, error: error.message, rooms: [] };
  }
}

/**
 * ARCHIVE ROOM
 * Closes a room permanently
 */
export async function archiveRoom(moderatorId, roomId, reason) {
  try {
    await requireModerator(moderatorId);

    await SupportRoom.update(roomId, {
      status: 'archived',
      archivedAt: new Date()
    });

    // Remove all active members
    const memberships = await SupportRoomMember.findMany({
      where: {
        roomId: roomId,
        leftAt: null
      }
    });

    for (const membership of memberships) {
      await SupportRoomMember.update(membership.id, {
        leftAt: new Date()
      });
    }

    await logModerationAction(moderatorId, 'archive_room', {
      targetRoomId: roomId,
      reason: reason,
      metadata: { membersRemoved: memberships.length }
    });

    return { success: true };
  } catch (error) {
    console.error('archiveRoom error:', error);
    return { success: false, error: error.message };
  }
}