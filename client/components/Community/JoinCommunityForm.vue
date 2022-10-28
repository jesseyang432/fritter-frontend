<!-- Form for creating freets (block style) -->

<script>
import ButtonForm from '@/components/common/ButtonForm.vue';

export default {
  name: 'JoinCommunityForm',
  mixins: [ButtonForm],
  props: {
    communityId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      url: `/api/communities/join/${this.communityId}`,
      method: 'PUT',
      hasBody: false,
      title: 'Join',
      callback: () => {
        const message = 'Successfully joined!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
