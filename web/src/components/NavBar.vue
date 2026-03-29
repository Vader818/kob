<template>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container">
    <router-link class="navbar-brand" to="/">KING OF NIGGER</router-link>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link :class="route_name === 'pk_index' ? 'nav-link active' : 'nav-link'" aria-current="page" to="/pk/">对战</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="route_name === 'record_index' ? 'nav-link active' : 'nav-link'" to="/record/">对局列表</router-link>
        </li>
        <li class="nav-item">
          <router-link :class="route_name === 'ranklist_index' ? 'nav-link active' : 'nav-link'" to="/ranklist/">排行榜</router-link>
        </li>
      </ul>
       <ul class="navbar-nav">
        <div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Vader
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="/user/bot/">我的Bot</a></li>
    <li><a class="dropdown-item" href="/logout/">退出</a></li>
  </ul>
</div>
      </ul>
    </div>
  </div>
</nav>


</template>



<script>

import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
    setup() {
        const route = useRoute();
        let route_name = computed(() => route.name);
        return {
         route_name
    }
  }
}

</script>





<style scoped>

</style>>


