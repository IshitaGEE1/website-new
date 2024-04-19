export const Background = {
  WHITE: 'white',
  BLUE: 'blue',
  DARK_BLUE: 'dark-blue',
  LIGHT_BLUE: 'light-blue',
  LIGHT_GREY: 'light-grey',
  BLUE_PASTEL: 'blue-pastel',
  WHITE_TO_BLUE: 'white-to-blue',
  BLUE_TO_DARK_VIBRANT_BLUE: 'blue-to-blue-vibrant-darken',
  VIBRANT_BLUE_TO_PURPLE: 'blue-vibrant-to-purple',
  DARK_BLUE_TO_DARKEST_BLUE: 'blue-dark-to-blue-darkest'
}

export const Direction = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  DIAGONAL: 'diagonal',
}

export const Position = {
  NONE: 'none',
  LEFT: 'left',
  RIGHT: 'right',
  BOTTOM: 'bottom'
}

export default {
  computed: {
    colors() {
      const background = this.fields?.designOptions?.fields?.background || Background.WHITE;

      if(!background.includes('to')) {
        return [background, background]
      }
      return background.split('-to-');
    },
    background() {
      const background = this.fields?.designOptions?.fields?.background || Background.WHITE;
      const direction = this.fields?.designOptions?.fields?.backgroundDirection || Direction.HORIZONTAL;
      return `${background}${background.includes('to') ? `-${direction}` : ''}`.trim();
    },
    diverShape() {
      const position = this.fields?.designOptions?.fields?.diverShape;
      return position === Position.NONE ? undefined : position;
    },
    spiderweb() {
      const position = this.fields?.designOptions?.fields?.spiderweb;
      return position === Position.NONE ? undefined : position;
    },
    theme() {
      const background = this.fields?.designOptions?.fields?.background || Background.WHITE;
      switch(background) {
        case Background.BLUE:
        case Background.DARK_BLUE:
        case Background.BLUE_TO_DARK_VIBRANT_BLUE:
        case Background.DARK_BLUE_TO_DARKEST_BLUE:
          return 'theme-dark';
        case Background.VIBRANT_BLUE_TO_PURPLE:
          return 'theme-colored';
        case Background.WHITE:
        case Background.LIGHT_BLUE:
        case Background.LIGHT_GREY:
        case Background.WHITE_TO_BLUE:
        case Background.BLUE_PASTEL:
        default:
          return 'theme-light';
      }
    },
    backgroundStyles() {
      return { background: `var(--${this.background}, #fff)`, '--color-left': `var(--${this.colors[0]})`, '--color-right': `var(--${this.colors[1]})` }
    },
    backgroundAttributes() {
      return {
        'data-diver-shape': this.diverShape,
        'data-spiderweb': this.spiderweb
      }
    }
  }
}
