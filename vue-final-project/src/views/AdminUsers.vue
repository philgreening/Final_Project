<template>
    <div class="container p-4">
        <h1 class="text-center"> Users</h1>
        <table class="table p-4">
            <thead>
                <tr>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Address</th>
                    <th scope="col">Admin</th>
                    <th scope="col">Delete user</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user">
                    <td>{{ user.first_name }}</td>
                    <td>{{ user.last_name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.address }}</td>
                    <td>
                        <div class="form-check form-switch">
                            <input v-if="user.admin === true" class="form-check-input" @click="updateAdmin(user)"
                                type="checkbox" id="flexSwitchCheckDefault" checked>
                            <input v-else class="form-check-input" @click="updateAdmin(user)" type="checkbox"
                                id="flexSwitchCheckDefault">
                        </div>
                    </td>
                    <td>
                        <button type="button" @click="getIndex(user)" class="btn btn-danger" data-bs-toggle="modal"
                            data-bs-target="#deleteUserModal">Delete
                            User</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


    <!-- delete user modal -->
    <div class="modal fade" id="deleteUserModal" tabindex="-1" aria-labelledby="deleteUserModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteUserModel">Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h1>Do you wish to delete {{user.first_name + " " + user.last_name}}? </h1>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                    <button type="button" class="btn btn-primary" @click="deleteUser()" data-bs-dismiss="modal">Yes
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

import { useUserStore } from '../stores/userStore';
import axios from 'axios';

const userStore = useUserStore();

export default {
    data() {
        return {
            users: [],
            user: []
        }
    },
    mounted() {
        this.getAllUsers();
    },
    methods: {
        getIndex(user) {
            this.user = user;
            console.log(this.user);
        },
        async getAllUsers() {
            console.log('token get all: ', userStore.authToken)
            await axios.get('http://localhost:4000/User/all', {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log(response.data)
                    this.users = response.data;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        async updateAdmin(user) {
            // reset alert messages
            console.log("user: ", user)

            this.user = user
            console.log("this user: ", this.user)
  
            // Conditions for setting admin status
            if (this.user.admin === false) {
                this.user.admin = true
            } else {
                this.user.admin = false
            }
            console.log("this user: ", this.user)
            const data = {
                admin: this.user.admin,

            }

            await axios.patch('http://localhost:4000/update-user/' + this.user.user_id, data, {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("res response upadte user: ", response.data)
                    this.getAllUsers();
                })
                .catch(error => {
                    console.log(error);
                })
        },
    
    async deleteUser() {

        await axios.delete('http://localhost:4000/delete-user/' + this.user.user_id, {
            headers: {
                Authorization: `Bearer ${userStore.authToken}`
            }
        })
            .then(response => {
                console.log("res response: ", response.data);
                this.getAllUsers();
            })
            .catch(error => {
                console.log(error);
            })
    },
}
}

</script>
