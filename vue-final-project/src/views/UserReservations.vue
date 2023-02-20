<template>
    <div class="container p-4">
        <h1 class="text-center">My Reservations</h1>
        <table class="table p-4">
            <thead>
                <tr>
                    <th scope="col">Item Name</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Reservation Date</th>
                    <th scope="col">Cancel Reservation?</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="reservation in reservations" :key="reservation.res_id">
                    <template v-if="reservation.user_id === currentUserId">
                    <td >{{ reservation.item_name }}</td>
                    <template v-for="user in users" :key="user.user_id">
                        <td v-if="user.user_id === reservation.user_id">{{ user.first_name + ` ` + user.last_name }}</td>
                    </template>
                    <td>{{ formatDate(reservation.res_date) }}</td>
                    <td>
                        <button type="button" @click="getResIndex(reservation)" class="btn btn-warning"
                                data-bs-toggle="modal" data-bs-target="#cancelResModal">Cancel Reservation</button>
                    </td>
                </template>

                </tr>

            </tbody>
        </table>
    </div>
    <!-- Cancel Reservation Modal -->
    <div class="modal fade" id="cancelResModal" tabindex="-1" aria-labelledby="cancelResModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="cancelResModalLabel">{{ reservedItem.item_name }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h1>Cancel Reservation? </h1>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                    <button type="button" class="btn btn-primary" @click="deleteResevation()" data-bs-dismiss="modal">Yes
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

import { onMounted, reactive, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import axios from 'axios';
import AdminTransactions from './AdminTransactions.vue';

const userStore = useUserStore();

export default {
    data() {
        return {
            reservations: [],
            reservedItem: [],
            users: [],
            currentUserId: userStore.user.id
        }
    },
    mounted() {
        this.getAllReservations();
        this.getAllUsers();
    },
    methods: {
        async getAllReservations() {
            await axios.get('http://localhost:4000/Reservation/all', {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("res response: ", response.data)
                    this.reservations = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
        },
        async getAllUsers() {
            await axios.get('http://localhost:4000/User/all', {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("res response: ", response.data)
                    this.users = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
        },
        formatDate(timestamp) {
            if (timestamp) {
                let date = new Date(timestamp._seconds * 1000)
                date = date.toDateString();
                return date;
            } else {
                return '';
            }
        },
        getResIndex(reservation) {
            this.reservedItem = reservation;
            console.log(this.reservedItem);
        },

        async deleteResevation() {

            await axios.delete('http://localhost:4000/delete-reservation/' + this.reservedItem.res_id, {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("Reservation Deleted: ", response.data);
                    this.updateItemStatus();
                })
                .catch(error => {
                    console.log(error);
                })
        },
        async updateItemStatus() {
            console.log(this.reservedItem.item_id);
            const data = {
                status: 'Available'
            }

            await axios.patch('http://localhost:4000/update-item/' + this.reservedItem.item_id, data, {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("res response update item: ", response.data);
                    this.getAllReservations();
                })
                .catch(error => {
                    console.log(error);
                })
        },
    },
 
};
</script>