<template>
  <div class="container p-4">
    <div class="row">
      <div class="col-md-4" v-for="item in items" :key="item.item_id">
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
                  <p class="card-text">
                    Due date: {{ formatDate(transaction.due_date) }}
                  </p>
                </template>
              </template>
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

  <div class="modal fade" id="resModal" tabindex="-1" aria-labelledby="resModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="resModalLabel">{{ reservedItem.name }}</h5>
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
</template>

<script>
import { onMounted, ref, getCurrentInstance } from "vue";
import axios from "axios";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useUserStore } from "../stores/userStore";
import { storage } from "../main";

// import router from '../router';
const userStore = useUserStore();
const auth = getAuth();
const storageRef = ref(storage);

export default {
  name: "items",
  data() {
    return {
      items: [],
      reservations: [],
      transactions: [],
      reservedItem: [],
    };
  },
  mounted() {
    this.getAllItems();
    this.getAllReservations();
    this.getAllTransactions();
  },
  methods: {
    async getAllItems() {
      //  console.log('token get all: ', userStore.authToken)
      await axios
        .get("http://localhost:4000/item/all", {
          headers: {
            Authorization: `Bearer ${userStore.authToken}`,
          },
        })
        .then((response) => {
          //  console.log(response.data)
          this.items = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllReservations() {
      await axios
        .get("http://localhost:4000/Reservation/all", {
          headers: {
            Authorization: `Bearer ${userStore.authToken}`,
          },
        })
        .then((response) => {
          //    console.log("res response: ",response.data)
          this.reservations = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllTransactions() {
      await axios
        .get("http://localhost:4000/Transaction/all", {
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
    async reserveItem() {
      const data = {
        item_id: this.reservedItem.item_id,
        item_name: this.reservedItem.item_name,
        user_id: userStore.user.id,
      };

      await axios
        .post("http://localhost:4000/create-reservation", data, {
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
    async updateItemStatus() {
      const data = {
        status: "Reserved",
      };
      await axios
        .patch(
          "http://localhost:4000/update-item/" + this.reservedItem.item_id,
          data,
          {
            headers: {
              Authorization: `Bearer ${userStore.authToken}`,
            },
          }
        )
        .then((response) => {
          console.log(this.reservedItem);
          this.getAllItems();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    formatDate(timestamp) {
      let date = new Date(timestamp._seconds * 1000);
      date = date.toDateString();
      return date;
    },
  },
};
</script>
