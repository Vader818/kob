<template>
  <NavBar />

  <router-view/>
</template>

<script>
import NavBar from './components/NavBar.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import $ from 'jquery'


export default {
  components:{
    NavBar
  },
  setup() {
    // You can add any setup logic here if needed
    $.ajax({
      url: 'http://localhost:3000/user/account/token/',
      method: 'POST',
      data:{
        username: 'Vader',
        password: '123456',
      },
      success(resp){
        console.log(resp);
      },
      error(resp){
        console.log(resp);
      }
    });

    // $.ajax({
    //   url: 'http://localhost:3000/user/account/info/',
    //   method: 'GET',
    //   headers: {
    //     Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiODk4ZDNhYjZlMWI0YTFkODk2OWNiOTVjZDdlMGI1OSIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTc3NTEyMTM2MCwiZXhwIjoxNzc2MzMwOTYwfQ.CA0ztDqUBAQV68herES7GRysAPYjlVOSAtSO2UY7iw4"
    //   },
    //   success(resp){
    //     console.log(resp);
    //   },
    //   error(resp){
    //     console.log(resp);
    //   }
  

    // });

    // $.ajax({
    //   url: 'http://localhost:3000/user/account/register/',
    //   method: 'POST',
    //   data:{
    //     username: 'Bitch',
    //     password: '123456',
    //     confirmedPassword: '123456',
    //   },
    //   success(resp){
    //     console.log(resp);
    //   },
    //   error(resp){
    //     console.log(resp);
    //   }
    // });


  }


}

</script>




<style>
body{
  background-image:url("@/assets/images/background.png") ;
  background-size: cover;
}
</style>
