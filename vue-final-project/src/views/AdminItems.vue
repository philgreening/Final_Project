<template>
    <div class="container p-4 mt-3 shadow-lg">
        <h1 class="text-center">Items</h1>
        <!-- Search bar -->
        <div class="mb-3">
            <input type="text" class="form-control bg-light" v-model="search" placeholder="Search items...">
        </div>
        <div class="row">
            <!-- Status filter -->
            <div class="col-md-4 mb-3">
                <label for="status-filter" class="form-label">Filter by status</label>
                <select id="status-filter" class="form-select bg-light" v-model="statusFilter">
                    <option value="">All</option>
                    <option v-for="status in statusList" :value="status">
                        {{ status }}
                    </option>
                </select>
            </div>
            <!-- Item type filter -->
            <div class="col-md-4">
                <label for="type-filter" class="form-label">Filter by item type</label>
                <select id="type-filter" class="form-select bg-light" v-model="itemTypeFilter">
                    <option value="">All</option>
                    <option v-for="item_type in itemTypeList" :value="item_type">
                        {{ item_type }}
                    </option>
                </select>
            </div>
        </div>
        <font-awesome-icon icon="fa-solid fa-circle-plus" size="2xl" type="button" class="text-success my-4"
            data-bs-toggle="modal" data-bs-target="#addItemModal" title="Add an item" />
        <table class="table p-4">
            <thead>
                <tr>
                    <th scope="col">Item Name</th>
                    <th scope="col">Item Type</th>
                    <th scope="col">Description</th>
                    <th class="text-center" scope="col">Status</th>
                    <th class="text-center" scope="col">Edit item</th>
                    <th class="text-center" scope="col">Delete item</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in filteredItems" :key="item">
                    <td>{{ item.item_name }}</td>
                    <td>{{ item.item_type }}</td>
                    <td>{{ item.description }}</td>
                    <template v-if="item.status == 'On Loan'">
                        <td class="text-danger text-center">
                            <strong>{{ item.status }}</strong>
                        </td>
                    </template>
                    <td v-else class="text-center">{{ item.status }}</td>
                    <td class="text-center">
                        <font-awesome-icon icon="fa-regular fa-pen-to-square" size="xl" @click="getIndex(item)"
                            type="button" class="text-dark edit" data-bs-toggle="modal" data-bs-target="#editItemModal" />
                    </td>
                    <td class="text-center">
                        <font-awesome-icon icon="fa-regular fa-trash-can" size="xl" v-if="item.status === 'Available'"
                            type="button" @click="getIndex(item)" class="text-dark delete" data-bs-toggle="modal"
                            data-bs-target="#deleteItemModal" />
                        <font-awesome-icon v-else icon="fa-solid fa-triangle-exclamation" type="button" class="text-warning"
                            size="xl" :title="'Item ' + item.status + ' Cannot Delete'" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- Edit Item modal -->
    <div class="modal fade" id="editItemModal" tabindex="-1" aria-labelledby="editItemModalLabel" aria-hidden="true">
        <form @submit.prevent="submitForm" class="needs-validation" data-form-type="update" novalidate>
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
                            <div v-if="editItem.imageUrl" class="alignitems-center">
                                <img :src="editItem.imageUrl" :key="editItem.imageUrl"
                                    class="img-thumbnail mx-auto d-block" />
                            </div>

                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Item Name</span>
                                </div>
                                <input type="text" class="form-control" placeholder="Item Name"
                                    v-model.lazy="editItem.item_name" required />
                                <div class="invalid-feedback">Please input an item name.</div>
                            </div>
                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Item Type</span>
                                </div>
                                <select class="form-select" aria-label="Default select example"
                                    v-model.lazy="editItem.item_type" required>
                                    <option selected></option>
                                    <option v-for="item_type in itemTypeList" :value="item_type">
                                        {{ item_type }}
                                    </option>
                                </select>
                                <div class="invalid-feedback">Please choose an item type.</div>
                            </div>
                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text h-100">Description</span>
                                </div>
                                <textarea type="text-area" class="form-control" placeholder="Item Description"
                                    v-model.lazy="editItem.description" required></textarea>
                                <div class="invalid-feedback">Please describe your item.</div>
                            </div>
                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="itemimage">Item image</span>
                                </div>
                                <input type="file" class="form-control" @change="onFileSelected" />
                            </div>
                            <!-- display success message -->
                            <div class="alert alert-success mb-3" role="alert" v-if="success.length">
                                <p class="text-center">{{ success }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="clearAlerts()" class="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <!-- Add item modal -->
    <div class="modal fade" id="addItemModal" tabindex="-1" aria-labelledby="addItemModalLabel" aria-hidden="true">
        <form @submit.prevent="submitForm" class="needs-validation" data-form-type="add" novalidate>
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

                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Item Name</span>
                                </div>
                                <input type="text" class="form-control" placeholder="Item Name"
                                    v-model="createItem.item_name" required />
                                <div class="invalid-feedback">Please input an item name.</div>
                            </div>
                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Item Type</span>
                                </div>
                                <select class="form-select" aria-label="Default select example"
                                    v-model.lazy="createItem.item_type" required>
                                    <option selected></option>
                                    <option v-for="item_type in itemTypeList" :value="item_type">
                                        {{ item_type }}
                                    </option>
                                </select>
                                <div class="invalid-feedback">Please choose an item type.</div>
                            </div>
                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text h-100">Description</span>
                                </div>
                                <textarea type="text-area" class="form-control" placeholder="Item Description"
                                    v-model="createItem.description" required></textarea>
                                <div class="invalid-feedback">Please describe your item.</div>
                            </div>
                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="itemimage">Item image</span>
                                </div>
                                <input type="file" class="form-control" @change="onFileSelected" required />
                                <div class="invalid-feedback">Please choose a photo.</div>
                            </div>
                            <!-- display success message -->
                            <div class="alert alert-success mb-3" role="alert" v-if="success.length">
                                <p class="text-center">{{ success }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="clearAlerts()" class="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
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
                    <button type="button" class="btn btn-primary" @click="deleteItem()" data-bs-dismiss="modal">
                        Yes
                    </button>
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
            search: '',
            statusFilter: "",
            itemTypeFilter: '',
            statusList: ["Available", "On Loan", "Reserved"],
            itemTypeList: ["DIY", "Board Game", "Technology", "Cleaning", "Cooking", "Gardening", "Furniture"]
        };
    },
    mounted() {
        this.getAllItems();
    },
    computed: {
        // Filters items by name, status and type
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
        // Retrieve all items from server via the API
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
        // Updates an existing item
        async updateItem() {
            this.success = "";

            let formData = new FormData();
            formData.append("item_name", this.editItem.item_name);
            formData.append("item_type", this.editItem.item_type);
            formData.append("description", this.editItem.description);
            formData.append("status", "Available");
            if (this.selectedFile) {
                formData.append("image", this.selectedFile);
            }

            await axios
                .patch(
                    "/api/v1/items/item/" + this.editItem.item_id,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${userStore.authToken}`,
                        },
                    }
                )
                .then((response) => {
                    this.success = "Item updated";
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // Adds a new item
        async addItem() {
            let formData = new FormData();
            formData.append("item_name", this.createItem.item_name);
            formData.append("item_type", this.createItem.item_type);
            formData.append("description", this.createItem.description);
            formData.append("status", "Available");
            formData.append("image", this.selectedFile);

            //Call api and send formData to create item
            await axios
                .post("/api/v1/items", formData, {
                    headers: {
                        Authorization: `Bearer ${userStore.authToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    this.success = "Item added";
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        //Deletes an item
        async deleteItem() {
            await axios
                .delete("/api/v1/items/item/" + this.editItem.item_id, {
                    headers: {
                        Authorization: `Bearer ${userStore.authToken}`,
                    },
                })
                .then((response) => {
                    this.getAllItems();
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        getIndex(item) {
            this.editItem = item;
        },
        clearAlerts() {
            this.success = "";
            this.createItem.item_name = "";
            this.createItem.item_type = "";
            this.createItem.description = "";
            this.selectedFile = null;
            this.getAllItems();
        },
        onFileSelected(event) {
            this.selectedFile = event.target.files[0];
        },
        // Checks for validation and submits form
        submitForm(event) {
            "use strict";
            event.preventDefault();
            event.stopPropagation();

            const formType = event.target.getAttribute("data-form-type");
            // Checks validation rules are met
            const form = event.target;
            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                return;
            }
            // Checks if the form is adding a new record or updating a current record
            if (formType === "add") {
                this.addItem();
            } else if (formType === "update") {
                this.updateItem();
            }

            form.classList.remove("was-validated");
        },
    },
};
</script>

<style scoped>
.delete:hover {
    color: red !important;
    ;
}

.edit:hover {
    color: blue !important;
}
</style>