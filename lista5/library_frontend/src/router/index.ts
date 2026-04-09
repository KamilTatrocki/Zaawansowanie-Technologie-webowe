import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/books', name: 'books', component: () => import('../views/BooksView.vue') },
    { path: '/authors', name: 'authors', component: () => import('../views/AuthorsView.vue') },
    { path: '/readers', name: 'readers', component: () => import('../views/ReadersView.vue') },
    { path: '/book-copies', name: 'book-copies', component: () => import('../views/BookCopiesView.vue') },
    { path: '/rentals', name: 'rentals', component: () => import('../views/RentalsView.vue') },
  ],
})

export default router
