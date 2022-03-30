/* eslint-disable */
import Designer from '@/views/Designer.vue';

const routes = [
  {
    path: '/', redirect: '/designer'
  },
  {
    path: '/designer',
    name: 'Designer',
    component: Designer
  }
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
