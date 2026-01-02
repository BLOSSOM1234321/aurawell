/**
 * AURAWELL API ENTITIES
 * Replaces Base44 SDK and localStorage with custom backend API
 */

import api from './client';

// ============================================
// USER ENTITY
// ============================================
export const User = {
  async me() {
    try {
      const response = await api.getMe();
      return response.user || null;
    } catch (error) {
      console.error('User.me error:', error);
      // Fallback to localStorage for current user
      const userData = localStorage.getItem('aurawell_current_user');
      return userData ? JSON.parse(userData) : null;
    }
  },

  async findById(id) {
    try {
      const response = await api.getUserProfile(id);
      return response.data || null;
    } catch (error) {
      console.error('User.findById error:', error);
      return null;
    }
  },

  async update(id, data) {
    try {
      const response = await api.updateProfile(data);
      const updatedUser = response.data;

      // Update localStorage
      localStorage.setItem('aurawell_current_user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error('User.update error:', error);
      throw error;
    }
  },
};

// ============================================
// SUPPORT GROUP ENTITY
// ============================================
export const SupportGroup = {
  async findMany(options = {}) {
    try {
      const response = await api.getSupportGroups();
      return response.data || [];
    } catch (error) {
      console.error('SupportGroup.findMany error:', error);
      return [];
    }
  },

  async findById(id) {
    try {
      const response = await api.getSupportGroup(id);
      return response.data || null;
    } catch (error) {
      console.error('SupportGroup.findById error:', error);
      return null;
    }
  },

  async create(data) {
    console.warn('SupportGroup.create not implemented in backend');
    return null;
  },
};

// ============================================
// SUPPORT ROOM ENTITY
// ============================================
export const SupportRoom = {
  async findMany(options = {}) {
    try {
      const response = await api.getMyRooms();
      return response.data || [];
    } catch (error) {
      console.error('SupportRoom.findMany error:', error);
      return [];
    }
  },

  async findById(id) {
    // Check if user is a moderator
    const userData = localStorage.getItem('aurawell_current_user');
    const isModerator = userData && JSON.parse(userData).email === 'blossomalabor132@gmail.com';

    if (isModerator) {
      // Moderators can view ALL rooms
      try {
        const response = await api.getModerationSupportRooms();
        if (response.success) {
          return response.data.find(r => r.id === id) || null;
        }
      } catch (error) {
        console.error('SupportRoom.findById (moderator) error:', error);
      }
    }

    // Regular users - only show their rooms
    const rooms = await this.findMany();
    return rooms.find(r => r.id === id) || null;
  },

  async update(id, data) {
    console.warn('SupportRoom.update not fully implemented');
    return null;
  },

  async create(data) {
    console.warn('SupportRoom.create - use joinRoom API instead');
    return null;
  },
};

// ============================================
// SUPPORT ROOM MEMBER ENTITY
// ============================================
export const SupportRoomMember = {
  async findMany(options = {}) {
    if (options.where && options.where.userId) {
      const response = await api.getMyRooms();
      return response.data || [];
    }
    if (options.where && options.where.roomId) {
      try {
        const response = await api.getRoomMembers(options.where.roomId);
        return response.data || [];
      } catch (error) {
        return [];
      }
    }
    return [];
  },

  async findFirst(options = {}) {
    const results = await this.findMany(options);
    return results[0] || null;
  },

  async create(data) {
    console.warn('SupportRoomMember.create - use joinRoom API instead');
    return null;
  },

  async update(id, data) {
    console.warn('SupportRoomMember.update not implemented');
    return null;
  },
};

// ============================================
// MESSAGE ENTITIES
// ============================================
export const SupportRoomMessage = {
  async findMany(options = {}) {
    const roomId = options.where?.roomId || options.where?.room_id;
    if (!roomId) {
      console.error('SupportRoomMessage.findMany requires roomId');
      return [];
    }

    try {
      const response = await api.getMessages(roomId, 50, 0);
      return response.data || [];
    } catch (error) {
      console.error('SupportRoomMessage.findMany error:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const roomId = data.roomId || data.room_id;
      const content = data.text || data.content;
      const response = await api.sendMessage(roomId, content);
      return response.data || null;
    } catch (error) {
      console.error('SupportRoomMessage.create error:', error);
      throw error;
    }
  },
};

// Alias for compatibility
export const Message = SupportRoomMessage;

// ============================================
// ROOM POST ENTITY
// ============================================
export const RoomPost = {
  async findMany(options = {}) {
    if (!options.where || !options.where.roomId) {
      console.error('RoomPost.findMany requires roomId');
      return [];
    }

    try {
      const response = await api.getRoomPosts(options.where.roomId);
      return response.data || [];
    } catch (error) {
      console.error('RoomPost.findMany error:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const response = await api.createRoomPost(data.roomId, data.content);
      return response.data || null;
    } catch (error) {
      console.error('RoomPost.create error:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await api.updateRoomPost(id, data.content);
      return response.data || null;
    } catch (error) {
      console.error('RoomPost.update error:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await api.deleteRoomPost(id);
      return { success: true };
    } catch (error) {
      console.error('RoomPost.delete error:', error);
      throw error;
    }
  },

  async archive(id) {
    try {
      const response = await api.archiveRoomPost(id);
      return response.data || null;
    } catch (error) {
      console.error('RoomPost.archive error:', error);
      throw error;
    }
  },

  async toggleLike(id) {
    try {
      await api.togglePostLike(id);
      return { success: true };
    } catch (error) {
      console.error('RoomPost.toggleLike error:', error);
      throw error;
    }
  },

  async toggleFavorite(id) {
    try {
      const response = await api.togglePostFavorite(id);
      return response;
    } catch (error) {
      console.error('RoomPost.toggleFavorite error:', error);
      throw error;
    }
  },
};

// ============================================
// POST COMMENT ENTITY
// ============================================
export const PostComment = {
  async findMany(options = {}) {
    if (!options.where || !options.where.postId) {
      console.error('PostComment.findMany requires postId');
      return [];
    }

    try {
      const response = await api.getPostComments(options.where.postId);
      return response.data || [];
    } catch (error) {
      console.error('PostComment.findMany error:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const response = await api.addPostComment(data.postId, data.content);
      return response.data || null;
    } catch (error) {
      console.error('PostComment.create error:', error);
      throw error;
    }
  },

  async toggleLike(id) {
    try {
      await api.toggleCommentLike(id);
      return { success: true };
    } catch (error) {
      console.error('PostComment.toggleLike error:', error);
      throw error;
    }
  },
};

// ============================================
// MOOD ENTRY ENTITY
// ============================================
export const MoodEntry = {
  async findMany(options = {}) {
    try {
      const response = await api.getMoods(options.limit || 30);
      return response.data || [];
    } catch (error) {
      console.error('MoodEntry.findMany error:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const response = await api.createMood(data);
      return response.data || null;
    } catch (error) {
      console.error('MoodEntry.create error:', error);
      throw error;
    }
  },
};

// ============================================
// JOURNAL ENTRY ENTITY
// ============================================
export const JournalEntry = {
  async findMany(options = {}) {
    try {
      const response = await api.getJournals();
      return response.data || [];
    } catch (error) {
      console.error('JournalEntry.findMany error:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const response = await api.createJournal(data);
      return response.data || null;
    } catch (error) {
      console.error('JournalEntry.create error:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await api.updateJournal(id, data);
      return response.data || null;
    } catch (error) {
      console.error('JournalEntry.update error:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await api.deleteJournal(id);
      return { success: true };
    } catch (error) {
      console.error('JournalEntry.delete error:', error);
      return { success: false };
    }
  },
};

// ============================================
// MEDITATION ENTITY
// ============================================
export const MeditationSession = {
  async findMany(options = {}) {
    try {
      const category = options.where?.category;
      const response = await api.getMeditations(category);
      return response.data || [];
    } catch (error) {
      console.error('MeditationSession.findMany error:', error);
      return [];
    }
  },
};

// ============================================
// REEL ENTITY
// ============================================
export const Reel = {
  async findMany(options = {}) {
    try {
      const response = await api.getReels(options.limit || 20);
      return response.data || [];
    } catch (error) {
      console.error('Reel.findMany error:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const response = await api.createReel(data);
      return response.data || null;
    } catch (error) {
      console.error('Reel.create error:', error);
      throw error;
    }
  },
};

// ============================================
// PLACEHOLDER ENTITIES (Not yet implemented in backend)
// ============================================

// These entities return empty arrays for now
// They can be implemented in the backend later

function createPlaceholderEntity(name) {
  return {
    async create(data) {
      console.warn(`${name}.create not implemented - using localStorage fallback`);
      const items = JSON.parse(localStorage.getItem(`aurawell_${name}`) || '[]');
      const newItem = {
        id: `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      items.push(newItem);
      localStorage.setItem(`aurawell_${name}`, JSON.stringify(items));
      return newItem;
    },
    async findMany(options = {}) {
      const items = JSON.parse(localStorage.getItem(`aurawell_${name}`) || '[]');
      return items;
    },
    async findById(id) {
      const items = JSON.parse(localStorage.getItem(`aurawell_${name}`) || '[]');
      return items.find(i => i.id === id) || null;
    },
    async update(id, data) {
      const items = JSON.parse(localStorage.getItem(`aurawell_${name}`) || '[]');
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...data };
        localStorage.setItem(`aurawell_${name}`, JSON.stringify(items));
        return items[index];
      }
      return null;
    },
    async delete(id) {
      const items = JSON.parse(localStorage.getItem(`aurawell_${name}`) || '[]');
      const filtered = items.filter(i => i.id !== id);
      localStorage.setItem(`aurawell_${name}`, JSON.stringify(filtered));
      return { success: true };
    },
  };
}

// Community & other entities (using localStorage fallback for now)
export const Dream = createPlaceholderEntity('Dream');
export const DreamEntry = Dream;
export const VoiceMoodLog = createPlaceholderEntity('VoiceMoodLog');
export const Circle = createPlaceholderEntity('Circle');
export const CircleMember = createPlaceholderEntity('CircleMember');
export const CircleMessage = createPlaceholderEntity('CircleMessage');
export const CommunityGroup = createPlaceholderEntity('CommunityGroup');
export const CommunityPost = createPlaceholderEntity('CommunityPost');
export const PostLike = createPlaceholderEntity('PostLike');
export const ContentViolationReport = createPlaceholderEntity('ContentViolationReport');
export const CommunityEvent = createPlaceholderEntity('CommunityEvent');
export const CommunityChallenge = createPlaceholderEntity('CommunityChallenge');
export const ChallengeParticipation = createPlaceholderEntity('ChallengeParticipation');
export const EventRegistration = createPlaceholderEntity('EventRegistration');
export const UserGroup = createPlaceholderEntity('UserGroup');
export const GroupMembership = createPlaceholderEntity('GroupMembership');
export const WorldMapPin = createPlaceholderEntity('WorldMapPin');
export const SacredSpaceEntry = createPlaceholderEntity('SacredSpaceEntry');
export const SacredSpaceSession = createPlaceholderEntity('SacredSpaceSession');
export const InnerSanctumEntry = createPlaceholderEntity('InnerSanctumEntry');
export const CustomCard = createPlaceholderEntity('CustomCard');
export const GratitudePost = createPlaceholderEntity('GratitudePost');
export const SafetyAlert = createPlaceholderEntity('SafetyAlert');
export const CrisisDetectionLog = createPlaceholderEntity('CrisisDetectionLog');
export const FlaggedContent = createPlaceholderEntity('FlaggedContent');
export const ModerationAction = createPlaceholderEntity('ModerationAction');

// Export all
export default {
  User,
  SupportGroup,
  SupportRoom,
  SupportRoomMember,
  SupportRoomMessage,
  Message,
  MoodEntry,
  JournalEntry,
  MeditationSession,
  Reel,
  Dream,
  DreamEntry,
  VoiceMoodLog,
  Circle,
  CircleMember,
  CircleMessage,
  CommunityGroup,
  CommunityPost,
  PostLike,
  ContentViolationReport,
  CommunityEvent,
  CommunityChallenge,
  ChallengeParticipation,
  EventRegistration,
  UserGroup,
  GroupMembership,
  WorldMapPin,
  SacredSpaceEntry,
  SacredSpaceSession,
  InnerSanctumEntry,
  CustomCard,
  GratitudePost,
  SafetyAlert,
  CrisisDetectionLog,
  FlaggedContent,
  ModerationAction,
};
