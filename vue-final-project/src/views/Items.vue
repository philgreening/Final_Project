<template>
  <div class="container p-4">
    <div class="mb-3">
      <input type="text" class="form-control bg-light" v-model="search" placeholder="Search items...">
    </div>
    <div class="row">
      <!-- Filter by transaction status  -->
      <div class="col-md-4 mb-3">
        <label for="status-filter" class="form-label">Filter by status</label>
        <select id="status-filter" class="form-select bg-light" v-model="statusFilter">
          <option value="">All</option>
          <option v-for="status in statusList" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
      <div class="col-md-4">
        <!-- Filter by item type  -->
        <label for="type-filter" class="form-label">Filter by item type</label>
        <select id="type-filter" class="form-select bg-light" v-model="itemTypeFilter">
          <option value="">All</option>
          <option v-for="item_type in itemTypeList" :value="item_type">
            {{ item_type }}
          </option>
        </select>
      </div>
      <div class="row">
        <div class="col-md-4" v-for="item in filteredItems" :key="item.item_id">
          <div class="card m-4 shadow">
            <img v-bind:src="item.imageUrl" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">{{ item.item_name }}</h5>
              <p class="card-text">{{ item.description }}</p>
              <template v-if="item.status == 'On Loan'">
                <template v-for="transaction in transactions" :key="transaction.transaction_id">
                  <template v-if="
                    item.item_id === transaction.item_id &&
                    transaction.transaction_status === 'On Loan'">
                    <span class="badge rounded-pill bg-danger">On Loan</span>
                    <p class="card-text">
                      Due date: {{ formatDate(transaction.due_date) }}
                    </p>
                  </template>
                </template>
              </template>
              <template v-if="item.status == 'Reserved'">
                <span class="badge rounded-pill bg-warning text-dark">Reserved</span>
              </template>
              <template v-if="item.status == 'Available'">
                <button type="button" @click="getIndex(item)" class="btn btn-primary" data-bs-toggle="modal"
                  data-bs-target="#resModal">
                  Reserve
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Reservation Modal -->
    <div class="modal fade" id="resModal" tabindex="-1" aria-labelledby="resModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="resModalLabel">Place reservation?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h1>Do you wish to reserve this item?</h1>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              No
            </button>
            <button type="button" class="btn btn-primary" @click="reserveItem()" data-bs-dismiss="modal">
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();

export default {
  name: "items",
  data() {
    return {
      items: [],
      reservations: [],
      transactions: [],
      reservedItem: [],
      search: '',
      statusFilter: "",
      itemTypeFilter: '',
      statusList: ["Available", "On Loan", "Reserved"],
      itemTypeList: ["DIY", "Board Game", "Technology", "Cleaning", "Cooking", "Gardening", "Furniture"]
    };
  },
  mounted() {
    this.getAllItems();
    this.getAllReservations();
    this.getAllTransactions();
  },
  computed: {
    // Filter by item type and status or search by item name
    filteredItems() {
      return this.items.filter((items) => {
        if (this.search && items.item_name.toLowerCase().indexOf(this.search.toLowerCase()) === -1) {
          return false;
        }
        if (this.statusFilter && items.status !== this.statusFilter) {
          return false;
        }
        if (this.itemTypeFilter && items.item_type !== this.itemTypeFilter) {
          return false;
        }
        return true;
      });
    }
  },
  methods: {
    // Get all items on the server via the API
    async getAllItems() {
      await axios
        .get("/api/v1/items", {
          headers: {
            Authorization: `Bearer ${userStore.authToken}`,
          },
        })
        .then((response) => {
          this.items = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // Get all reservations on the server via the API
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
    // Get all transactions on the server via the API
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

    getIndex(item) {
      this.reservedItem = item;
    },
    // Create a reservation on the server via the API
    async reserveItem() {
      const data = {
        item_id: this.reservedItem.item_id,
        item_name: this.reservedItem.item_name,
        user_id: userStore.user.id,
      };

      await axios
        .post("/api/v1/reservations", data, {
          headers: {
            Authorization: `Bearer ${userStore.authToken}`,
          },
        })
        .then((response) => {
          this.updateItemStatus();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // Update item status to reserved
    async updateItemStatus() {
      const data = {
        status: "Reserved",
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
          this.getAllItems();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // Format date to a readable format
    formatDate(timestamp) {
      let date = new Date(timestamp._seconds * 1000);
      date = date.toDateString();
      return date;
    },
  },
};
</script>
