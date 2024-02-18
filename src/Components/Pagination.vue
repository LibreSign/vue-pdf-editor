<template>
  <div class="inline-flex -space-x-px text-sm">
    <button :disabled="!canPreviousPage" class="flex items-center px-3 h-8 ms-0 leading-tight bg-blue-500 border border-e-0 rounded-s-lg hover:bg-blue-700 text-white font-bold disabled:dark:bg-blue-300" @click="onPreviousPage" :class="{'cursor-not-allowed': !canPreviousPage}">Previous</button>
    <p class="flex items-center px-3 h-8 leading-tight text-white bg-blue-500 border border-gray-300 font-bold">{{ page }} Of {{ pages }}</p>
		<button :disabled="!canNextPage" class="flex items-center px-3 h-8 ms-0 leading-tight bg-blue-500 border border-e-0 rounded-r-lg hover:bg-blue-700 text-white font-bold disabled:dark:bg-blue-300" @click="onNextPage" :class="{'cursor-not-allowed': !canNextPage}">Next</button>
  </div>
</template>

<script>
  export default {
    name: 'PaginationComponent',
    data(){
      return {
        currentPage: 0,
      } 
    },
    computed: {
      page(){
        return this.currentPage + 1
      },
      canNextPage(){
        return this.currentPage + 1 <= this.pages - 1
      },
      canPreviousPage(){
        return this.currentPage > 0
      }
    },
    updated(){
      this.$emit('onPageChange',{
          page: this.currentPage
        })
    },
    props:{
      pages: {
        type: Number,
        default: 0,
        required: true,
      },
    },
    methods: {
      onPreviousPage(){
        this.currentPage--
      },
      onNextPage(){
        this.currentPage++
      },
    }
  }
</script>