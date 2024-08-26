import Vue from 'vue';
import Router from 'vue-router';
import OrderForm from './components/OrderForm.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'OrderForm',
      component: OrderForm,
    },
  ],
});
