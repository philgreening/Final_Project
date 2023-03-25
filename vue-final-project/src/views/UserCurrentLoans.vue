<template>
    <div class="container p-4 mt-3 shadow-lg">
        <h1 class="text-center"> My Current Loans</h1>
        <div class="mb-3">
            <input type="text" class="form-control bg-light" v-model="search" placeholder="Search current loans...">
        </div>
        <table class="table p-4">
            <thead>
                <tr>
                    <th scope="col">Item Name</th>
                    <th scope="col">Transaction status</th>
                    <th scope="col">Loan date</th>
                    <th scope="col">Due date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transaction in filteredTransactions" :key="transaction.transaction_id">
                    <template v-if="transaction.user_id === currentUserId && transaction.transaction_status === 'On Loan'">
                        <td>{{ transaction.item_name }}</td>
                        <td :key="transaction.transaction_status">{{ transaction.transaction_status }}
                        </td>
                        <td>{{ formatDate(transaction.loan_date) }}</td>
                        <template v-if="transaction.due_date._seconds < date">
                            <td> {{ formatDate(transaction.due_date) }} <span
                                    class="badge rounded-pill bg-danger">Overdue</span></td>
                        </template>
                        <td v-else>{{ formatDate(transaction.due_date) }} </td>
                    </template>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script >

import { useUserStore } from '../stores/userStore';
import axios from 'axios';

const userStore = useUserStore();

export default {
    data() {
        return {
            transactions: [],
            users: [],
            items: [],
            currentUserId: userStore.user.id,
            date: Math.floor(Date.now() / 1000),
            search: '',
        }
    },
    mounted() {
        this.getAllTransactions();
        this.getAllUsers();
        this.getAllItems();
    },
    computed: {
        // Search by item name
        filteredTransactions() {
            return this.transactions.filter(transaction => {
                return transaction.item_name.toLowerCase().includes(this.search.toLowerCase());
            });
        },
    },
    methods: {
        // Gets all transactions from the server via the API
        async getAllTransactions() {
            await axios.get('/api/v1/transactions', {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    this.transactions = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
        },
        // Gets all users from the server via the API
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
        // Gets all items from the server via the API
        async getAllItems() {
            await axios.get('/api/v1/items', {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log(response.data)
                    this.items = response.data;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        // Formats the timestamp to a readable format
        formatDate(timestamp) {
            if (timestamp) {
                let date = new Date(timestamp._seconds * 1000)
                date = date.toDateString();
                return date;
            } else {
                return '';
            }
        },
    }
};
</script>