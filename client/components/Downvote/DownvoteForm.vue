<!-- Form for creating freets (block style) -->

<template>
  <section>
      <button @click="submit" :disabled="downvoted">
          Downvote
      </button>
      {{numDownvotes}}
  </section>
</template>

<script>
// import ButtonForm from '@/components/common/ButtonForm.vue';

export default {
name: 'DownvoteForm',
props: {
  downvoted: {
      type: Boolean,
      required: true,
  },
  freetId: {
    type: String,
    required: true,
  },
  numDownvotes: {
      type: Number,
      required: true,
  }
},
data() {
  return {
    url: `/api/downvotes/${this.freetId}`,
    method: 'POST',
    hasBody: false,
    title: 'Downvote',
    //numUpvotes: 0,
    callback: () => {
      this.$emit('downvote');
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

</style>