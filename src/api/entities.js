/**
 * LOCAL STORAGE ENTITY SYSTEM
 * Simple CRUD operations using localStorage instead of a backend
 */

// Helper to create a localStorage-based entity
function createEntity(entityName) {
  const storageKey = `aurawell_${entityName}`;

  return {
    async create(data) {
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newItem = {
        id: `${entityName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.push(newItem);
      localStorage.setItem(storageKey, JSON.stringify(items));
      return newItem;
    },

    async findById(id, options = {}) {
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const item = items.find(i => i.id === id);

      if (!item) return null;

      // Handle includes
      if (options.include) {
        return await this._resolveIncludes(item, options.include);
      }

      return item;
    },

    async findMany(options = {}) {
      let items = JSON.parse(localStorage.getItem(storageKey) || '[]');

      // Apply where filter
      if (options.where) {
        items = items.filter(item => {
          return Object.entries(options.where).every(([key, value]) => {
            // Handle special operators
            if (key.endsWith('_lt')) {
              const field = key.replace('_lt', '');
              return item[field] < value;
            }
            if (key.endsWith('_gt')) {
              const field = key.replace('_gt', '');
              return item[field] > value;
            }
            return item[key] === value;
          });
        });
      }

      // Apply orderBy
      if (options.orderBy) {
        const [field, direction] = Object.entries(options.orderBy)[0];
        items.sort((a, b) => {
          if (direction === 'asc') {
            return a[field] > b[field] ? 1 : -1;
          } else {
            return a[field] < b[field] ? 1 : -1;
          }
        });
      }

      // Apply limit
      if (options.limit) {
        items = items.slice(0, options.limit);
      }

      // Handle includes
      if (options.include) {
        items = await Promise.all(
          items.map(item => this._resolveIncludes(item, options.include))
        );
      }

      return items;
    },

    async findFirst(options = {}) {
      const items = await this.findMany({ ...options, limit: 1 });
      return items[0] || null;
    },

    async update(id, data) {
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const index = items.findIndex(i => i.id === id);

      if (index === -1) {
        throw new Error(`${entityName} with id ${id} not found`);
      }

      items[index] = {
        ...items[index],
        ...data,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(storageKey, JSON.stringify(items));
      return items[index];
    },

    async delete(id) {
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const filtered = items.filter(i => i.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      return { success: true };
    },

    async _resolveIncludes(item, include) {
      const resolved = { ...item };

      for (const [relation, config] of Object.entries(include)) {
        if (config === true) {
          // Simple relation (e.g., include: { user: true })
          if (item[`${relation}Id`]) {
            const relatedEntity = entityMap[relation];
            if (relatedEntity) {
              resolved[relation] = await relatedEntity.findById(item[`${relation}Id`]);
            }
          }
        } else if (typeof config === 'object') {
          // Complex relation with options
          const relatedEntity = entityMap[relation];
          if (relatedEntity) {
            if (config.where) {
              // Has-many relation
              resolved[relation] = await relatedEntity.findMany(config);
            } else {
              // Belongs-to relation
              if (item[`${relation}Id`]) {
                resolved[relation] = await relatedEntity.findById(item[`${relation}Id`]);
              }
            }
          }
        }
      }

      return resolved;
    }
  };
}

// Create all entities
// Support Rooms entities
export const SupportGroup = createEntity('SupportGroup');
export const SupportRoom = createEntity('SupportRoom');
export const SupportRoomMember = createEntity('SupportRoomMember');
export const SupportRoomMessage = createEntity('SupportRoomMessage');
export const ModerationAction = createEntity('ModerationAction');

// Other app entities
export const MoodEntry = createEntity('MoodEntry');
export const JournalEntry = createEntity('JournalEntry');
export const MeditationSession = createEntity('MeditationSession');
export const DreamEntry = createEntity('DreamEntry');
export const Dream = createEntity('Dream'); // Alias for DreamEntry
export const VoiceMoodLog = createEntity('VoiceMoodLog');

// Community entities
export const Circle = createEntity('Circle');
export const CircleMember = createEntity('CircleMember');
export const CircleMessage = createEntity('CircleMessage');
export const CommunityGroup = createEntity('CommunityGroup');
export const CommunityPost = createEntity('CommunityPost');
export const PostLike = createEntity('PostLike');
export const ContentViolationReport = createEntity('ContentViolationReport');
export const CommunityEvent = createEntity('CommunityEvent');
export const CommunityChallenge = createEntity('CommunityChallenge');
export const ChallengeParticipation = createEntity('ChallengeParticipation');
export const EventRegistration = createEntity('EventRegistration');
export const UserGroup = createEntity('UserGroup');
export const GroupMembership = createEntity('GroupMembership');

// World Map & Sacred Space entities
export const WorldMapPin = createEntity('WorldMapPin');
export const SacredSpaceEntry = createEntity('SacredSpaceEntry');
export const SacredSpaceSession = createEntity('SacredSpaceSession');
export const InnerSanctumEntry = createEntity('InnerSanctumEntry');

// Unspoken Connections
export const CustomCard = createEntity('CustomCard');

// Reels
export const Reel = createEntity('Reel');

// Gratitude & Discover
export const GratitudePost = createEntity('GratitudePost');

// Safety & Moderation
export const SafetyAlert = createEntity('SafetyAlert');
export const CrisisDetectionLog = createEntity('CrisisDetectionLog');
export const FlaggedContent = createEntity('FlaggedContent');

// User entity with special handling for auth
export const User = {
  async me() {
    const userData = localStorage.getItem('aurawell_current_user');
    return userData ? JSON.parse(userData) : null;
  },

  async findById(id) {
    const users = JSON.parse(localStorage.getItem('aurawell_users') || '[]');
    const user = users.find(u => u.id === id);

    // If not found in users array, check if it's the current user
    if (!user) {
      const currentUser = await this.me();
      if (currentUser && currentUser.id === id) {
        // Add current user to users array if not already there
        users.push(currentUser);
        localStorage.setItem('aurawell_users', JSON.stringify(users));
        return currentUser;
      }
    }

    return user || null;
  },

  async update(id, data) {
    // Update in users list
    const users = JSON.parse(localStorage.getItem('aurawell_users') || '[]');
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    users[index] = { ...users[index], ...data };
    localStorage.setItem('aurawell_users', JSON.stringify(users));

    // If it's the current user, update current user too
    const currentUser = await this.me();
    if (currentUser && currentUser.id === id) {
      localStorage.setItem('aurawell_current_user', JSON.stringify(users[index]));
    }

    return users[index];
  }
};

// Entity map for resolving includes
const entityMap = {
  user: User,
  supportGroup: SupportGroup,
  room: SupportRoom,
  moderator: User,
  members: SupportRoomMember
};