<script>
import EventPage from '../../events/_slug/index';

export default {
  extends: EventPage,
  name: 'WebinarPage',
  nuxtI18n: {
    paths: {
      en: '/webinars/:slug/',
      de: '/webinare/:slug/',
      fr: '/webinaires/:slug/',
      it: '/webinar/:slug/',
      es: '/webinars/:slug/'
    }
  },
}
</script>
