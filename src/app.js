import Vue from 'vue';
import VueResource from 'vue-resource';
import Book from './components/Book.vue';

Vue.config.debug = false;
Vue.use(VueResource);

const app = new Vue({
	el: '#app',
	components: {
		book: Book
	}
});
