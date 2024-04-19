<template>
  <div class="u-base-carousel splide">
    <div class="u-base-carousel__track splide__track">
      <ul class="splide__list">
        <slot></slot>
      </ul>
    </div>

    <ul class="u-base-carousel__pagination splide__pagination"></ul>
  </div>
</template>

<script>
import { Splide } from '@splidejs/splide';
import { Intersection } from '@splidejs/splide-extension-intersection';
import { EventInterface } from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';
import '@splidejs/splide/dist/css/splide-core.min.css';

export default {
  name: 'BaseCarousel',
  props: {
    options: Object,
    autoplay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaults: {
        type: 'loop',
        autoplay: 'pause',
        interval: '7500',
        arrows: false,
        perPage: 1,
        gap: '2rem',
      }
    }
  },
  computed: {
    procssedOptions() {
      let optionsToInject = this.options;

      if(this.autoplay) {
        optionsToInject = {
          ...this.options,
          intersection: {
            inView: {
              autoplay: true,
            },
            outView: {
              autoplay: false,
            },
          },
        }
      }
      return Object.assign(this.defaults, optionsToInject);
    }
  },
  mounted() {
    new Splide(this.$el, this.procssedOptions).mount({ Intersection }, this.transition);
  },
  methods: {
    transition(Splide, Components) {
      const { bind } = EventInterface(Splide);
      const { Move } = Components;
      const { list } = Components.Elements;

      let endCallback;

      function mount() {
        bind(list, 'transitionend', e => {
          if (e.target === list && endCallback) {
            // Removes the transition property
            cancel();

            // Calls the `done` callback
            endCallback();
          }
        });
      }

      function start(index, done) {
        // Converts the index to the position
        const destination = Move.toPosition(index, true);

        // Applies the CSS transition
        list.style.transition = 'transform 800ms cubic-bezier(.44,.65,.07,1.01)';

        // Moves the carousel to the destination.
        Move.translate(destination);

        // Keeps the callback to invoke later.
        endCallback = done;
      }

      function cancel() {
        list.style.transition = '';
      }

      return {
        mount,
        start,
        cancel
      };
    }
  }
}
</script>

<style scoped lang="scss">
.u-base-carousel {
  position: relative;

  &__pagination {
    position: relative;
    margin-top: 45px;
  }

  ::v-deep .splide__pagination li:not(:first-child) {
    margin-left: 24px;
  }

  ::v-deep .splide__pagination__page {
    transform: unset;

    &.is-active {
      background: var(--blue);
    }

    &:hover {
      background: #343d46;
    }
  }
}
</style>
