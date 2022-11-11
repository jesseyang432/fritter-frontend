import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    community: '', // Name of the community currently being viewed
    communities: [], // All communities
    myCommunities: [], // All communities user is in (empty if not logged in)
    otherCommunities: [], // All communities user is not in
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateCommunity(state, community) {
      /**
       * Update the current community ('' if none)
       * @param community - Name of community
       */
      state.community = community;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.community ? `api/freets/community/${state.community}` : (state.filter ? `/api/users/${state.filter}/freets` : '/api/freets');
      const r = await fetch(url);
      const res = await r.json();
      // const res = await fetch(url).then(async r => r.json());
      if (!state.community) {
        state.freets = res.filter((freet) => !freet.community);
      } else {
        state.freets = res;
      }
    },
    async refreshCommunities(state) {
      /**
       * Request the server for communities and group into user's and other
       */
       const url = '/api/communities';
       const res = await fetch(url).then(async r => r.json());
       state.communities = res;
       state.myCommunities = [];
       state.otherCommunities = [];
       for (const community of state.communities) {
           if (state.username && community.members.includes(state.username)) {
               state.myCommunities.push(community);
           } else {
               state.otherCommunities.push(community);
           }
       }
       state.communities = state.myCommunities.concat(state.otherCommunities);
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
