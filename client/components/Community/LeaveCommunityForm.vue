<!-- Form for creating freets (block style) -->

<script>
import ButtonForm from '@/components/common/ButtonForm.vue';

export default {
  name: 'LeaveCommunityForm',
  mixins: [ButtonForm],
  props: {
    communityId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      url: `/api/communities/leave/${this.communityId}`,
      method: 'PUT',
      hasBody: false,
      title: 'Leave',
      callback: () => {
        const message = 'Successfully left!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
        this.$store.commit('refreshCommunities');
      }
    };
  }
};
</script>
