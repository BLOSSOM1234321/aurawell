// AuraWell Custom API Client
// Replaces Base44 SDK completely

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class APIClient {
  constructor() {
    this.baseURL = `${API_URL}/api`;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Get authentication token
  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ============================================
  // AUTHENTICATION
  // ============================================

  async signup(userData) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    this.setToken(null);
    return { success: true };
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // ============================================
  // SUPPORT GROUPS
  // ============================================

  async getSupportGroups() {
    return this.request('/support-groups');
  }

  async getSupportGroup(id) {
    return this.request(`/support-groups/${id}`);
  }

  async getSupportGroupStats(id) {
    return this.request(`/support-groups/${id}/stats`);
  }

  // ============================================
  // SUPPORT ROOMS
  // ============================================

  async joinRoom(supportGroupId, stage) {
    return this.request('/support-rooms/join', {
      method: 'POST',
      body: JSON.stringify({ supportGroupId, stage }),
    });
  }

  async leaveRoom(roomId) {
    return this.request(`/support-rooms/${roomId}/leave`, {
      method: 'POST',
    });
  }

  async getMyRooms() {
    return this.request('/support-rooms/my-rooms');
  }

  async getRoomMembers(roomId) {
    return this.request(`/support-rooms/${roomId}/members`);
  }

  // ============================================
  // MESSAGES
  // ============================================

  async getMessages(roomId, limit = 50, offset = 0) {
    return this.request(`/messages/${roomId}?limit=${limit}&offset=${offset}`);
  }

  async sendMessage(roomId, content) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ roomId, content }),
    });
  }

  // ============================================
  // MOOD TRACKING
  // ============================================

  async getMoods(limit = 30, offset = 0) {
    return this.request(`/moods?limit=${limit}&offset=${offset}`);
  }

  async createMood(moodData) {
    return this.request('/moods', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  }

  // ============================================
  // JOURNALS
  // ============================================

  async getJournals() {
    return this.request('/journals');
  }

  async createJournal(journalData) {
    return this.request('/journals', {
      method: 'POST',
      body: JSON.stringify(journalData),
    });
  }

  async updateJournal(id, journalData) {
    return this.request(`/journals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(journalData),
    });
  }

  async deleteJournal(id) {
    return this.request(`/journals/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // MEDITATIONS
  // ============================================

  async getMeditations(category = null) {
    const url = category ? `/meditations?category=${category}` : '/meditations';
    return this.request(url);
  }

  // ============================================
  // REELS
  // ============================================

  async getReels(limit = 20, offset = 0) {
    return this.request(`/reels?limit=${limit}&offset=${offset}`);
  }

  async createReel(reelData) {
    return this.request('/reels', {
      method: 'POST',
      body: JSON.stringify(reelData),
    });
  }

  // ============================================
  // USER PROFILE
  // ============================================

  async getUserProfile(id) {
    return this.request(`/users/profile/${id}`);
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
}

// Create singleton instance
const api = new APIClient();

export default api;
