<template>
  <div ref="portal">
    <slot />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: "PortalComponent",
  data() {
    return {
      // portal: null,
    };
  },
  mounted() {
    this.$refs.portal && document.body.appendChild(this.$refs.portal);
  },
});
</script>

