<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFreetForm',
  mixins: [BlockForm],
  props: {
    community: {
      type: String,
      default: ''
    },
    parentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      url: '/api/freets',
      method: 'POST',
      hasBody: true,
      isFreet: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'safetyLevel', label: 'Safety Level (SFW, NSFW)', value: 'None'},
        {id: 'parentId', label: 'Parent ID', value: ''},
      ],
      title: 'Create a freet',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
