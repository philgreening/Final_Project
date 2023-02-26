<template class="container-fluid">
    <div class="container w-25 shadow-lg rounded p-4 mt-5 text-center">
        <h1 >My Details</h1>
        <!-- <button type="button"  class="btn btn-primary" @click="editDetails()" data-bs-dismiss="modal">Edit Details </button> -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">Edit Details</button>

          <div class="row g-5 ">
            <div class="col p-4 fw-semibold">
              <p class="border-bottom p-2">First name: {{ user.first_name }}</p>
              <!-- <p ">{{ user.first_name }}</p> -->
            <!-- </div> -->
            <!-- <div class="col-12"> -->
              <p class="border-bottom p-2">Last name: {{ user.last_name }}</p>
              <!-- <p ">{{ user.first_name }}</p> -->
            <!-- </div> -->
            <!-- <div class="col-12"> -->
              <p class="border-bottom p-2">Email: {{ user.email }}</p>
              <!-- <p ">{{ user.first_name }}</p> -->
            <!-- </div> -->
            <!-- <div class="col-12"> -->
              <p class="border-bottom p-2">Address: {{ user.address }}</p>
              <!-- <p ">{{ user.first_name }}</p> -->
            </div>
            

           
          </div>
        <!-- <template> -->
        <!-- </template> -->
    </div>

    <!-- Modal -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <form @submit.prevent="updateItem">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editModalLabel">{{ username }}</h5>
                        <button type="button" @click="clearAlerts()" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container">

                            <div class="text-center my-2">
                                <p class="h3">Edit Details</p>
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">First name</span>
                                </div>
                                <input type="text" class="form-control" placeholder="First name"
                                    v-model.lazy="user.first_name">
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Last name</span>
                                </div>
                                <input type="text" class="form-control" placeholder="Last name"
                                    v-model.lazy="user.last_name">
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Email</span>
                                </div>
                                <input type="text" class="form-control" placeholder="Email"
                                    v-model.lazy="user.email">
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text h-100">Address</span>
                                </div>
                                <textarea class="form-control" placeholder="Address"
                                    v-model.lazy="user.address"></textarea>
                            </div>
                            <!-- <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="profileimage">Profile Image </span>
            </div>
            <input type="file" class="form-control" @change="onFileUpload">
          </div> -->
                            <!-- display error messages -->
                            <div class="alert alert-danger mb-3" role="alert" v-if="errors.length">
                                <p class="text-center" v-for="error in errors" v-bind:key="error">{{ error }}</p>
                            </div>
                            <!-- display success message -->
                            <div class="alert alert-success mb-3" role="alert" v-if="success.length">
                                <p class="text-center">{{ success }}</p>
                            </div>
                            <!-- <button type="submit" class="btn btn-primary pull-left">Submit</button> -->
                            <!-- </div> -->
                            <!-- </div> -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="clearAlerts()" class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button>
                        <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </div>

                </div>
            </div>
        </form>
    </div>
  
</template>

<script>
import { useUserStore } from '../stores/userStore';
import axios from 'axios';

const userStore = useUserStore();

export default {
    data() {
        return {
            user: [],
            currentUserId: userStore.user.id,
            username: userStore.user.name,
            errors:[],
            success:[]
        }
    },
    mounted() {
        this.getUser();
    },
    methods: {
        async getUser() {
            await axios.get('http://localhost:4000/User/'+ this.currentUserId,  {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("res response: ", response.data)
                    this.user = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
        },
    }
};
</script>