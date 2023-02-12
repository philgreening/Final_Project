<template>
    <div class="container p-4">
        <h1 class="text-center"> Items</h1>
        <table class="table p-4">
            <thead>
                <tr>
                    <th scope="col">Item Name</th>
                    <th scope="col">Item Type</th>
                    <th scope="col">Description</th>
                    <th scope="col">Status</th>
                    <th scope="col">Edit item</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items" :key="item.item_id">
                    <td>{{ item.item_name }}</td>
                    <td>{{ item.item_type }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.status }}</td>
                    <td>
                        <!-- <template v-if="transaction.transaction_status === 'On Loan'"> -->
                            <button type="button" @click="getIndex(item)" class="btn btn-danger"
                                data-bs-toggle="modal" data-bs-target="#editItemModal">Edit Item</button>
                        <!-- </template> -->
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="modal fade" id="editItemModal" tabindex="-1" aria-labelledby="editItemModalLabel" aria-hidden="true">
        <form @submit.prevent="updateItem">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editItemModalLabel">Edit item</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container">
   
        <div class="text-center my-2">
          <p class="h3">Edit Item</p>
        </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="item-name">Item Name</span>
            </div>
            <input type="text" class="form-control" placeholder="Item Name" v-model="editItem.item_name">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="item-type">Item Type</span>
            </div>
            <input type="text" class="form-control" placeholder="Item Type" v-model="editItem.item_type">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text h-100" id="desc">Description</span>
            </div>
            <textarea class="form-control" placeholder="Describe the item..." v-model="editItem.description"></textarea>
          </div>
          <!-- <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="profileimage">Profile Image </span>
            </div>
            <input type="file" class="form-control" @change="onFileUpload">
          </div> -->
          <!-- display error messages -->
          <template class="alert alert-danger mb-3" v-if="errors.length">
            <p class="text-center" v-for="error in errors" v-bind:key="error">{{ error }}</p>
          </template>
          <!-- display success message -->
          <template class="alert alert-success mb-3" v-if="success.length">
            <p class="text-center">{{ success }}</p>
          </template>
          <!-- <button type="submit" class="btn btn-primary pull-left">Submit</button> -->
      <!-- </div> -->
    <!-- </div> -->
  </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                    <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Save changes
                    </button>
                </div>
            </div>
        </div>
    </form>

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
            items: [],
            errors:[],
            editItem: [],
            success: ''
        }
    },
    mounted() {
        this.getAllItems();
    },
    methods: {
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
        getIndex(item) {
            this.editItem = item;
            console.log(this.editItem);
        },
        async returnItem() {
            console.log("returned: " + this.returnedItem.item_id);

            const data = {

                transaction_status: 'Returned'
                // item_name: this.returned.item_name,
                // user_id: userStore.user.id
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
        async updateItem() {
            console.log(this.editItem.item_id);

            this.errors = []
            console.log(this.errors);
        if (this.editItem.item_name === '') {
            this.errors.push('Please enter an item name')
        }
        if (this.editItem.item_type === '') {
            this.errors.push('Please enter an item type')
        }
        if (this.editItem.item_description === '') {
            this.errors.push('Please describe your item')
        }
        if (!this.errors.length) {
            // create and append data collected from form
            const formData = new FormData();

            formData.append('item_name', this.editItem.item_name)
            formData.append('item_type', this.editItem.item_type)
            formData.append('description', this.editItem.description)


            // const formData = {
            //     item_name: this.editItem.item_name,
            //     item_type: this.editItem.item_type,
            //     description: this.editItem.description,
            // }

            await axios.patch('http://localhost:4000/update-item/' + this.editItem.item_id, formData, {
                headers: {
                    Authorization: `Bearer ${userStore.authToken}`
                }
            })
                .then(response => {
                    console.log("res response upadte item: ", response.data);
                    this.success = "Item updated";
        
                })
                .catch(error => {
                    console.log(error);
                })
            }
        },

    }
};
</script>