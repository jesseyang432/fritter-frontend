<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="community"
  >
    <header>
      <h3 class="name">
        <router-link :to="`community/${community.name}`">
        {{ community.name }}
        </router-link>
      </h3>
    </header>
    <section class="info">
      <p class="creator">
        Created by @{{ community.creator }}
      </p>
      <p class="members">
        Number of Members: {{ community.members.length }}
      </p>
    </section>
    <section v-if="inCommunity">
      <LeaveCommunityForm :communityId="community._id" />
    </section>
    <section v-else>
      <JoinCommunityForm :communityId="community._id" />
    </section>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
import JoinCommunityForm from '@/components/Community/JoinCommunityForm.vue';
import LeaveCommunityForm from '@/components/Community/LeaveCommunityForm.vue';

export default {
  name: 'CommunityComponent',
  components: {JoinCommunityForm, LeaveCommunityForm},
  props: {
    // Data from the stored community
    community: {
      type: Object,
      required: true
    },
    // Whether the user is in the community
    inCommunity: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during community modification
    };
  },
  methods: {
  }
};
</script>

<style scoped>
.community {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
