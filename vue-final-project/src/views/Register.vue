<template class="container">
    <div class="container-fluid">

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Sign up with email and password
</button>
        <p><button @click="signInWithGoogle">Sign in with Google</button></p>
    </div>

    <!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <h1>Create an Account</h1>
        <p><input type="text" placeholder="Email" v-model="email" /></p>
        <p><input type="password" placeholder="Password" v-model="password" /></p>
        <p><input type="text" placeholder="First name" v-model="firstName" /></p>
        <p><input type="text" placeholder="Last name" v-model="lastName" /></p>
        <p><input type="text" placeholder="Address" v-model="address" /></p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
        <button type="button" class="btn btn-primary" @click="register" data-bs-dismiss="modal">Submit</button>
      </div>
    </div>
  </div>
</div>
  
</template>

<script setup>
    import { ref } from "vue";
    import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
    import { useRouter } from "vue-router";
    import axios, { Axios } from "axios";

    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const address = ref("");
    const firstName = ref("");
    const lastName = ref("");


   

     const register = () => {
        createUserWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
            console.log("Succesfully registered!");
            console.log(data.user.uid);
            const uid = data.user.uid;
            const userEmail = data.user.email;

            const formData = {
                id: uid, 
                first_name: firstName.value,
                last_name: lastName.value,
                address: address.value,
                email: userEmail
                };

         axios.post('http://localhost:4000/create-user', formData)

            router.push('/items');
              })
        .catch((error) => {
            console.log(error.code);
            alert(error.message);
        })
    };

</script>