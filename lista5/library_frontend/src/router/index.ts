import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/books', name: 'books', component: () => import('../views/BooksView.vue') },
    { path: '/books/:id', name: 'book-detail', component: () => import('../views/BookDetailView.vue') },
    { path: '/authors', name: 'authors', component: () => import('../views/AuthorsView.vue') },
    { path: '/authors/:id', name: 'author-detail', component: () => import('../views/AuthorDetailView.vue') },
    { path: '/readers', name: 'readers', component: () => import('../views/ReadersView.vue') },
    { path: '/readers/:id', name: 'reader-detail', component: () => import('../views/ReaderDetailView.vue') },
    { path: '/book-copies', name: 'book-copies', component: () => import('../views/BookCopiesView.vue') },
    { path: '/book-copies/:id', name: 'book-copy-detail', component: () => import('../views/BookCopyDetailView.vue') },
    { path: '/rentals', name: 'rentals', component: () => import('../views/RentalsView.vue') },
    { path: '/rentals/:id', name: 'rental-detail', component: () => import('../views/RentalDetailView.vue') },
  ],
})

export default router
