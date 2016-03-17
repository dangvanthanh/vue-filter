<template>
	<div class="search">
		<input type="text" class="search-textfield" placeholder="Find book by title..." v-model="searchTerm" @keyup.enter="doSearch">
	</div>
	<div class="books">
		<div class="spinner" v-if="isLoading">
			<div class="spinner__loading">
				<div class="spinner__dot spinner__dot--1"></div>
				<div class="spinner__dot spinner__dot--2"></div>
				<div class="spinner__dot spinner__dot--3"></div>
			</div>
		</div>
		<div class="book-list" v-else>
			<div class="book" v-for="book in filteredBooks">
				<div class="book-thumb">
					<img :src="book.volumeInfo.imageLinks.thumbnail" alt="">
				</div>
				<div class="book-content">
					<h3 class="book-title">{{ book.volumeInfo.title }}</h3>
					<div class="book-author" v-show="book.volumeInfo.authors != undefined">
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
		<div class="spinner spinner--text" v-if="msg !== ''">
			<span v-text="msg"></span>
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
				},
				isLoading: true,
				msg: ''
			}
		},

		ready() {
			let self = this;

			self.fetchGooleBooks('javascript');
		},

		filters: {
			truncate(v) {
				if (v !== undefined) {
					let newline = v.indexOf('.');
					return newline > 0 ? v.slice(0, newline) : v;
				}
			}
		},

		methods: {
			fetchGooleBooks(searchTerm) {
				let self = this;

				const GOOGLEBOOK_URL = 'https://www.googleapis.com/books/v1/volumes?q=volumns:'+ searchTerm +'&maxResults=40';

				self.$set('isLoading', true);
				self.$set('msg', '');

				fetch(GOOGLEBOOK_URL)
					.then(function(response) {
						return response.json();
					})
					.then(function(response) {
						let bookList = response.items;

						if (!bookList) {
							bookList = [];
							self.$set('msg', 'The book can not found. Please search try again.');
						}

						self.$set('isLoading', false);
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

				if (self.searchTerm !== '') {
					self.$set('pagination.currentPage', 1);
					self.fetchGooleBooks(self.searchTerm);
				}
			},

			page(ev, page) {
				ev.preventDefault();
				let self = this;

				self.$set('pagination.currentPage', page);
				self.$set('filteredBooks', self.paginationBooks[page - 1]);
			},

			next(ev) {
				ev.preventDefault();
				let self = this;

				if (self.pagination.currentPage === self.pagination.totalPages) {
					return;
				}

				self.$set('pagination.currentPage', self.pagination.currentPage + 1);
				self.$set('filteredBooks', self.paginationBooks[self.pagination.currentPage - 1]);
			},

			previous(ev) {
				ev.preventDefault();
				let self = this;

				if (self.pagination.currentPage === 1) {
					return;
				}

				self.$set('pagination.currentPage', self.pagination.currentPage - 1);
				self.$set('filteredBooks', self.paginationBooks[self.pagination.currentPage - 1]);
			}
		}
	}
</script>
