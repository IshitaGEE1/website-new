<template>
  <button
    type="button"
    class="u-burger-button"
    @click="toggleActive"
    :aria-label="active ? $t('controls.close') : $t('controls.open')"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="u-burger-button__icon"
      v-if="!active"
    >
      <path d="M0.833252 10H19.1666" stroke="#353332" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square"/>
      <path d="M0.833252 4.16666H19.1666" stroke="#353332" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square"/>
      <path d="M0.833252 15.8333H19.1666" stroke="#353332" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square"/>
    </svg>

    <svg
      width="22px"
      height="22px"
      viewBox="0 0 22 22"
      xmlns="http://www.w3.org/2000/svg"
      class="u-burger-button__icon"
      v-else
    >
      <title>Icons/ico_close</title>
      <g id="Icons/ico_close" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Group-4" transform="translate(2.514719, 2.514719)" fill="#353332">
          <rect id="Rectangle" transform="translate(8.485281, 8.485281) rotate(45.000000) translate(-8.485281, -8.485281) " x="-2.51471863" y="7.48528137" width="22" height="2" rx="1"></rect>
          <rect id="Rectangle" transform="translate(8.485281, 8.485281) rotate(-45.000000) translate(-8.485281, -8.485281) " x="-2.51471863" y="7.48528137" width="22" height="2" rx="1"></rect>
        </g>
      </g>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'BurgerButton',
  data() {
    return {
      active: false
    }
  },
  watch: {
    active(value) {
      this.$emit('change', value);
    }
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
    }
  }
}
</script>

<style scoped lang="scss">
.u-burger-button {
  background: transparent;
  border: unset;
  padding: unset;

  &__icon {
    display: block;
    width: 1.125rem;
    height: 1.125rem;
  }

  &:hover {
    .u-burger-button__icon {
      * {
        stroke: var(--hover-color);
        fill: var(--hover-color);
      }
    }
  }
}
</style>
