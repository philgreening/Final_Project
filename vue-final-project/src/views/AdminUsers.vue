<template>
    <div class="container p-4 mt-3 shadow-lg">
        <h1 class="text-center">Users</h1>
        <table class="table p-4">
            <thead class="text-center">
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
                                type="checkbox" id="flexSwitchCheckDefault" checked />
                            <input v-else class="form-check-input" @click="updateAdmin(user)" type="checkbox"
                                id="flexSwitchCheckDefault" />
                        </div>
                    </td>
                    <td class="text-center">
                        <button type="button" @click="getIndex(user); getAllTransactions();" class="btn btn-primary"
                            data-bs-toggle="modal" data-bs-target="#userTransactionsModal">
                            Transactions
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" @click="getIndex(user); getAllReservations();" class="btn btn-primary"
                            data-bs-toggle="modal" data-bs-target="#userResModal">
                            Reservations
                        </button>
                    </td>
                    <td class="text-center">
                        <button type="button" @click="getIndex(user); getAllTransactions();" class=" btn btn-primary"
                            data-bs-toggle="modal" data-bs-target="#userLoansModal">
                            Current Loans
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- User transactions modal -->
    <div class="modal fade" id="userTransactionsModal" tabindex="-1" aria-labelledby="userTransactionsModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userTransactionsModal">
                        {{ user.first_name + " " + user.last_name }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container p-4">
                        <h1 class="text-center">Transactions <br /></h1>
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
                                <tr v-for="transaction in transactions" :key="transaction.transaction_id">
                                    <template v-if="transaction.user_id == user.user_id">
                                        <td>{{ transaction.item_name }}</td>
                                        <td>{{ transaction.transaction_status }}</td>
                                        <td>{{ formatDate(transaction.loan_date) }}</td>
                                        <template v-if="transaction.due_date._seconds < date &&
                                            transaction.transaction_status === 'On Loan'">
                                            <td>
                                                {{ formatDate(transaction.due_date) }}
                                                <span class="badge rounded-pill bg-danger">Overdue</span>
                                            </td>
                                        </template>
                                        <td v-else>{{ formatDate(transaction.due_date) }}</td>
                                        <td>{{ formatDate(transaction.returned_date) }}</td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- User reservations modal -->
    <div class="modal fade" id="userResModal" tabindex="-1" aria-labelledby="userResModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userResModal">
                        {{ user.first_name + " " + user.last_name }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container p-4">
                        <h1 class="text-center">Reservations</h1>
                        <table class="table p-4">
                            <thead>
                                <tr>
                                    <th scope="col">Item Name</th>
                                    <th scope="col">Reservation Date</th>
                                    <th class="text-center" scope="col">Confirm Loan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="reservation in reservations" :key="reservation.res_id">
                                    <template v-if="reservation.user_id == user.user_id">
                                        <td>{{ reservation.item_name }}</td>
                                        <td>{{ formatDate(reservation.res_date) }}</td>
                                        <td class="text-center">
                                            <font-awesome-icon icon="fa-solid fa-check" size="xl" type="button"
                                                @click="getResIndex(reservation)" class="btn-dark tick"
                                                data-bs-toggle="modal" data-bs-target="#confirmLoanModal" />
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
    <div class="modal fade" id="userLoansModal" tabindex="-1" aria-labelledby="userLoansModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userLoansModal">
                        {{ user.first_name + " " + user.last_name }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container p-4">
                        <h1 class="text-center">Current Loans <br /></h1>
                        <table class="table p-4">
                            <thead class="text-center">
                                <tr>
                                    <th scope="col">Item Name</th>
                                    <th scope="col">Transaction status</th>
                                    <th scope="col">Loan date</th>
                                    <th scope="col">Due date</th>
                                    <th scope="col">Return item?</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="transaction in transactions" :key="transaction.transaction_id">
                                    <template v-if="
                                        transaction.user_id == user.user_id &&
                                        transaction.transaction_status == 'On Loan'">
                                        <td>{{ transaction.item_name }}</td>

                                        <td>{{ transaction.transaction_status }}</td>
                                        <td>{{ formatDate(transaction.loan_date) }}</td>
                                        <template v-if="transaction.due_date._seconds < date">
                                            <td>
                                                {{ formatDate(transaction.due_date) }}
                                                <span class="badge rounded-pill bg-danger">Overdue</span>
                                            </td>
                                        </template>
                                        <td v-else>{{ formatDate(transaction.due_date) }}</td>
                                        <td class="text-center">
                                            <font-awesome-icon icon="fa-solid fa-check" size="xl"
                                                @click="getTransactionIndex(transaction)" type="button"
                                                class="text-dark tick" data-bs-toggle="modal"
                                                data-bs-target="#returnModal" />
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
    <!-- Return Item Confirmation Modal -->
    <div class="modal fade" id="returnModal" tabindex="-1" aria-labelledby="returnModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="returnModalLabel">Return item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h1>Confirm item returned?</h1>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-primary" @click="returnItem()" data-bs-dismiss="modal">Yes</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Confirm Loan  Modal -->
    <div class="modal fade" id="confirmLoanModal" tabindex="-1" aria-labelledby="confirmLoanModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmLoanModalLabel">
                        {{ reservedItem.item_name }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h1>Confirm Loan?</h1>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-primary" @click="loanItem()" data-bs-dismiss="modal">Yes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from "../stores/userStore";
import axios from "axios";

const userStore = useUserStore();

export default {
    data() {
        return {
            users: [],
            user: [],
            transactions: [],
            returnedItem: [],
            reservations: [],
            reservedItem: [],
            date: Math.floor(Date.now() / 1000),
        };
    },
    mounted() {
        this.getAllUsers();
    },
    methods: {
        getIndex(user) {
            this.user = user;
        },
        getTransactionIndex(transaction) {
            this.returnedItem = transaction;
        },
        // Gets all users from the server via the API
        async getAllUsers() {
            await axios
                .get("/api/v1/users", {
                    headers: {
                        Authorization: `Bearer ${userStore.authToken}`,
                    },
                })
                .then((response) => {
                    this.users = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // Updates user admin status
        async updateAdmin(user) {
            this.user = user;

            // Conditions for setting admin status
            if (this.user.admin === false) {
                this.user.admin = true;
            } else {
                this.user.admin = false;
            }
            const data = {
                admin: this.user.admin,
            };

            await axios
                .patch("/api/v1/users/user/" + this.user.user_id, data, {
                    headers: {
                        Authorization: `Bearer ${userStore.authToken}`,
                    },
                })
                .then((response) => {
                    this.getAllUsers();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // Gets all transactions from the server via the API
        async getAllTransactions() {
            await axios
                .get("/api/v1/transactions", {
                    headers: {
                        Authorization: `Bearer ${userStore.authToken}`,
                    },
                })
                .then((response) => {
                    this.transactions = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // Gets all reservations from the server via the API
        async getAllReservations() {
            await axios
                .get("/api/v1/reservations", {
                    headers: {
                        Authorization: `Bearer ${userStore.authToken}`,
                    },
                })
                .then((response) => {
                    this.reservations = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // Formats date into a readable format
        formatDate(timestamp) {
            if (timestamp) {
                let date = new Date(timestamp._seconds * 1000);
                date = date.toDateString();
                return date;
            } else {
                return "";
            }
        },
        // Updates transaction status to returned
        async returnItem() {
            const data = {
                transaction_status: "Returned",
            };

            await axios
                .patch(
                    "/api/v1/transactions/transaction/" +
                    this.returnedItem.transaction_id,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${userStore.authToken}`,
                        },
                    }
                )
                .then((response) => {
                    this.updateItemStatus();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // Updates item status to available
        async updateItemStatus() {
            const data = {
                status: "Available",
            };

            await axios
                .patch(
                    "/api/v1/items/item/" + this.returnedItem.item_id,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${userStore.authToken}`,
                        },
                    }
                )
                .then((response) => {
                    this.getAllTransactions();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getResIndex(reservation) {
            this.reservedItem = reservation;
        },
        // Creates a transaction for a loan
        async loanItem() {
            const data = {
                item_id: this.reservedItem.item_id,
                item_name: this.reservedItem.item_name,
                user_id: this.reservedItem.user_id,
                transaction_status: "On Loan",
            };
            await axios
                .post("/api/v1/transactions", data, {
                    headers: {
                        Authorization: `Bearer ${userStore.authToken}`,
                    },
                })
                .then((response) => {
                    this.updateReservedItemStatus();
                    this.deleteResevation();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // Updates item status to On Loan
        async updateReservedItemStatus() {
            const data = {
                status: "On Loan",
            };
            await axios
                .patch(
                    "/api/v1/items/item/" + this.reservedItem.item_id,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${userStore.authToken}`,
                        },
                    }
                )
                .then((response) => {
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // Deletes reservation
        async deleteResevation() {
            await axios
                .delete(
                    "/api/v1/reservations/reservation/" +
                    this.reservedItem.res_id,
                    {
                        headers: {
                            Authorization: `Bearer ${userStore.authToken}`,
                        },
                    }
                )
                .then((response) => {
                    this.getAllReservations();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};
</script>

<style scoped>
.tick:hover {
    color: red !important;
}
</style>
