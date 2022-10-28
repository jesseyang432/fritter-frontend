<!-- Page that displays a single community -->

<template>
    <main>
      <section v-if="loading">
        <header>
          <h2>Loading...</h2>
        </header>
      </section>
      <section v-else-if="!$store.state.username || !hasAccess">
        <header>
          <h2>You don't have access to this community!</h2>
        </header>
      </section>
      <section v-else>
        <header>
          <div class="left">
            <h2>
              Community: {{ $route.params.name }}
            </h2>
          </div>
        </header>
        <section
          v-if="freets.length"
        >
          <FreetComponent
            v-for="freet in freets"
            :key="freet._id"
            :freet="freet"
          />
        </section>
      </section>
    </main>
  </template>
  
  <script>
  import CommunityComponent from '@/components/Community/CommunityComponent.vue';
  import FreetComponent from '@/components/Freet/FreetComponent.vue';
  
  export default {
    name: 'CommunityPage',
    components: {CommunityComponent, FreetComponent},
    data() {
        return {
            loading: true,
            community: null,
            hasAccess: false,
            freets: [],
        };
    },
    async mounted() {
        await this.getCommunity();
        this.loading = false;
    },
    methods: {
        async getCommunity() {
            const url = `/api/communities/${this.$route.params.name}`;
            const res = await fetch(url).then(async r => r.json());
            this.community = res;
            this.hasAccess = this.community.members?.includes(this.$store.state.username);
            if (this.hasAccess) {
              await this.getCommunityFreets();
            }
        },
        async getCommunityFreets() {
            const url = `/api/freets/community/${this.$route.params.name}`;
            const res = await fetch(url).then(async r => r.json());
            this.freets = res;
        }
    },
  };
  </script>
  
  <style scoped>
  section {
    display: flex;
    flex-direction: column;
  }
  
  header, header > * {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  
  button {
      margin-right: 10px;
  }
  
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }
  </style>
  