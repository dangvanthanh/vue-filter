var app = new Vue({
	el: '#app',

	data: {
		books: {
			all: [],
			list: [],
			searchTerm: ''
		}
	},

	ready: function() {
		var self = this;

		fetch('https://www.googleapis.com/books/v1/volumes?q=volumns:javascript&maxResults=40')
			.then(function(response) {
				return response.json();
			})
			.then(function(response) {
				self.$set('books.all', response.items);
				self.$set('books.list', response.items);
			});
	},

	methods: {
		doSearch: function() {
			var self = this;

			var filtered = self.books.all;

			if (self.books.searchTerm !== '') {
				filtered = _.filter(self.books.all, function(book) {
					return book.volumeInfo.title.toLowerCase().indexOf(self.books.searchTerm.toLowerCase()) !== -1;
				});
			}

			self.$set('books.list', filtered);
		}
	}
});
