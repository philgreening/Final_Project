<template>
    <div class="container p-4 mt-3 shadow-lg">
        <h1 class="text-center"> Reservations</h1>
        <div class="mb-3">
            <input type="text" class="form-control bg-light" v-model="search" placeholder="Search reservations...">
        </div>
        <table class="table p-4">
            <thead>
                <tr>
                    <th scope="col">Item Name</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Reservation Date</th>
                    <th class="text-center" scope="col">Confirm Loan</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="reservation in filteredReservations" :key="reservation.res_id">
                    <td>{{ reservation.item_name }}</td>
                    <template v-for="user in users" :key="user.user_id">
                        <td v-if="user.user_id === reservation.user_id">{{ user.first_name + ` ` + user.last_name }}</td>
                    </template>
                    <td>{{ formatDate(reservation.res_date) }}</td>
                    <td class="text-center">
                        <font-awesome-icon icon="fa-solid fa-check" size="xl" type="button"
                            @click="getResIndex(reservation)" class="text-dark tick" data-bs-toggle="modal"
                            data-bs-target="#confirmLoanModal" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- Confirm Loan Modal -->
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
                    <button type="button" class="btn btn-primary" @click="loanItem()" data-bs-dismiss="modal">Yes
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script >

import { useUserStore } from '../stores/userStore';
import axios from 'axios';

const userStore = useUserStore();

export default {
    data() {
        return {
            reservations: [],
            reservedItem: [],
            users: [],
            search: ''
        }
    },
    mounted() {
        this.getAllReservations();
        this.getAllUsers();
    },
    computed: {
        // Filters reservations by search term
        filteredReservations() {
            return this.reservations.filter(reservation => {
                return reservation.item_name.toLowerCase().includes(this.search.toLowerCase());
            });
        },
    },
    methods: {
        // Gets all reservations from server via API
        async getAllReservations() {
            await axios.get('/api/v1/reservations', {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    this.reservations = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
        },
        // Gets all users from server via API
        async getAllUsers() {
            await axios.get('/api/v1/users', {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    this.users = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
        },
        // Converts date into readable format
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
        },
        // Creates a loan transaction 
        async loanItem() {
            const data = {
                item_id: this.reservedItem.item_id,
                item_name: this.reservedItem.item_name,
                user_id: this.reservedItem.user_id,
                transaction_status: 'On Loan',
            };
            await axios.post('/api/v1/transactions', data, {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    this.updateReservedItemStatus();
                    this.deleteResevation();
                })
                .catch(error => {
                    console.log(error);
                })
        },
        //  Updates item status to on-loan 
        async updateReservedItemStatus() {
            const data = {
                status: 'On Loan'
            }

            await axios.patch('/api/v1/items/item/' + this.reservedItem.item_id, data, {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    this.getAllReservations();
                })
                .catch(error => {
                    console.log(error);
                })
        },
        //  Deletes a reservation
        async deleteResevation() {
            await axios.delete('/api/v1/reservations/reservation/' + this.reservedItem.res_id, {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                })
                .catch(error => {
                    console.log(error);
                })
        },
    },

};
</script>

<style scoped>
.tick:hover {
    color: red !important;
}
</style>