<template>
    <div class="container p-4 mt-3 shadow-lg">
        <h1 class="text-center"> My Transactions</h1>
        <div class="mb-3">
      <input type="text" class="form-control bg-light" v-model="search" placeholder="Search transactions...">
    </div>
    <div class="col-md-4">
        <label for="filter" class="form-label">Filter by transaction status</label>
        <select class="form-select bg-light" id="filter" v-model="statusFilter">
          <option value="">All</option>
          <option v-for="status in statusList" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
        <table class="table p-4">
            <thead>
                <tr>
                    <th scope="col">Item Name</th>
                    <th scope="col">Transaction status</th>
                    <th scope="col">Loan date</th>
                    <th scope="col">Due date</th>
                    <th scope="col">Date returned</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transaction in filteredTransactions" :key="transaction.transaction_id">
                    <template v-if="transaction.user_id === currentUserId ">
                    <td>{{ transaction.item_name }}</td>
                    <td :key="transaction.transaction_status">{{ transaction.transaction_status }}
                    </td> 
                    <td>{{ formatDate(transaction.loan_date) }}</td>
                    <template v-if="transaction.due_date._seconds < date && transaction.transaction_status === 'On Loan'">
                    <td>  {{ formatDate(transaction.due_date) }} <span class="badge rounded-pill bg-danger">Overdue</span></td>
                    </template>
                    <td v-else>{{ formatDate(transaction.due_date) }} </td>
                    <td>{{ formatDate(transaction.returned_date) }}</td>

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
            date: Math.floor(Date.now()/ 1000),
            search:'',
            statusFilter: "",
            statusList: ["On Loan", "Returned"]
        }
    },
    mounted() {
        this.getAllTransactions();
        this.getAllUsers();
        this.getAllItems();
    },
    computed: {
    filteredTransactions() {
      return this.transactions.filter((transaction) => {
        if (this.search && transaction.item_name.toLowerCase().indexOf(this.search.toLowerCase()) === -1) {
          return false;
        }
        if (this.statusFilter && transaction.transaction_status !== this.statusFilter) {
          return false;
        }
        return true;
      });
    }
    },
    methods: {
        async getAllTransactions() {
            await axios.get('/api/v1/transactions', {
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
        async getAllUsers() {
            await axios.get('/api/v1/users', {
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
        async getAllItems() {
            console.log('token get all: ', userStore.authToken)
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