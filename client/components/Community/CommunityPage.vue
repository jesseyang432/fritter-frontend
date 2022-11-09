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
        <section>
          <header>
            <div class="left">
              <h2>
                Community: {{ $route.params.name }}
              </h2>
            </div>
          </header>
          <CreateFreetForm :community="$route.params.name"/>
        </section>
        <section
          v-if="$store.state.freets.length"
        >
          <FreetComponent
            v-for="freet in $store.state.freets"
            :key="freet._id"
            :freet="freet"
          />
        </section>
      </section>
    </main>
  </template>
  
  <script>
  import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
  import FreetComponent from '@/components/Freet/FreetComponent.vue';
  
  export default {
    name: 'CommunityPage',
    components: {CreateFreetForm, FreetComponent},
    data() {
        return {
            loading: true,
            community: null,
            hasAccess: false,
            freets: [],
        };
    },
    beforeMount() {
      this.$store.commit('updateCommunity', this.$route.params.name);
      console.log(this.$store.state.community);
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
            this.$store.commit('updateFreets', res);
        }
    },
  };
  </script>
  
  <style scoped>

  main {
    min-height: 100vh;
  }

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
  