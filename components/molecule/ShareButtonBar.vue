<template>
  <ul class="u-share-button-bar">
    <li>
      <share-button-facebook></share-button-facebook>
    </li>
    <li>
      <share-button-twitter></share-button-twitter>
    </li>
    <li>
      <share-button-linkedin></share-button-linkedin>
    </li>
    <li>
      <share-button-mail></share-button-mail>
    </li>
  </ul>
</template>

<script>
import ShareButtonMail from '../atom/ShareButtonMail';
import ShareButtonLinkedin from '../atom/ShareButtonLinkedin';
import ShareButtonTwitter from '../atom/ShareButtonTwitter';
import ShareButtonFacebook from '../atom/ShareButtonFacebook';
export default {
  name: 'ShareButtonBar',
  components: { ShareButtonFacebook, ShareButtonTwitter, ShareButtonLinkedin, ShareButtonMail }
}
</script>

<style scoped lang="scss">
.u-share-button-bar {
  display: flex;
  flex-flow: row nowrap;
  list-style: none;
  margin: unset;
  padding: unset;

  & > * {
    &:not(:first-child) {
      margin-left: .6rem;
    }
  }
}
</style>
