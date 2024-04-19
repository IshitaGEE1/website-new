<template>
  <div :class="[ 'u-base-modal-dialog', `u-base-modal-dialog--${type}` ]" @click="closeModal">
    <button type="button" class="u-base-modal-dialog__close-button">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
           class="u-base-modal-dialog__button-icon">
        <path
          d="M16.4166 3.58334C16.0832 3.25001 15.5832 3.25001 15.2499 3.58334L9.99992 8.83334L4.74992 3.58334C4.41658 3.25001 3.91659 3.25001 3.58325 3.58334C3.24992 3.91668 3.24992 4.41668 3.58325 4.75001L8.83325 10L3.58325 15.25C3.24992 15.5833 3.24992 16.0833 3.58325 16.4167C3.74992 16.5833 3.91658 16.6667 4.16658 16.6667C4.41658 16.6667 4.58325 16.5833 4.74992 16.4167L9.99992 11.1667L15.2499 16.4167C15.4166 16.5833 15.6666 16.6667 15.8332 16.6667C15.9999 16.6667 16.2499 16.5833 16.4166 16.4167C16.7499 16.0833 16.7499 15.5833 16.4166 15.25L11.1666 10L16.4166 4.75001C16.7499 4.41668 16.7499 3.91668 16.4166 3.58334Z"
          fill="#353332"/>
      </svg>
    </button>

    <div class="u-base-modal-dialog__content" :style="{ 'max-width': maxWidth }">
      <slot>
        <base-headline tag="h3">FILL IN YOUR CONTENT</base-headline>
      </slot>
    </div>
  </div>
</template>

<script>
import BaseHeadline from './BaseHeadline';

export default {
  name: 'BaseModalDialog',
  components: { BaseHeadline },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    maxWidth: {
      type: String,
      default: undefined
    }
  },
  methods: {
    closeModal(event) {
      if (event.target.matches('.u-base-modal-dialog') || !!event.target.closest('.u-base-modal-dialog__close-button')) {
        this.$emit('close');
      }
    }
  },
  mounted() {
    document.body.classList.add('u-force-overflow-hidden');
  },
  destroyed() {
    document.body.classList.remove('u-force-overflow-hidden');
  }
}
</script>

<style scoped lang="scss">
@import "assets/css/mixins";

.u-base-modal-dialog {
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  transition: opacity 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  &__close-button {
    background: no-repeat center url(assets/icons/ico_close.svg);
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    transform: translate(-50%, +50%);
    box-shadow: unset;
    border: unset;
    width: 1.5625rem;
    height: 1.5625rem;
    padding: 0;
  }

  &__button-icon {
    * {
      stroke: $color-productsup-cta--red;
      fill: $color-productsup-cta--red;
    }
  }

  .u-hubspot-form {
    padding: 2rem 0;
  }
}

/* STYLE: wrapped */
.u-base-modal-dialog--wrapped {
  .u-base-modal-dialog__content {
    width: calc(100vw - 3.75rem);;
    padding: 1.25rem 1.875rem 1.875rem;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.33);
    overflow: auto;
    max-height: calc(100vh - 5rem);
  }
}
</style>
