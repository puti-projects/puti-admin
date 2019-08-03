<template>
  <div class="logo">
    <span v-if="isCollapse" class="logo_title is-bold " key="0" :class="{'is-text':!type,'is-img':type}">
      <template v-if="type">
        <img :src="website.logo" width="40" height="40" />
      </template>
      <template v-else>
        {{website.logo}}
      </template>
    </span>

    <template v-if="!isCollapse">
      <span class="logo_title is-bold" key="1">{{website.title}}</span>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'logo',
  data() {
    return {}
  },
  props: ['isCollapse'],
  created() {},
  computed: {
    ...mapGetters([
      'website'
    ]),
    type: function(val) {
      // 是否图片
      return this.website.logo.indexOf('static') !== -1
    }
  },
  methods: {}
}
</script>

<style scoped="scoped" lang="scss">
.logo {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  line-height: 50px;
  background: -webkit-gradient(linear,0 0,0 100%,from(#182445),to(#1F2E54));
  background: -moz-linear-gradient((#182445, #1F2E54));
  background: -o-linear-gradient((#182445, #1F2E54));
  background: linear-gradient(#182445, #1F2E54);
  color: #F2F3F4;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  overflow: hidden;
  box-sizing: border-box;
}
.logo_title {
  color: #F2F3F4;
  font-size: 22px;
  &.is-bold {
    font-weight: 700;
  }
}
.is-text {
  position: absolute;
  top: 0;
}
.is-img {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>