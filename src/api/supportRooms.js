/**
 * SUPPORT ROOMS API
 * Uses custom backend instead of Base44/localStorage
 */

import api from './client';
import { User } from './entities';

/**
 * Join a support room for a given group and stage
 * Backend handles all the atomic operations and race conditions
 *
 * @param {string} supportGroupId - The support group ID
 * @param {'beginner'|'intermediate'|'advanced'} stage - The stage level
 * @param {string} userId - The user ID (optional, will use current user)
 * @returns {Promise<{success: boolean, room: object, error?: string}>}
 */
export async function joinStageRoom(supportGroupId, stage, userId = null) {
  try {
    // Check if user is authenticated
    const user = await User.me();

    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Call backend API
    const response = await api.joinRoom(supportGroupId, stage);

    if (response.success) {
      return {
        success: true,
        room: response.room,
        alreadyMember: response.alreadyMember,
        newlyJoined: response.newlyJoined
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to join room'
      };
    }
  } catch (error) {
    console.error('joinStageRoom error:', error);
    return {
      success: false,
      error: error.message || 'Unable to join room at this time'
    };
  }
}

/**
 * Leave a support room
 * @param {string} roomId
 * @param {string} userId
 */
export async function leaveRoom(roomId, userId = null) {
  try {
    const response = await api.leaveRoom(roomId);

    if (response.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to leave room'
      };
    }
  } catch (error) {
    console.error('leaveRoom error:', error);
    return {
      success: false,
      error: 'Failed to leave room'
    };
  }
}

/**
 * Get user's active rooms
 * @param {string} userId
 */
export async function getUserActiveRooms(userId = null) {
  try {
    const response = await api.getMyRooms();

    if (response.success) {
      return {
        success: true,
        rooms: response.data || []
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to get rooms',
        rooms: []
      };
    }
  } catch (error) {
    console.error('getUserActiveRooms error:', error);
    return {
      success: false,
      error: 'Failed to get rooms',
      rooms: []
    };
  }
}

export default {
  joinStageRoom,
  leaveRoom,
  getUserActiveRooms
};
