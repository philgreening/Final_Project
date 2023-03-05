<template>
    <div class="container p-4">
        <h1 class="text-center">Items</h1>
        <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addItemModal">
            Add Item
        </button>
        <table class="table p-4">
            <thead>
                <tr>
                    <th scope="col">Item Name</th>
                    <th scope="col">Item Type</th>
                    <th scope="col">Description</th>
                    <th scope="col">Status</th>
                    <th scope="col">Edit item</th>
                    <th scope="col">Delete item</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items" :key="item">
                    <td>{{ item.item_name }}</td>
                    <td>{{ item.item_type }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.status }}</td>
                    <td>
                        <!-- <template v-if="transaction.transaction_status === 'On Loan'"> -->
                        <button type="button" @click="getIndex(item)" class="btn btn-warning" data-bs-toggle="modal"
                            data-bs-target="#editItemModal">
                            Edit Item
                        </button>
                        <!-- </template> -->
                    </td>
                    <td>
                        <button v-if="item.status === 'Available'" type="button" @click="getIndex(item)"
                            class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteItemModal">
                            Delete Item
                        </button>
                        <p v-else class="h6">
                            Can't delete item: <br />
                            {{ item.status }}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- Edit Item modal -->
    <div class="modal fade" id="editItemModal" tabindex="-1" aria-labelledby="editItemModalLabel" aria-hidden="true">
        <form @submit.prevent="updateItem">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editItemModalLabel">Edit item</h5>
                        <button type="button" @click="clearAlerts()" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container">
                            <div class="text-center my-2">
                                <p class="h3">Edit Item</p>
                            </div>
                            <div class="alignitems-center">
                                <img :src="editItem.imageUrl" class="img-thumbnail mx-auto d-block">
                            </div>
                            <div class="input-group my-3 ">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="item-name">Item Name</span>
                                </div>
                                <input type="text" class="form-control" placeholder="Item Name"
                                    v-model.lazy="editItem.item_name" />
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="item-type">Item Type</span>
                                </div>
                                <input type="text" class="form-control" placeholder="Item Type"
                                    v-model.lazy="editItem.item_type" />
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text h-100" id="desc">Description</span>
                                </div>
                                <textarea class="form-control" placeholder="Describe the item..."
                                    v-model.lazy="editItem.description"></textarea>
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="profileimage">Profile Image </span>
                                </div>
                                <input type="file" class="form-control" @change="onFileSelected">
                            </div>
                            <!-- display error messages -->
                            <div class="alert alert-danger mb-3" role="alert" v-if="errors.length">
                                <p class="text-center" v-for="error in errors" :key="error">
                                    {{ error }}
                                </p>
                            </div>
                            <!-- display success message -->
                            <div class="alert alert-success mb-3" role="alert" v-if="success.length">
                                <p class="text-center">{{ success }}</p>
                            </div>
                            <!-- <button type="submit" class="btn btn-primary pull-left">Submit</button> -->
                            <!-- </div> -->
                            <!-- </div> -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="clearAlerts()" class="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <!-- Add item modal -->
    <div class="modal fade" id="addItemModal" tabindex="-1" aria-labelledby="addItemModalLabel" aria-hidden="true">
        <form @submit.prevent="addItem">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addItemModalLabel">Add item</h5>
                        <button type="button" @click="clearAlerts()" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container">
                            <div class="text-center my-2">
                                <p class="h3">Add Item</p>
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="item-name">Item name</span>
                                </div>
                                <input type="text" class="form-control" placeholder="Item Name"
                                    v-model="createItem.item_name" />
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="item-type">Item type</span>
                                </div>
                                <input type="text" class="form-control" placeholder="Item Type"
                                    v-model="createItem.item_type" />
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text h-100" id="desc">Description</span>
                                </div>
                                <textarea class="form-control" placeholder="Describe the item..."
                                    v-model="createItem.description"></textarea>
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="itemimage">Item image
                                    </span>
                                </div>
                                <input type="file" class="form-control" @change="onFileSelected" />
                            </div>
                            <!-- display error messages -->
                            <div class="alert alert-danger mb-3" role="alert" v-if="errors.length">
                                <p class="text-center" v-for="error in errors" :key="error">
                                    {{ error }}
                                </p>
                            </div>
                            <!-- display success message -->
                            <div class="alert alert-success mb-3" role="alert" v-if="success.length">
                                <p class="text-center">{{ success }}</p>
                            </div>
                            <!-- <button type="submit" class="btn btn-primary pull-left">Submit</button> -->
                            <!-- </div> -->
                            <!-- </div> -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="clearAlerts()" class="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <!-- delete item modal -->
    <div class="modal fade" id="deleteItemModal" tabindex="-1" aria-labelledby="deleteItemModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteItemModel">Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h1>Do you wish to delete this item?</h1>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        No
                    </button>
                    <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                    <button type="button" class="btn btn-primary" @click="deleteItem()" data-bs-dismiss="modal">
                        Yes
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from "../stores/userStore";
import axios from "axios";

const userStore = useUserStore();

export default {
    data() {
        return {
            items: [],
            errors: [],
            editItem: [],
            createItem: {
                item_name: "",
                item_type: "",
                description: "",
            },
            success: "",
            selectedFile: null,
            // imageUrl: null
        };
    },
    mounted() {
        this.getAllItems();
    },
    methods: {
        async getAllItems() {
            console.log("token get all: ", userStore.authToken);
            await axios
                .get("http://localhost:4000/item/all", {
                    headers: {
                        Authorization: `Bearer ${userStore.authToken}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    this.items = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        async updateItem() {
            // reset alert messages
            this.errors = [];
            this.success = "";

            // Conditions for error handling
            if (this.editItem.item_name === "") {
                this.errors.push("Please enter an item name");
            }
            if (this.editItem.item_type === "") {
                this.errors.push("Please enter an item type");
            }
            if (this.editItem.description === "") {
                this.errors.push("Please describe your item");
            }
            // If no errors, then submit form data
            if (!this.errors.length) {
                let formData = new FormData();
                formData.append('item_name',this.editItem.item_name);
                formData.append('item_type',this.editItem.item_type);
                formData.append('description', this.editItem.description);
                formData.append('status', "Available");
                formData.append('image', this.selectedFile);
                

                // const formData = {
                //     item_name: this.editItem.item_name,
                //     item_type: this.editItem.item_type,
                //     description: this.editItem.description,
                // };

                await axios
                    .patch(
                        "http://localhost:4000/update-item/" + this.editItem.item_id,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${userStore.authToken}`,
                            },
                        }
                    )
                    .then((response) => {
                        console.log("res response upadte item: ", response.data);
                        this.success = "Item updated";
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        async addItem() {
            // reset alert messages
            this.errors = [];
            this.success = "";

            // Conditions for error handling
            if (this.createItem.item_name === "") {
                this.errors.push("Please enter an item name");
            }
            if (this.createItem.item_type === "") {
                this.errors.push("Please enter an item type");
            }
            if (this.createItem.description === "") {
                this.errors.push("Please describe your item");
            }
            // If no errors, then submit form data
            if (!this.errors.length) {

                let formData = new FormData();
                formData.append('item_name',this.createItem.item_name);
                formData.append('item_type',this.createItem.item_type);
                formData.append('description', this.createItem.description);
                formData.append('status', "Available");
                formData.append('image', this.selectedFile);
                


                // const formData = {
                //     item_name: this.createItem.item_name,
                //     item_type: this.createItem.item_type,
                //     description: this.createItem.description,
                //     status: "Available",
                // };
                //Call api and send formData to create item
                await axios
                    .post("http://localhost:4000/create-item/", formData, {
                        headers: {
                            Authorization: `Bearer ${userStore.authToken}`,
                            "Content-Type": "multipart/form-data"
                        },
                    })
                    .then((response) => {
                        console.log("Item created: ", response.data);
                        this.success = "Item added";
                        // this.imageUrl = response.data.imageUrl;
                        // console.log(this.imageUrl);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        async deleteItem() {
            await axios
                .delete("http://localhost:4000/delete-item/" + this.editItem.item_id, {
                    headers: {
                        Authorization: `Bearer ${userStore.authToken}`,
                    },
                })
                .then((response) => {
                    console.log("res response: ", response.data);
                    this.getAllItems();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getIndex(item) {
            this.editItem = item;
            console.log(this.editItem);
        },
        clearAlerts() {
            this.errors = [];
            this.success = "";
            this.getAllItems();
        },
        onFileSelected(event){
            this.selectedFile = event.target.files[0];
        }
    },
};
</script>
