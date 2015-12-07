<template>
	<div class="search">
		<input type="text" class="search-textfield" placeholder="Find books..." v-model="searchTerm" @keyup="doSearch">
	</div>
	<div class="books">
		<div class="book" v-for="book in filteredBooks">
			<div class="book-thumb">
				<img v-bind:src="book.volumeInfo.imageLinks.thumbnail" alt="">
			</div>
			<div class="book-content">
				<h3 class="book-title">{{ book.volumeInfo.title }}</h3>
				<div class="book-author">
					By <strong>{{ book.volumeInfo.authors[0] }}</strong>
				</div>
				<div class="book-description">
					{{ book.volumeInfo.description | truncate }}
				</div>
			</div>
		</div>
		<div class="pagination">
			<a href="#" @click="previous">Previous</a>
			<a href="#" @click="next">Next</a>
		</div>
	</div>
</template>

<script>
	import lodash from 'lodash';

	export default {
		data() {
			return {
				searchTerm: '',
				books: [],
				filteredBooks: [],
				paginationBooks: [],
				pagination: {
					perPage: 6,
					currentPage: 1,
					totalPages: 0,
					totalItems: 0,
					pageNumbers: []
				}
			}
		},

		ready() {
			let self = this;

			self.fetchGooleBooks();
		},

		filters: {
			truncate: function(v) {
				if (v !== undefined) {
					let newline = v.indexOf('.');
					return newline > 0 ? v.slice(0, newline) : v;
				}
			}
		},

		methods: {
			fetchGooleBooks() {
				let self = this;

				const GOOGLEBOOK_URL = 'https://www.googleapis.com/books/v1/volumes?q=volumns:javascript&maxResults=40';

				fetch(GOOGLEBOOK_URL)
					.then(function(response) {
						return response.json();
					})
					.then(function(response) {
						let bookList = response.items;
						let chunk = _.chunk(bookList, self.pagination.perPage);

						self.$set('books', bookList);
						self.$set('paginationBooks', chunk);
						console.log(self.paginationBooks);

						self.$set('filteredBooks', chunk[0]);
						self.$set('pagination.totalItems', bookList.length);
						self.$set('pagination.totalPages', Math.ceil(bookList.length / self.pagination.perPage));
					});
			},

			doSearch() {
				let self = this;

				let filtered = self.books;

				if (self.books.searchTerm !== '') {
					filtered = _.filter(self.books, function(book) {
						return book.volumeInfo.title.toLowerCase().indexOf(self.searchTerm.toLowerCase()) !== -1;
					});
				}

				self.$set('filteredBooks', filtered);
			},

			page(ev, page) {
				ev.preventDefault();
			},

			next(ev) {
				ev.preventDefault();
				var self = this;

				if (self.pagination.currentPage > self.pagination.totalPages - 1) {
					return;
				}

				self.$set('pagination.currentPage', self.pagination.currentPage + 1);
				self.$set('filteredBooks', self.paginationBooks[self.pagination.currentPage]);
			},

			previous(ev) {
				ev.preventDefault();
				var self = this;

				if (self.pagination.currentPage === 1) {
					return;
				}

				self.$set('pagination.currentPage', self.pagination.currentPage - 1);
				self.$set('filteredBooks', self.paginationBooks[self.pagination.currentPage]);
			}
		}
	}
</script>
