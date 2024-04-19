<script>
export default {
  props: {
    value: String,
    placeholder: String
  }
}
</script>

<template>
  <div class="u-base-search">
    <input class="u-base-search__input" type="text" :value="value" :placeholder="placeholder" @input="$emit('input', $event.target.value)"/>

    <svg class="u-base-search__icon" width="18" height="19" viewBox="0 0 18 19" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_36_1448)">
        <path
          d="M17.7051 16.4946L12.7537 11.419C14.8595 8.6613 14.6888 4.69809 12.2001 2.14736C10.8756 0.786619 9.09577 0.0260556 7.19695 0.000186137C5.29813 -0.0256834 3.50278 0.693489 2.14205 2.01801C-0.667381 4.755 -0.724293 9.26664 2.01787 12.0761C3.40965 13.5041 5.25673 14.2181 7.10899 14.2181C8.5732 14.2181 10.0322 13.7628 11.274 12.8625L16.2254 17.9381C16.4272 18.1451 16.6962 18.2485 16.9653 18.2485C17.2343 18.2485 17.4878 18.1502 17.6896 17.9536C18.0984 17.5552 18.1087 16.8981 17.7103 16.4894L17.7051 16.4946ZM3.49761 10.6326C2.55596 9.67021 2.04892 8.39743 2.06444 7.04704C2.07996 5.70183 2.62322 4.43939 3.58557 3.50292C4.53239 2.57679 5.7793 2.06975 7.10382 2.06975C7.12451 2.06975 7.14521 2.06975 7.17108 2.06975C8.51629 2.08527 9.77872 2.62853 10.7152 3.59087C11.6568 4.55322 12.1639 5.826 12.1484 7.17639C12.1328 8.5216 11.5896 9.78403 10.6272 10.7205C8.63529 12.6607 5.43782 12.6193 3.49761 10.6326Z"
          fill="#1D1D1B"/>
      </g>
      <defs>
        <clipPath id="clip0_36_1448">
          <rect width="18" height="18.2535" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.u-base-search {
  position: relative;

  &__input {
    width: 100%;
    border: 1px solid rgb(118 118 118);
    padding: 0.5rem 2.5rem 0.5rem 1rem;
  }

  &__icon {
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translate(0, -50%);
  }
}
</style>
