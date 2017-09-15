<template>
  <div if="app">
    <v-app>
      <transition mode="out-in">
        <router-view></router-view>
      </transition>
    </v-app>
  </div>
</template>

<script>
export default {
}
</script>
