<template lang="pug">
v-app(:dark="dark",standalone)
  v-navigation-drawer(v-model='drawer',:mini-variant.sync="mini", persistent, enable-resize-watcher, :dark="dark")
    .pa-3.text-xs-center(v-show="!mini")
      div.display-2.py-4 Educa Brasil
      p {{'Sistema de controle acadêmico'}}
    .pa-3.text-xs-center(v-show="mini")
      .display-2 A
    v-divider
    v-list(dense)
      template(v-for='item in menu')
        v-list-group(v-if='item.items', v-bind:group='item.group', :value="openMenuGroup(item)")
          v-list-tile(:to='item.href', slot='item', :title="item.title")
            v-list-tile-action
              v-icon() {{ item.icon }}
            v-list-tile-content
              v-list-tile-title {{ item.title }}
            v-list-tile-action
              v-icon() keyboard_arrow_down
          
          v-list-tile(v-for='subItem in item.items', :key='subItem.href',:to='subItem.href', v-bind:router='!subItem.target', ripple, v-bind:disabled='subItem.disabled', v-bind:target='subItem.target')
            v-list-tile-content
              v-list-tile-title {{ subItem.title }}
            v-list-tile-action(v-if='subItem.icon')
              v-icon.success--text {{ subItem.icon }}
        v-subheader(v-else-if='item.header') {{ item.header }}
        v-divider(v-else-if='item.divider')
        v-list-tile(v-else,:to='item.href', :key='item.href', router, ripple, :disabled='item.disabled', :title="item.title")
          v-list-tile-action
            v-icon() {{ item.icon }}
          v-list-tile-content
            v-list-tile-title {{ item.title }}
          v-list-tile-action(v-if='item.subAction')
            v-icon.success--text {{ item.subAction }}
  v-toolbar.darken-1(fixed,dark,:class="theme") 
    v-toolbar-side-icon(dark, @click.stop='drawer = !drawer')
    v-toolbar-title {{ pageTitle }}
  main
    v-container.pa-4(fluid)
        v-alert(v-bind='message', v-model='message.show', dismissible) {{message.body}}
        .py-2
          v-slide-y-transition(mode='out-in')
            router-view
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      dark: false,
      theme: 'primary',
      mini: false,
      drawer: true
    }
  },
  computed: {
    ...mapState(['message', 'menu', 'pageTitle'])
  },
  methods: {
    openMenuGroup (group) {
      return _.some(group.items, {href: this.$route.path})
    }
  },
  created () {
  }
}
</script>

