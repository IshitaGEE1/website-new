<template>
  <div class="u-hubspot-button" v-if="hubspotForm">
    <base-cta v-bind="{secondary, tertiary, small}" @click="toggleModal">
      {{ label }}
    </base-cta>

    <portal to="modal">
      <base-modal-dialog type="wrapped" max-width="600px" v-if="showModal" @close="toggleModal">
        <hubspot-form v-bind="hubspotForm" :cut-off-shape="false"></hubspot-form>
      </base-modal-dialog>
    </portal>
  </div>

  <base-cta v-bind="{secondary, tertiary}" @click="scrollToHubspotForm" v-else>
    {{ label }}
  </base-cta>
</template>

<script>
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';
import BaseModalDialog from '../_base/BaseModalDialog';
import HubspotForm from '../molecule/HubspotForm';
import BaseCta, { Types } from '../_base/BaseCta';

export default {
  name: 'HubspotButton',
  mixins: [ContentfulElementMixin],
  components: { BaseCta, HubspotForm, BaseModalDialog },
  props: {
    small: Boolean
  },
  data() {
    return {
      showModal: false
    }
  },
  computed: {
    label() {
      return this.fields?.label;
    },
    hubspotForm() {
      return this.fields?.hubspotForm;
    },
    secondary() {
      return this.fields?.type === Types.SECONDARY;
    },
    tertiary() {
      return this.fields?.type === Types.TERTIARY;
    }
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
    scrollToHubspotForm() {
      const hubspotForm = document.querySelector('.u-hubspot-form');

      if (hubspotForm) {
        hubspotForm.scrollIntoView();
        return;
      }

      const hubspotButton = document.querySelector('.u-hubspot-button > button');
      if (hubspotButton) {
        hubspotButton.click();
        return;
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
