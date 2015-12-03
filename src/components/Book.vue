<template>
	<div class="search">
		<input type="text" class="search-textfield" placeholder="Find books..." v-model="searchTerm" @keyup="doSearch">
	</div>
	<div class="books">
		<div class="book" v-for="book in books.list">
			<div class="book-thumb">
				<img v-bind:src="book.volumeInfo.imageLinks.thumbnail" alt="">
			</div>
			<div class="book-content">
				<h3 class="book-title">{{ book.volumeInfo.title }}</h3>
				<div class="book-author">
					By {{ book.volumeInfo.authors[0] }}
				</div>
				<div class="book-description">{{ book.volumeInfo.description }}</div>
			</div>
		</div>
	</ul>
</template>

<script>
	import lodash from 'lodash';

	export default {
		data() {
			return {
				searchTerm: '',
				books: {
					all: [],
					list: []
				}
			}
		},

		ready() {
			let self = this;
			const GOOGLLEBOOK_URL = 'https://www.googleapis.com/books/v1/volumes?q=volumns:javascript&maxResults=40';

			fetch(GOOGLLEBOOK_URL)
				.then(function(response) {
					return response.json();
				})
				.then(function(response) {
					self.$set('books.all', response.items);
					self.$set('books.list', response.items);
				});
		},

		methods: {
			doSearch() {
				let self = this;

				let filtered = self.books.all;

				if (self.books.searchTerm !== '') {
					filtered = _.filter(self.books.all, function(book) {
						return book.volumeInfo.title.toLowerCase().indexOf(self.searchTerm.toLowerCase()) !== -1;
					});
				}

				self.$set('books.list', filtered);
			}
		}
	}
</script>
