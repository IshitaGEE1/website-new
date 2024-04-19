<template>
  <div :class="['u-hubspot-form', 'theme-light', {'cut-off-shape': cutOffShape}]">
    <base-headline tag="h3" class="u-hubspot-form__headline" :text="`[[${headline}]]`" v-if="headline"></base-headline>

    <p class="u-hubspot-form__sub-headline" v-if="subHeadline">{{ subHeadline }}</p>

    <div class="u-hubspot-form__form" v-if="formId" ref="form"/>

    <contentful-page-link
      class="u-hubspot-form__privacy-link"
      :url="privacyPolicyLink"
      :label="privacyPolicyText"
      v-if="privacyPolicyText"
    />
  </div>
</template>

<script>
import ContentfulElementMixin from '../../assets/js/mixins/ContentfulElementMixin';
import InternalLinkService from '../../assets/js/services/internalLink.service';
import ContentfulPageLink from '../_contentful/ContentfulPageLink';
import BaseHeadline from '../_base/BaseHeadline';
import ContentTypes from '../../assets/js/enums/ContentTypes';

export default {
  name: 'HubspotForm',
  components: { BaseHeadline, ContentfulPageLink },
  mixins: [ContentfulElementMixin],
  props: {
    cutOffShape: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    headline() {
      return this.fields?.headline;
    },
    subHeadline() {
      return this.fields?.subHeadline;
    },
    privacyPolicyText() {
      return this.fields?.privacyPolicyText;
    },
    privacyPolicyLink() {
      const privacyPolicyLinkFields = this.fields?.privacyPolicyLink?.fields;

      if (!privacyPolicyLinkFields?.urlSubfolder || !privacyPolicyLinkFields?.slug) {
        return undefined;
      }
      return `${privacyPolicyLinkFields.urlSubfolder}${privacyPolicyLinkFields.slug}`;
    },
    formId() {
      return this.fields?.formId;
    },
    redirectTo() {
      if (!(this.fields?.redirectTo?.sys)) {
        return undefined;
      }
      let url = '#';
      let redirectTo = this.fields.redirectTo;
      let contentType = redirectTo?.sys?.contentType?.sys?.id;

      if (Object.values(ContentTypes.pages).includes(contentType)) {
        url = `${redirectTo.fields.urlSubfolder}${redirectTo.fields.slug}`;
      } else if (ContentTypes.elements.link === contentType) {
        url = redirectTo.fields.url;
      }
      return InternalLinkService.processLink(this.localePath({ path: url }));
    }
  },
  mounted() {
    let id = `form_${this.formId}_${this._uid}`;
    this.$refs.form.id = id;

    //create hubspot form
    hbspt.forms.create({
      region: 'na1',
      portalId: '3976985',
      formId: this.formId,
      //fill into element with specified id
      target: `#${id}`,
      redirectUrl: this.redirectTo
    })
  }
};
</script>

<style lang="scss" scoped>
.u-hubspot-form {
  width: 100%;
  padding: 2rem;
  background-color: #fff;

  &__headline {
    font-size: 48px;
    line-height: 54px;
    margin-bottom: 1.375rem;
  }

  &__privacy-link {
    font-size: .9rem;
    text-decoration: none;
    margin-top: .9375rem;
    display: block;
  }


}
</style>

<style lang="scss">
div.u-hubspot-form__form {
  fieldset.form-columns-2 {
    /* prevent two column layout */
    .hs-form-field {
      float: none;
      width: 100%;
    }
  }

  ul.inputs-list.multi-container {
    padding-left: 1rem;
  }

  li[class="hs-form-radio"] {
    list-style: none;
  }

  ul.inputs-list.multi-container input[type="radio"] {
    margin-right: 0.5rem;
  }
}

div.u-hubspot-form__form fieldset.form-columns-1,
div.u-hubspot-form__form fieldset.form-columns-2 {
  max-width: 100%;

  /* prevent side margin */
  .input {
    margin-right: 0;
  }

  /* overwrite size of hubspot selects */
  input[type=color].hs-input,
  input[type=date].hs-input,
  input[type=datetimeocal].hs-input,
  input[type=email].hs-input,
  input[type=file].hs-input,
  input[type=month].hs-input,
  input[type=number].hs-input,
  input[type=password].hs-input,
  input[type=search].hs-input,
  input[type=tel].hs-input,
  input[type=text].hs-input,
  input[type=time].hs-input,
  input[type=url].hs-input,
  input[type=week].hs-input,
  select.hs-input,
  textarea.hs-input {
    width: 100% !important;
  }
}

.u-hubspot-form__form {

  .hs-fieldtype-booleancheckbox {
    .inputs-list {
      list-style: none;
      padding-left: unset;
    }
  }

  .hs-form-booleancheckbox-display {
    display: grid;
    grid-template-columns: auto auto;
    align-items: flex-start;
    gap: 0.5rem;
  }

  /* BUTTONS */
  input[type=button],
  input[type=submit] {
    @extend %button;
  }

  .hs_submit.hs-submit {
    text-align: end;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }

  /* spacing between fields */
  .hs-form-field {
    margin-bottom: 1.125rem;
  }

  .hs-error-msgs {
    list-style: none;
    margin-top: 7.5px;
    margin-bottom: unset;
    padding: unset;
  }

  /* ERRORS */
  .hs-error-msgs label {
    font-family: "Nunito", sans-serif;
    font-size: 1rem;
    font-weight: lighter;
    line-height: 1.5;
    color: var(--error);
  }

  .hs_error_rollup {
    margin-bottom: 1.25rem;
  }



  form {

    label {
      color: #030303;
      font-family: "Good Headline Pro";
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0;
      line-height: 1.5;
    }

    label + * {
      margin-top: 5px;
    }
  }

  input[type=text],
  input[type=number],
  input[type=email],
  input[type=tel],
  select,
  textarea {
    background-color: #F1F5F9;
    border: unset;
    padding: 0.8125rem 1rem;
    color: #121D33;
    font-family: "Nunito", sans-serif;
    font-size: 1.25rem;
    letter-spacing: 0;
    line-height: 1.5;

    &:focus,
    &:active {
      outline: unset;
      box-shadow: inset 0 -2px 0 0 #121D33;
    }
  }

  input[type=checkbox],
  input[type=radio] {
    appearance: none;
    font-size: 1.5rem;
    height: 1em !important;
    width: 1em !important;
    line-height: 1;
    border: 1px solid #94A3B8;

    &:focus,
    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0 169 255 / 0.35);
    }
  }

  input[type=checkbox] {
    border-radius: 2px;

    &:checked {
      background-origin: border-box;
      background-image: url("/images/Checkbox.svg");
      border-color: var(--blue);
    }
  }

  input[type=radio] {
    border-radius: 100%;

    &:checked {
      border: 6px solid var(--blue);
    }
  }
}

.u-form ul {
  list-style: none;
  font-weight: normal;
  font-size: 0.9688rem;
  line-height: 1.875rem;
  letter-spacing: 0;
  padding: 0;
  margin: 0;
  display: block;
}

.u-form input[type=submit] {
  cursor: pointer;
  background-color: #03a8d3;
  box-shadow: 0.25rem 0.25rem 0.625rem 0 rgba(0, 0, 0, .25);
  color: #fff;
  border: unset;
  border-radius: 1.3em;
  padding: .3em 1.5em;
  text-align: center;
  font-weight: normal;
  font-size: 0.9688rem;
  line-height: 1.875rem;
  letter-spacing: 0;
}

.u-form .actions {
  text-align: center;
}
</style>
