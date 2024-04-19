<template>
  <base-link :url="url" class="u-login-button" :external="true">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"
         class="u-login-button__icon">
      <path
        d="M9.0029 8.77292C11.5419 8.77292 13.6001 6.80904 13.6001 4.38646C13.6001 1.96389 11.5419 0 9.0029 0C6.46392 0 4.40567 1.96389 4.40567 4.38646C4.40567 6.80904 6.46392 8.77292 9.0029 8.77292Z"
        fill="#1D1D1B"/>
      <path
        d="M18 18V16.0006C18 13.8849 16.2006 12.168 13.9832 12.168H4.01677C1.79942 12.168 0 13.8849 0 16.0006V18H18Z"
        fill="#1D1D1B"/>
    </svg>
  </base-link>
</template>

<script>
import BaseLink from '../_base/BaseLink';

export default {
  name: 'LoginButton',
  components: { BaseLink },
  props: {
    url: String
  }
}
</script>

<style scoped lang="scss">
.u-login-button {
  text-decoration: none !important;
  padding: unset;
  font-family: "Good Headline Pro", sans-serif;
  font-weight: bold;
  font-size: inherit;
  line-height: inherit;

  &__icon {
    display: block;
    width: 1.125rem;
    height: 1.125rem;
  }

  &:hover {
    .u-login-button__icon path {
      fill: var(--blue);

      @include navigation-collapse-above {
        fill: var(--hover-color);
      }
    }
  }
}
</style>
