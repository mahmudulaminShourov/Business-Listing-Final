// client/src/lib/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function api(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  // If body is present and not string, stringify it
  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMessage = 'API request failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const listingAPI = {
  getListings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api(`/listings?${query}`);
  },

  getListing: (id) => api(`/listings/${id}`),

  createListing: (data) =>
    api('/listings', {
      method: 'POST',
      body: data,
    }),

  updateListing: (id, data) =>
    api(`/listings/${id}`, {
      method: 'PUT',
      body: data,
    }),

  deleteListing: (id) =>
    api(`/listings/${id}`, {
      method: 'DELETE',
    }),

  getMyListings: () => api('/listings/my-listings'),

  reportListing: (listingId, reason) =>
    api(`/listings/${listingId}/report`, {
      method: 'POST',
      body: { reason },
    }),
};

export const userAPI = {
  toggleBookmark: (listingId) =>
    api(`/users/bookmarks/${listingId}`, { method: 'POST' }),

  getBookmarks: () =>
    api('/users/bookmarks'),

  toggleWishlist: (listingId) =>
    api(`/users/wishlist/${listingId}`, { method: 'POST' }),

  getWishlist: () =>
    api(`/users/wishlist`),

  // Add more user related methods if needed
};

export const cartAPI = {
  addToCart: (item) =>
    api('/cart', { method: 'POST', body: item }),

  getCart: () =>
    api('/cart'),

  // Add more cart related methods if needed
};

export const orderAPI = {
  createOrder: (orderData) =>
    api('/orders', {
      method: 'POST',
      body: orderData,
    }),

  getMyOrders: () => api('/orders/my-orders'),

  getOrder: (id) => api(`/orders/${id}`),
};

export const authAPI = {
  login: (credentials) => api('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => api('/auth/register', { method: 'POST', body: userData }),
  checkAuth: () => api('/auth/me'),
};

export const metaAPI = {
  getCategories: () => api('/meta/categories'),
  getLocations: () => api('/meta/locations'),
};

export const chatAPI = {
  chat: (data) => api('/chat', { method: 'POST', body: data }),
  getHistory: (sessionId) => api(`/chat/history/${sessionId}`),
};

export const marketplaceAPI = {
  getByCategory: (category, params) => {
    const query = new URLSearchParams(params).toString();
    return api(`/marketplace/${category}?${query}`);
  },
  incrementView: (id) => api(`/marketplace/${id}/view`, { method: 'POST' }),
};
