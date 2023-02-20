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
                    <th scope="col">Transactions</th>
                    <th scope="col">Reservations</th>
                    <th scope="col">Current Loans</th>
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
                        <button type="button" @click="getIndex(user); getAllTransactions();" class="btn btn-danger"
                            data-bs-toggle="modal" data-bs-target="#userTransactionsModal">Transactions
                        </button>
                    </td>
                    <td>
                        <button type="button" @click="getIndex(user); getAllReservations();" class="btn btn-danger"
                            data-bs-toggle="modal" data-bs-target="#userResModal">Resrvations
                        </button>
                    </td>
                    <td>
                        <button type="button" @click="getIndex(user); getAllTransactions();" class="btn btn-danger"
                            data-bs-toggle="modal" data-bs-target="#userLoansModal">Current Loans
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


    <!-- delete user modal -->
    <!-- <div class="modal fade" id="deleteUserModal" tabindex="-1" aria-labelledby="deleteUserModalLabel"
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
                        <button type="button" class="btn btn-primary">Save changes</button>
                        <button type="button" class="btn btn-primary" @click="removeUser()" data-bs-dismiss="modal">Yes
                        </button>
                    </div>
                </div>
            </div>
        </div> -->

    <!-- User transactions modal -->
    <div class="modal fade" id="userTransactionsModal" tabindex="-1" aria-labelledby="userTransactionsModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userTransactionsModal">{{ user.first_name + " " + user.last_name }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="container p-4">
                        <h1 class="text-center"> Transactions <br> </h1>
                        <table class="table p-4">
                            <thead>
                                <tr>
                                    <th scope="col">Item Name</th>
                                    <th scope="col">User Name</th>
                                    <th scope="col">Transaction status</th>
                                    <th scope="col">Loan date</th>
                                    <th scope="col">Due date</th>
                                    <th scope="col">Date returned</th>
                                    <th scope="col">Return item?</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="transaction in transactions" :key="transaction.transaction_id">
                                    <template v-if="transaction.user_id == user.user_id">
                                        <td>{{ transaction.item_name }}</td>
                                        <template v-for="user in users" :key="user.user_id">
                                            <td v-if="user.user_id === transaction.user_id">{{ user.first_name + ` ` +
                                                user.last_name }}
                                            </td>
                                        </template>
                                        <td :key="transaction.transaction_status">{{ transaction.transaction_status }}
                                            <!-- <template v-if="transaction.transaction_status === 'On Loan'">
                                <button type="button" @click="getIndex(transaction)" class="btn btn-danger"
                                    data-bs-toggle="modal" data-bs-target="#exampleModal">Return</button>
                            </template> -->
                                        </td>
                                        <td>{{ formatDate(transaction.loan_date) }}</td>
                                        <td>{{ formatDate(transaction.due_date) }}</td>
                                        <td>{{ formatDate(transaction.returned_date) }}</td>
                                        <td>
                                            <template v-if="transaction.transaction_status === 'On Loan'">
                                                <button type="button" @click="getIndex(transaction)" class="btn btn-danger"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#userTransactionsModal">Return</button>
                                            </template>
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- User reservations modal -->
    <div class="modal fade" id="userResModal" tabindex="-1" aria-labelledby="userResModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userResModal">{{ user.first_name + " " + user.last_name }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container p-4">
                        <h1 class="text-center"> Reservations</h1>
                        <table class="table p-4">
                            <thead>
                                <tr>
                                    <th scope="col">Item Name</th>
                                    <th scope="col">User Name</th>
                                    <th scope="col">Reservation Date</th>
                                    <th scope="col">Confirm Loan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="reservation in reservations" :key="reservation.res_id">
                                    <template v-if="reservation.user_id == user.user_id">
                                        <td>{{ reservation.item_name }}</td>
                                        <template v-for="user in users" :key="user.user_id">
                                            <td v-if="user.user_id === reservation.user_id">{{ user.first_name + ` ` +
                                                user.last_name }}</td>
                                        </template>
                                        <td>{{ formatDate(reservation.res_date) }}</td>
                                        <td>
                                            <button type="button" @click="getResIndex(reservation)" class="btn btn-success"
                                                data-bs-toggle="modal" data-bs-target="#confirmLoanModal">Loan Item</button>
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

<!-- User current loans -->
    <div class="modal fade" id="userLoansModal" tabindex="-1" aria-labelledby="userLoansModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userLoansModal">{{ user.first_name + " " + user.last_name }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div class="container p-4">
                        <h1 class="text-center"> Current Loans <br> </h1>
                        <table class="table p-4">
                            <thead>
                                <tr>
                                    <th scope="col">Item Name</th>
                                    <th scope="col">User Name</th>
                                    <th scope="col">Transaction status</th>
                                    <th scope="col">Loan date</th>
                                    <th scope="col">Due date</th>
                                    <!-- <th scope="col">Date returned</th>
                                    <th scope="col">Return item?</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="transaction in transactions" :key="transaction.transaction_id">
                                    <template v-if="transaction.user_id == user.user_id && transaction.transaction_status == 'On Loan'">
                                        <td>{{ transaction.item_name }}</td>
                                        <template v-for="user in users" :key="user.user_id">
                                            <td v-if="user.user_id === transaction.user_id">{{ user.first_name + ` ` +
                                                user.last_name }}
                                            </td>
                                        </template>
                                        <td :key="transaction.transaction_status">{{ transaction.transaction_status }}
                                            <!-- <template v-if="transaction.transaction_status === 'On Loan'">
                                <button type="button" @click="getIndex(transaction)" class="btn btn-danger"
                                    data-bs-toggle="modal" data-bs-target="#exampleModal">Return</button>
                            </template> -->
                                        </td>
                                        <td>{{ formatDate(transaction.loan_date) }}</td>
                                        <td>{{ formatDate(transaction.due_date) }}</td>
                                        <!-- <td>{{ formatDate(transaction.returned_date) }}</td>
                                        <td>
                                            <template v-if="transaction.transaction_status === 'On Loan'">
                                                <button type="button" @click="getIndex(transaction)" class="btn btn-danger"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#userLoansModal">Return</button>
                                            </template>
                                        </td> -->
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

import { useUserStore } from '../stores/userStore';
import axios from 'axios';
import { getAuth, deleteUser } from '@firebase/auth';


const userStore = useUserStore();

export default {
    data() {
        return {
            users: [],
            user: [],
            transactions: [],
            reservations: []
        }
    },
    mounted() {
        this.getAllUsers();
    },
    methods: {
        getIndex(user) {
            this.user = user;
            console.log("called:", this.user);
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
        async getAllTransactions() {
            await axios.get('http://localhost:4000/Transaction/all', {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("res response: ", response.data)
                    this.transactions = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
        },
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
        formatDate(timestamp) {
            if (timestamp) {
                let date = new Date(timestamp._seconds * 1000)
                date = date.toDateString();
                return date;
            } else {
                return '';
            }
        },







        // async removeUser() {
        //     const uuid = this.user.user_id

        //     this.deleteAuthUser();

        //     await axios.delete('http://localhost:4000/delete-user/' + this.user.user_id, {
        //         headers: {
        //             Authorization: `Bearer ${userStore.authToken}`
        //         }
        //     })
        //         .then(response => {
        //             console.log("res response: ", response.data);
        //             this.getAllUsers();
        //         })
        //         .catch(error => {
        //             console.log(error);
        //         })
        // },
        // deleteAuthUser() {
        //     deleteUser(this.user.user_id)
        //         .then(() => {
        //             console.log('Deleted Auth user');
        //         })
        //         .catch((error) => {
        //             console.log('Error deleting Auth user: ', error)
        //         })
        // }
    }
}

</script>
