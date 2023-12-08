<template>
  <Portal>
    <div class="fixed z-10 top-0 left-0 right-0 h-12">
      <slot />
    </div>
  </Portal>
</template>

<script>
import Portal from "./Portal.vue";
import { defineComponent } from 'vue';

export default defineComponent({
  name: "ToolbarComponent",
  components: { Portal },
});
</script>
