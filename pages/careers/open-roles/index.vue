<template>
  <base-page class="u-career-page" v-bind="{ header, footer }">
    <div class="u-content-type u-content-type--module u-career-page__content">
      <base-headline class="u-career-page__title" tag="h1">Productsup - All our open roles</base-headline>

      <div class="u-career-page__filters">
        <select v-model="selectedDepartment">
          <option :value="null">All Departments</option>
          <option
            v-for="filter in departmentFilters"
            :key="`filter_department_${filter.id}`"
            :value="filter.id"
          >
            {{ filter.name }}
          </option>
        </select>

        <select v-model="selectedOffice">
          <option :value="null">All Offices</option>
          <option
            v-for="filter in officeFilters"
            :key="`filter_office_${filter.id}`"
            :value="filter.id"
          >
            {{ filter.name }}
          </option>
        </select>
      </div>

      <template v-for="department in processedJobList">
        <base-headline class="u-career-page__department" tag="h3" :key="`department_${department.id}`">
          {{ department.name }}
        </base-headline>

        <ul class="u-career-page__jobs">
          <li v-for="job in department.jobs" :key="`${department.id}_${job.id}`" class="u-career-page__job">
            <base-link class="u-career-page__job-title" :url="parseUrl(job)" :external="false">
              {{ job.title }}
            </base-link>
            <div class="u-career-page__job-location">{{ parseLocation(job.location.name) }}</div>
          </li>
        </ul>
      </template>

      <template v-if="processedJobList.length === 0">
        <base-headline class="u-career-page__department" tag="h3">
          Sorry, no results.
        </base-headline>
      </template>
    </div>
  </base-page>
</template>

<script>
import { GreenhouseAdapter } from '../../../plugins/greenhouse';
import BasePage from '../../../components/_base/BasePage';
import BaseHeadline from '../../../components/_base/BaseHeadline';
import BaseLink from '../../../components/_base/BaseLink';
import BaseSurline from '../../../components/_base/BaseSurline';
import { fetchPageFooter, fetchPageHeader } from '../../../assets/js/mixins/FetchPageDataMixin';
import internalLinkService from '../../../assets/js/services/internalLink.service';

export default {
  name: 'JobOverview',
  components: { BaseSurline, BaseLink, BaseHeadline, BasePage },
  head() {
    return {
      title: `Open roles at Productsup`,
      meta: [
        { name: 'title', content: 'Open roles at Productsup' },
        {
          name: 'description',
          content: 'See all of Productsup\'s open roles, find you next job and apply to join the place where people are empowered to shape the future of commerce.'
        },
        { name: 'robots', content: 'index,follow' },
        { name: 'og:title', content: 'Open roles at Productsup' },
        { name: 'og:type', content: 'website' },
        {
          property: 'og:url',
          content: process.env.HOSTNAME + this.$route.path
        },
        {
          name: 'og:description',
          content: 'See all of Productsup\'s open roles, find you next job and apply to join the place where people are empowered to shape the future of commerce.'
        },
        {
          name: 'og:image',
          content: 'https://images.ctfassets.net/q17uls4wkkdz/2fHhW3yCd4dtDa54l9NgO3/d4e05ab74467780311fb6e920f3f0c80/careers-open-graph-1200-630.png'
        }
      ],
      link: [
        this.canonicalLink
      ]
    }
  },
  data() {
    return {
      selectedDepartment: null,
      selectedOffice: null
    }
  },
  async asyncData(ctx) {
    return {
      departments: await GreenhouseAdapter.getDepartments().then(r => r.filter(i => i.jobs.length > 0)),
      offices: await GreenhouseAdapter.getOffices().then(r => r.filter(i => i.departments.find(j => j.jobs.length > 0))),
      header: await fetchPageHeader('7Hun6EdA6wPh1PmNKcKKiM', ctx.i18n.locale),
      footer: await fetchPageFooter('5IC4dzMXHs0jwxRSJR82Mi', ctx.i18n.locale)
    }
  },
  computed: {
    canonicalLink() {
      return {
        rel: 'canonical',
        href: process.env.HOSTNAME + this.$route.path
      };
    },
    processedJobList() {
      let jobList = Array.from(this.departments);

      if (this.selectedDepartment) {
        jobList = jobList.filter(i => i.id === this.selectedDepartment);
      }

      if (this.selectedOffice) {
        const jobsByOffice = this.offices.find(i => i.id === this.selectedOffice).departments.flatMap(i => i.jobs).map(i => i.id);
        jobList = jobList.map(d => ({
          ...d,
          jobs: d.jobs.filter(j => jobsByOffice.includes(j.id))
        }))
      }
      return jobList.filter(d => d.jobs.length > 0);
    },
    departmentFilters() {
      return this.departments.map(i => ({
        id: i.id,
        name: i.name
      }));
    },
    officeFilters() {
      return this.offices.map(i => ({
        id: i.id,
        name: i.name,
        location: i.location
      }));
    }
  },
  methods: {
    parseLocation(location) {
      const result = location.split(',').map(i => i.trim());
      return Array.from([result[0], result[2]]).join(', ');
    },
    parseUrl(job) {
      const normalizedName = job.title.replace('(m/f/d)', '').replaceAll(/[^0-9a-zA-Z\-\s]/g, '').trim().toLowerCase().split(' ').join('-');
      return internalLinkService.processLink(`${normalizedName}-${job.id}`);
    }
  }
}
</script>

<style scoped lang="scss">
.u-career-page {

  &__content {
  }

  &__filters {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;

    @include tablet-above {
      flex-flow: initial;
    }
  }

  &__department {
    margin-top: 3.75rem;
  }

  &__jobs {
    list-style: none;
    padding: unset;
  }

  &__job {
    border-bottom: 1px solid rgb(230 230 230);
    padding-top: 1rem;
    padding-bottom: 1rem;

    @include desktop {
      display: flex;
      gap: 2rem;
    }
  }

  &__job-title {
    display: block;
    text-decoration: unset;

    @include desktop {
      min-width: calc(100% / 12 * 8);
      max-width: calc(100% / 12 * 8);
    }
  }
}
</style>
