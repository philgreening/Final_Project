<template>
    <div class="container p-4">
        <h1 class="text-center"> Transactions</h1>
        <table class="table p-4">
            <thead>
                <tr>
                    <th scope="col">Item Name</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Transaction status</th>
                    <th scope="col">Loan date</th>
                    <th scope="col">Due date</th>
                    <th scope="col">Date returned</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transaction in transactions" :key="transaction.transaction_id">
                    <td>{{ transaction.item_name }}</td>
                    <td>{{ transaction.user_id }}</td>
                    <td>{{ transaction.transaction_status }}</td>
                    <td>{{ formatDate(transaction.loan_date) }}</td>
                    <td>{{ formatDate(transaction.due_date) }}</td>
                    <td>{{ formatDate(transaction.returned_date) }}</td>
                </tr>

            </tbody>
        </table>
    </div>

</template>

<script >

import { onMounted, reactive, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import axios from 'axios';

const userStore = useUserStore();

export default {
    data() {
        return {
            transactions: []
        }
    },
    mounted() {
        this.getAllTransactions();
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
        formatDate(timestamp) {
            if (timestamp) {
                let date = new Date(timestamp._seconds * 1000)
                date = date.toDateString();
                return date;
            } else {
                return '';
            }
        }
    }
};
</script>