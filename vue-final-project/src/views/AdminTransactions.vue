<template>
    <div class="container p-4 mt-3 shadow-lg">
        <h1 class="text-center"> Transactions</h1>
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
                <tr >
                    <th scope="col">Item Name</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Transaction status</th>
                    <th scope="col">Loan date</th>
                    <th scope="col">Due date</th>
                    <th scope="col">Date returned</th>
                    <th class="text-center" scope="col">Return item?</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transaction in filteredTransactions" :key="transaction.transaction_id">
                    <td>{{ transaction.item_name }}</td>
                    <template v-for="user in users" :key="user.user_id">
                        <td v-if="user.user_id === transaction.user_id">{{ user.first_name + ` ` + user.last_name }}
                        </td>
                    </template>
                    <td :key="transaction.transaction_status">{{ transaction.transaction_status }}
                    </td> 
                    <td>{{ formatDate(transaction.loan_date) }}</td>
                    <template v-if="transaction.due_date._seconds < date && transaction.transaction_status === 'On Loan'">
                    <td>  {{ formatDate(transaction.due_date) }} <span class="badge rounded-pill bg-danger">Overdue</span></td>
                    </template>
                    <td v-else>{{ formatDate(transaction.due_date) }} </td>
                    <td>{{ formatDate(transaction.returned_date) }}</td>
                    <td class="text-center">
                        <template v-if="transaction.transaction_status === 'On Loan'">
                            <font-awesome-icon icon="fa-solid fa-check" size="xl"
                            type="button" @click="getIndex(transaction)" class="text-dark tick"
                                data-bs-toggle="modal" data-bs-target="#exampleModal"/>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Return item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h1>Confirm item returned? </h1>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-primary" @click="returnItem()" data-bs-dismiss="modal">Yes
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
            transactions: [],
            users: [],
            items: [],
            returnedItem: [],
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
        async getAllItems() {
            console.log('token get all: ', userStore.authToken)
            await axios.get('http://localhost:4000/item/all', {
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

        getIndex(transaction) {
            this.returnedItem = transaction;
            console.log(this.returnedItem);
        },
        async returnItem() {
            console.log("returned: " + this.returnedItem.item_id);

            const data = {

                transaction_status: 'Returned'
 
            };

            await axios.patch('http://localhost:4000/update-transaction/' + this.returnedItem.transaction_id, data, {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("res response: ", response.data);
                    this.updateItemStatus();
                })
                .catch(error => {
                    console.log(error);
                })
        },
        async updateItemStatus() {
            console.log(this.returnedItem.item_id);
            const data = {
                status: 'Available'
            }

            await axios.patch('http://localhost:4000/update-item/' + this.returnedItem.item_id, data, {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("res response upadte item: ", response.data);
                    this.getAllTransactions();
                })
                .catch(error => {
                    console.log(error);
                })
        },

    }
};
</script>

<style scoped>
    .tick:hover{
        color: red !important;
    }
</style>