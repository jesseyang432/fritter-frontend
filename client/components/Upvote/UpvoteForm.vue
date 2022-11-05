<!-- Form for creating freets (block style) -->

<template>
    <section>
        <button @click="submit" :disabled="upvoted">
            ⬆️
        </button>
        {{numUpvotes}}
    </section>
</template>

<script>
// import ButtonForm from '@/components/common/ButtonForm.vue';

export default {
  name: 'UpvoteForm',
  props: {
    upvoted: {
        type: Boolean,
        required: true,
    },
    freetId: {
      type: String,
      required: true,
    },
    numUpvotes: {
        type: Number,
        required: true,
    }
  },
  data() {
    return {
      url: `/api/upvotes/${this.freetId}`,
      method: 'POST',
      hasBody: false,
      title: 'Upvote',
      //numUpvotes: 0,
      callback: () => {
        this.$emit('upvote');
      }
    };
  },
  methods: {
      async submit() {
        /**
          * Submits a form with the specified options from data().
          */
        const options = {
          method: this.method,
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin' // Sends express-session credentials with request
        };
        if (this.hasBody) {
          const optionsEntries = this.fields.map(field => {
              const {id, value} = field;
              field.value = '';
              return [id, value];
            });
          options.body = JSON.stringify(Object.fromEntries(optionsEntries));
        }
  
        try {
          const r = await fetch(this.url, options);
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            const res = await r.json();
            throw new Error(res.error);
          }

          if (this.callback) {
            if (this.asyncCallback) {
              await this.callback();
            } else {
              this.callback();
            }
          }
        } catch (e) {
        }
      }
    }

};
</script>

<style scoped>
section {
    margin: 8px;
}

button {
  border: none;
  background: none;
  font-size: large;
}

button:hover {
    cursor: pointer;
}
</style>