import Vue from 'vue';
import VueResource from 'vue-resource';
import Book from './components/Book.vue';

Vue.use(VueResource);

var app = new Vue({
	el: '#app',
	components: {
		book: Book
	}
});
