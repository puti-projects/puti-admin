import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import common from './modules/common'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    common,
    permission,
    tagsView
  },
  getters
})

export default store
