<!-- Page that displays communities -->

<template>
    <main>
      <section v-if="$store.state.username">
        <header>
          <h2>Welcome @{{ $store.state.username }}</h2>
        </header>
        <CreateFreetForm />
      </section>
      <section v-else>
        <header>
          <h2>Welcome to Fritter!</h2>
        </header>
        <article>
          <h3>
            <router-link to="/login">
              Sign in
            </router-link>
            to create, edit, and delete freets.
          </h3>
        </article>
      </section>
      <section>
        <header>
          <div class="left">
            <h2>
              Communities
            </h2>
          </div>
        </header>
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
  import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
  import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
  
  export default {
    name: 'CommunitiesPage',
    components: {CommunityComponent},
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
            console.log(this.communities);
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
  