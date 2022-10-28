<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
    <form @submit.prevent="submit">
      <button
        type="submit"
      >
        {{ title }}
      </button>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </form>
  </template>
  
  <script>
  
  export default {
    name: 'ButtonForm',
    data() {
      /**
       * Options for submitting this form.
       */
      return {
        url: '', // Url to submit form to
        method: 'GET', // Form request method
        hasBody: false, // Whether or not form request has a body
        alerts: {}, // Displays success/error messages encountered during form submission
        asyncCallback: false, // Whether or not the callback is async
        callback: null // Function to run after successful form submission
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
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  form {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 14px;
    position: relative;
  }
  
  article > div {
    display: flex;
    flex-direction: column;
  }
  
  form > article p {
    margin: 0;
  }
  
  form h3,
  form > * {
    margin: 0.3em 0;
  }
  
  form h3 {
    margin-top: 0;
  }
  
  textarea {
     font-family: inherit;
     font-size: inherit;
  }
  </style>
  