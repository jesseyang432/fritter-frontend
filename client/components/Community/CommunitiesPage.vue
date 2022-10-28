<!-- Page that displays communities -->

<template>
    <main>
      <section>
        <header>
          <div class="left">
            <h2>
              Communities
            </h2>
          </div>
        </header>
        <section v-if="$store.state.username">
            <header>
            <h3>Welcome @{{ $store.state.username }}</h3>
            </header>
            <CreateCommunityForm />
        </section>
        <section v-else>
            <article>
            <h3>
                <router-link to="/login">
                Sign in
                </router-link>
                to create, join, leave, and view communities.
            </h3>
            </article>
        </section>
        <section
          v-if="communities.length"
        >
          <CommunityComponent
            v-for="community in communities"
            :key="community._id"
            :community="community"
          />
        </section>
        <article
          v-else
        >
          <h3>No communities found.</h3>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  import CommunityComponent from '@/components/Community/CommunityComponent.vue';
  import CreateCommunityForm from '@/components/Community/CreateCommunityForm.vue';
  
  export default {
    name: 'CommunitiesPage',
    components: {CommunityComponent, CreateCommunityForm},
    data() {
        return {
            loading: true,
            communities: [],
        };
    },
    async mounted() {
        await this.getCommunities();
    },
    methods: {
        async getCommunities() {
            const url = '/api/communities';
            const res = await fetch(url).then(async r => r.json());
            this.communities = res;
            const myCommunities = [];
            const otherCommunities = [];
            for (const community of this.communities) {
                if (this.$store.state.username && community.members.includes(this.$store.state.username)) {
                    myCommunities.push(community);
                } else {
                    otherCommunities.push(community);
                }
            }
            this.communities = myCommunities.concat(otherCommunities);
            this.loading = false;
        }
    },
    // components: {FreetComponent, GetFreetsForm, CreateFreetForm},
    // mounted() {
    //   this.$refs.getFreetsForm.submit();
    // }
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
  