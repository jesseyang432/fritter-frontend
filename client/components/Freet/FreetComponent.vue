<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
    v-bind:id="this.freet._id"
  >
    <section v-if="loading">
      <header>
        <h2>Loading...</h2>
      </header>
    </section>
    <section v-else>
      <header>
        <div class="author-info">
          <h3 class="author">
            @{{ freet.author }}
          </h3>
          <p v-if="this.$store.state.community" class="author-reputation">
            Reputation: {{ reputation }}
          </p>
        </div>
        <div
          v-if="$store.state.username === freet.author"
          class="actions"
        >
          <button
            v-if="editing"
            @click="submitEdit"
          >
            ✅ Save changes
          </button>
          <button
            v-if="editing"
            @click="stopEditing"
          >
            🚫 Discard changes
          </button>
          <button
            v-if="!editing"
            @click="startEditing"
          >
            ✏️ Edit
          </button>
          <button @click="deleteFreet">
            🗑️ Delete
          </button>
        </div>
      </header>
      <p v-if="safety" class="safety">
        <em>• {{ safety }} •</em>
      </p>
      <p
        v-if="this.parent" class="replying-to"
      >
        — Replying to 
        <em>
          <a v-bind:href="'#' + this.parent._id">
            "{{ this.parent.content.length > 30 ? this.parent.content.slice(0, 30) + "..." : this.parent.content }}"
          </a>
        </em>
      </p>
      <textarea
        v-if="editing"
        class="content"
        :value="draft"
        @input="draft = $event.target.value"
      />
      <p
        v-else
        class="content"
      >
        {{ freet.content }}
      </p>

      <section class="footer">
        <p class="info">
          Posted at {{ freet.dateModified }}
          <i v-if="freet.edited">(edited)</i>
        </p>

        <section class="reacts">
          <UpvoteForm :freetId="freet._id" :upvoted="upvoted" :numUpvotes="numUpvotes" v-on:upvote="upvote()"/>
          <DownvoteForm :freetId="freet._id" :downvoted="downvoted" :numDownvotes="numDownvotes" v-on:downvote="downvote()"/>
          <button v-if="replying" @click="toggleReply()"><b>Reply</b></button>
          <button v-else @click="toggleReply()">Reply</button>
        </section>
      </section>


      <section v-if="replying">
        <ReplyFreetForm :community="this.$store.state.community" :parentId="freet._id"/>
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
    </section>
  </article>
</template>

<script>
import ReplyFreetForm from '@/components/Freet/ReplyFreetForm.vue';
import UpvoteForm from '@/components/Upvote/UpvoteForm.vue';
import DownvoteForm from '@/components/Downvote/DownvoteForm.vue';

export default {
  name: 'FreetComponent',
  components: {ReplyFreetForm, UpvoteForm, DownvoteForm},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      loading: true,
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      parent: null, // Parent of the freet
      replying: false, // Whether user is replying to this freet
      numUpvotes: null, // Number of upvotes on post
      numDownvotes: null, // Number of downvotes on post
      upvoted: false, // Whether user upvoted the post
      downvoted: false, // Whether user downvoted the post
      reputation: null, // Reputation of poster in current community
      safety: null, // The safety level of the post
    };
  },
  async mounted() {
    await Promise.all([this.getParent(), this.getUpvotes(), this.getDownvotes(), this.getReputation(), this.getSafety()]);
    // await this.getParent();
    // await this.getUpvotes();
    // await this.getDownvotes();
    // await this.getReputation();
    this.loading = false;
  },
  methods: {
    toggleReply() {
      this.replying = !this.replying;
    },
    upvote() {
      if (this.downvoted) {
        this.numDownvotes -= 1;
        this.downvoted = false;
      }
      if (!this.upvoted) {
        this.numUpvotes += 1;
        this.upvoted = true;
      }
    },
    downvote() {
      if (this.upvoted) {
        this.numUpvotes -= 1;
        this.upvoted = false;
      }
      if (!this.downvoted) {
        this.numDownvotes += 1;
        this.downvoted = true;
      }
    },
    async getParent() {
      if (this.freet.parent) {
        const url = `/api/freets/${this.freet.parent}`;
        const res = await fetch(url).then(async r => r.json());
        this.parent = res;
      }
    },
    async getUpvotes() {
      const url = `/api/upvotes/${this.freet._id}`;
      const upvotes = await fetch(url).then(async r => r.json());
      this.numUpvotes = upvotes.length
      this.upvoted = this.$store.state.username && upvotes.some((upvote) => upvote.upvoter == this.$store.state.username);
    },
    async getDownvotes() {
      const url = `/api/downvotes/${this.freet._id}`;
      const downvotes = await fetch(url).then(async r => r.json());
      this.numDownvotes = downvotes.length
      this.downvoted = this.$store.state.username && downvotes.some((downvote) => downvote.downvoter == this.$store.state.username);
    },
    async getReputation() {
      if (this.$store.state.community && this.$store.state.username) {
        const url = `api/reputation/?community=${this.$store.state.community}&username=${this.$store.state.username}`;
        const reputation = await fetch(url).then(async r => r.json());
        this.reputation = reputation.reputation;
      }
    },
    async getSafety() {
      const url = `api/safety/${this.freet._id}`;
      const safety = await fetch(url).then(async r => r.json());
      if (safety.safety == 'SFW') {
        this.safety = 'SFW';
      } else if (safety.safety == 'NSFW') {
        this.safety = 'NSFW';
      }
      // else {
      //   this.safety = 'N/A';
      // }
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    border-radius: 8px;
    margin: 8px;
    padding: 20px;
    position: relative;
}

header {
  display: flex;
  flex-wrap: row nowrap;
  justify-content: space-between;
  align-items: flex-start;
}

/* .author-info {
  align-self: flex-start;
} */

.author-info > * {
  margin: 0px;
}

.author-reputation {
  font-size: small;
  font-style: italic;
  margin: 4px 0px;
}

.actions > button {
  margin: 0px 2px;
}

.safety {
  font-size: medium;
}

.replying-to {
  font-size: smaller;
  font-style: italic;
}

.footer {
  display: flex;
  flex-wrap: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.footer > .info {
  font-size: small;
  font-style: italic;
}
.reacts {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.reacts > button {
  align-self: center;
  border-radius: 4px;
  padding: 4px 8px;
  margin: 4px;
}
</style>
