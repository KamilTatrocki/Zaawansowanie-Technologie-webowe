import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { layout: 'AppLayoutHome' }
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('../views/BooksView.vue'),
      meta: { layout: 'AppLayoutTable' }
    },
    {
      path: '/books/:id',
      name: 'book-detail',
      component: () => import('../views/BookDetailView.vue'),
      meta: { layout: 'AppLayoutTable' }
    },
    {
      path: '/authors',
      name: 'authors',
      component: () => import('../views/AuthorsView.vue'),
      meta: { layout: 'AppLayoutTable' }
    },
    {
      path: '/authors/:id',
      name: 'author-detail',
      component: () => import('../views/AuthorDetailView.vue'),
      meta: { layout: 'AppLayoutTable' }
    },
    {
      path: '/readers',
      name: 'readers',
      component: () => import('../views/ReadersView.vue'),
      meta: { layout: 'AppLayoutTable' }
    },
    {
      path: '/readers/:id',
      name: 'reader-detail',
      component: () => import('../views/ReaderDetailView.vue'),
      meta: { layout: 'AppLayoutTable' }
    },
    {
      path: '/book-copies',
      name: 'book-copies',
      component: () => import('../views/BookCopiesView.vue'),
      meta: { layout: 'AppLayoutTable' }
    },
    {
      path: '/book-copies/:id',
      name: 'book-copy-detail',
      component: () => import('../views/BookCopyDetailView.vue'),
      meta: { layout: 'AppLayoutTable' }
    },
    {
      path: '/rentals',
      name: 'rentals',
      component: () => import('../views/RentalsView.vue'),
      meta: { layout: 'AppLayoutTable' }
    },
    {
      path: '/rentals/:id',
      name: 'rental-detail',
      component: () => import('../views/RentalDetailView.vue'),
      meta: { layout: 'AppLayoutTable' }
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('../views/HomeView.vue')
    }
  ],
})

export default router
