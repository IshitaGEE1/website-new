<template>
  <button type="button" class="u-scroll-top-button" @click="scrollToTop">
    <icon-caret class="u-scroll-top-button__icon" direction="up" />
  </button>
</template>

<script>
import IconCaret from './IconCaret.vue';

export default {
  name: 'ScrollTopButton',
  components: { IconCaret },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth'});
    }
  }
}
</script>

<style scoped lang="scss">
.u-scroll-top-button {
  transition: background-color .35s;

  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: unset;
  border-radius: 50%;
  background-color: var(--pink);
  box-shadow: 0 4px 9px -4px #dc4c64;
  color: #fff;
  font-size: 1.25rem;
  line-height: 1.05em;
  letter-spacing: .0175em;
  font-family: "Good Headline Pro", sans-serif;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background-color: var(--pink-lighten);
  }
}
</style>
