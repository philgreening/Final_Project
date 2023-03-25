import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../main";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "../stores/userStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/Register.vue"),
    },
    {
      path: "/items",
      name: "items",
      component: () => import("../views/Items.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/admin-transactions",
      name: "admin-transactions",
      component: () => import("../views/AdminTransactions.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/admin-reservations",
      name: "admin-reservations",
      component: () => import("../views/AdminReservations.vue"),
      meta: {
        requiresAuth: true,
        isAdmin: true,
      },
    },
    {
      path: "/admin-items",
      name: "admin-items",
      component: () => import("../views/AdminItems.vue"),
      meta: {
        requiresAuth: true,
        isAdmin: true,
      },
    },
    {
      path: "/admin-users",
      name: "admin-users",
      component: () => import("../views/AdminUsers.vue"),
      meta: {
        requiresAuth: true,
        isAdmin: true,
      },
    },
    {
      path: "/user-reservations",
      name: "user-reservations",
      component: () => import("../views/UserReservations.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/user-transactions",
      name: "user-transactions",
      component: () => import("../views/UserTransactions.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/user-currentLoans",
      name: "user-currentLoans",
      component: () => import("../views/UserCurrentLoans.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/user-details",
      name: "user-details",
      component: () => import("../views/UserDetails.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/register-google",
      name: "register-google",
      component: () => import("../views/RegisterGoogle.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/unauthorised",
      name: "unauthorised",
      component: () => import("../views/Unauthorised.vue"),
    },
  ],
});

// Adding a navigation guard that will be called before each route change
router.beforeEach(async (to) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth); // Checks if Auth required
  const isAdminRoute = to.matched.some((record) => record.meta.isAdmin);  // Checks if route is Admin only

  // If Auth required but not logged in, redirect to login page
  if (requiresAuth && !(await getCurrentUser())) {
    return "/login";
  }

  // Check if user is an admin
  if (isAdminRoute) {
    const userStore = useUserStore();

    // If user is admin  allow or show unauthorised if not
    if (userStore.user.admin) {
      return;
    } else {
      return "/unauthorised";
    }
  }
});

// Gets current user when auth state is changed
function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}

export default router;
