<template>
    <div class="container p-4 mt-3 shadow-lg">
        <h1 class="text-center"> Reservations</h1>
        <table class="table p-4">
            <thead >
                <tr>
                    <th scope="col">Item Name</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Reservation Date</th>
                    <th class="text-center" scope="col">Confirm Loan</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="reservation in reservations" :key="reservation.res_id">
                    <td >{{ reservation.item_name }}</td>
                    <template v-for="user in users" :key="user.user_id">
                        <td v-if="user.user_id === reservation.user_id">{{ user.first_name + ` ` + user.last_name }}</td>
                    </template>
                    <td>{{ formatDate(reservation.res_date) }}</td>
                    <td class="text-center">
                        <font-awesome-icon icon="fa-solid fa-check" size="xl"
                        type="button" @click="getResIndex(reservation)" class="text-success"
                                data-bs-toggle="modal" data-bs-target="#confirmLoanModal"/>
                    </td>

                </tr>

            </tbody>
        </table>
    </div>

    <div class="modal fade" id="confirmLoanModal" tabindex="-1" aria-labelledby="confirmLoanModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmLoanModalLabel">Confirm Loan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h1>Confirm Loan? </h1>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                    <button type="button" class="btn btn-primary" @click="loanItem()" data-bs-dismiss="modal">Yes
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script >

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
            users: []
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
        async loanItem() {
            console.log("Loaned: " + this.reservedItem.item_id);

            const data = {

                item_id: this.reservedItem.item_id,
                item_name: this.reservedItem.item_name,
                user_id: this.reservedItem.user_id,
                transaction_status: 'On Loan',
            };
            await axios.post('http://localhost:4000/create-transaction/',  data , {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("res response: ", response.data);
                    this.updateReservedItemStatus();
                    this.deleteResevation();
                })
                .catch(error => {
                    console.log(error);
                })
        },
        async updateReservedItemStatus() {
            console.log(this.reservedItem.item_id);
            const data = {
                status: 'On Loan'
            }

            await axios.patch('http://localhost:4000/update-item/' + this.reservedItem.item_id, data, {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("res response update item: ", response.data);
        
                    this.getAllReservations();
                    this.$emit('update', 1);
                })
                .catch(error => {
                    console.log(error);
                })
        },
        async deleteResevation() {
            await axios.delete('http://localhost:4000/delete-reservation/' + this.reservedItem.res_id, {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("Reservation Deleted: ", response.data);
                })
                .catch(error => {
                    console.log(error);
                })
        },
    },
 
};
</script>