<!-- Page that displays communities -->

<template>
    <main>
      <section class="communities-page">
        <header>
          <div class="left">
            <h2>
              Communities
            </h2>
          </div>
        </header>
        <section v-if="$store.state.username">
            <CreateCommunityForm />
            <h2>
              Join or Leave
            </h2>
            <section
                v-if="$store.state.communities.length"
                >
                <CommunityComponent
                    v-for="community in $store.state.myCommunities"
                    :key="community._id"
                    :community="community"
                    :inCommunity="true"
                />
                <CommunityComponent
                    v-for="community in $store.state.otherCommunities"
                    :key="community._id"
                    :community="community"
                    :inCommunity="false"
                />
            </section>
            <article
            v-else
            >
            <h3>No communities found.</h3>
            </article>
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
            // communities: [],
            // myCommunities: [],
            // otherCommunities: [],
        };
    },
    async mounted() {
        await this.getCommunities();
    },
    methods: {
        async getCommunities() {
            await this.$store.commit('refreshCommunities');
            // const url = '/api/communities';
            // const res = await fetch(url).then(async r => r.json());
            // this.communities = res;
            // for (const community of this.communities) {
            //     if (this.$store.state.username && community.members.includes(this.$store.state.username)) {
            //         this.myCommunities.push(community);
            //     } else {
            //         this.otherCommunities.push(community);
            //     }
            // }
            // this.communities = this.myCommunities.concat(this.otherCommunities);
            this.loading = false;
        }
    },
  };
  </script>
  
  <style scoped>
  section {
    display: flex;
    flex-direction: column;
  }

  .communities-page {
    min-height: 100vh;
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
  