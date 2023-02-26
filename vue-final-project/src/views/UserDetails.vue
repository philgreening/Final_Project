<template class="container-fluid">
    <!-- User details container -->
    <div class="container w-25 shadow-lg rounded p-4 mt-5 text-center">
        <h1>My Details</h1>
        <!-- Button to open edit modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal">
            Edit Details
        </button>
        <div class="row g-5">
            <div class="col p-4 fw-semibold">
                <!-- User details -->
                <p class="border-bottom p-2">First name: {{ user.first_name }}</p>
                <p class="border-bottom p-2">Last name: {{ user.last_name }}</p>
                <p class="border-bottom p-2">Email: {{ user.email }}</p>
                <p class="border-bottom p-2">Address: {{ user.address }}</p>
            </div>
        </div>
    </div>

    <!-- Update user Modal -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <form @submit.prevent="submitForm" class="needs-validation" novalidate>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <!-- Modal title -->
                        <h5 class="modal-title" id="editModalLabel">{{ username }}</h5>
                        <button type="button" @click="clearAlerts()" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container">
                            <div class="text-center my-2">
                                <p class="h3">Edit Details</p>
                            </div>
                            <!-- First name input -->
                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">First name</span>
                                </div>
                                <input type="text" class="form-control" placeholder="First name"
                                    v-model.lazy="user.first_name" required />
                                <div class="invalid-feedback">
                                    Please input your first name.
                                </div>
                            </div>
                            <!-- Last name input -->
                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Last name</span>
                                </div>
                                <input type="text" class="form-control" placeholder="Last name"
                                    v-model.lazy="user.last_name" required />
                                <div class="invalid-feedback">Please input your last name.</div>
                            </div>
                            <!-- Email input -->
                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Email</span>
                                </div>
                                <input type="email" class="form-control" placeholder="Email" v-model.lazy="user.email"
                                    required />
                                <div class="invalid-feedback">
                                    Please input a valid email address.
                                </div>
                            </div>
                            <!-- Address input -->
                            <div class="input-group mb-3 has-validation">
                                <div class="input-group-prepend">
                                    <span class="input-group-text h-100">Address</span>
                                </div>
                                <textarea class="form-control" placeholder="Address" v-model.lazy="user.address"
                                    required></textarea>
                                <div class="invalid-feedback">Please input an address.</div>
                            </div>
                            <div class="alert alert-success mb-3" role="alert" v-if="success.length">
                                <p class="text-center">{{ success }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <!-- Dismisses the modal without saving changes. -->
                        <button type="button" @click="clearAlerts()" class="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                        <!-- Submits the changes made in the form. -->
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { useUserStore } from "../stores/userStore";
import axios from "axios";
import { auth } from "../main";
import { updateEmail } from "firebase/auth";

const userStore = useUserStore();

export default {
    data() {
        return {
            user: [],
            currentUserId: userStore.user.id,
            username: userStore.user.name,
            success:''
        };
    },
    mounted() {
        this.getUser();
    },
    methods: {
        // Fetch user data from API
        async getUser() {
            await axios
                .get("http://localhost:4000/User/" + this.currentUserId, {
                    headers: {
                        Authorization: `Bearer ${userStore.authToken}`,
                    },
                })
                .then((response) => {
                    console.log("res response: ", response.data);
                    this.user = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // Handle form submission
        submitForm(event) {
            "use strict";

            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            const forms = document.querySelectorAll(".needs-validation");

            // Loop over them and prevent submission
            Array.from(forms).forEach((form) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log("called");
                } else {
                    this.updateUser();
                    this.success = "Details updated";
                }
                form.classList.add("was-validated");
            });
        },
        // Update user data via API
        async updateUser() {
            // Update user email in Firebase Auth
            updateEmail(auth.currentUser, this.user.email)
                .then(() => {
                    console.log("Auth email updated: ");
                })
                .catch((error) => {
                    console.log(error);
                });
            // Define form data object with user's details
            const formData = {
                first_name: this.user.first_name,
                last_name: this.user.last_name,
                email: this.user.email,
                address: this.user.address,
            };
            // Send a patch request via API to update user's details
            await axios
                .patch(
                    "http://localhost:4000/update-user/" + this.currentUserId,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${userStore.authToken}`,
                        },
                    }
                )
                .then((response) => {
                    console.log("res response upadte item: ", response.data);
                    this.getUser();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        clearAlerts() {
            this.success = '';
            this.getUser();
        }
    },
};
</script>
