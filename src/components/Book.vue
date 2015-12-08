<template>
	<div class="search">
		<input type="text" class="search-textfield" placeholder="Find books..." v-model="searchTerm" @keyup="doSearch">
	</div>
	<div class="books">
		<div class="book" v-for="book in filteredBooks">
			<div class="book-thumb">
				<img :src="book.volumeInfo.imageLinks.thumbnail" alt="">
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
		<ul class="pagination" v-show="pagination.pageNumbers.length > 1">
			<li :class="{ 'disabled': pagination.currentPage === 1 }"><a href="#" @click="previous">Previous</a></li>
			<template v-for="pageNumber in pagination.pageNumbers">
				<li :class="{ 'active': pageNumber === pagination.currentPage }">
					<a href="#" @click="page($event, pageNumber)">{{ pageNumber }}</a>
				</li>
			</template>
			<li :class="{ 'disabled': pagination.currentPage === pagination.totalPages }"><a href="#" @click="next">Next</a></li>
		</ul>
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

						self.$set('books', bookList);
						self.initSearch(bookList);
					});
			},

			initSearch(list) {
				let self = this;
				let chunk = _.chunk(list, self.pagination.perPage);

				self.$set('paginationBooks', chunk);
				self.$set('filteredBooks', chunk[0]);
				self.$set('pagination.totalItems', list.length);
				self.$set('pagination.totalPages', Math.ceil(list.length / self.pagination.perPage));
				self.$set('pagination.pageNumbers', _.range(1, self.pagination.totalPages + 1));
			},

			doSearch() {
				let self = this;

				let filtered = self.books;

				if (self.books.searchTerm !== '') {
					filtered = _.filter(self.books, function(book) {
						return book.volumeInfo.title.toLowerCase().indexOf(self.searchTerm.toLowerCase()) !== -1;
					});
				}

				self.$set('pagination.currentPage', 1);
				self.initSearch(filtered);
			},

			page(ev, page) {
				ev.preventDefault();
				var self = this;

				self.$set('pagination.currentPage', page);
				self.$set('filteredBooks', self.paginationBooks[page - 1]);
			},

			next(ev) {
				ev.preventDefault();
				var self = this;

				if (self.pagination.currentPage === self.pagination.totalPages) {
					return;
				}

				self.$set('pagination.currentPage', self.pagination.currentPage + 1);
				self.$set('filteredBooks', self.paginationBooks[self.pagination.currentPage - 1]);
			},

			previous(ev) {
				ev.preventDefault();
				var self = this;

				if (self.pagination.currentPage === 1) {
					return;
				}

				self.$set('pagination.currentPage', self.pagination.currentPage - 1);
				self.$set('filteredBooks', self.paginationBooks[self.pagination.currentPage - 1]);
			}
		}
	}
</script>
