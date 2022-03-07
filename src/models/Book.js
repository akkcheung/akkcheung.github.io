
	window.BookShop = {}	

	BookShop.cartModel = function(){
		return {
			books: [],
			cart: [],
			query: m.stream(''),
			total: 0,
		}
	}

	BookShop.actions = {

		getResults(model) {
			const query = model.query().toLowerCase()

			return model.books.filter( (book) => 
				book.name.toLowerCase().indexOf(query) > -1 &&
					model.cart.indexOf(book) === -1
			)
		},

		addToCart(model, book){
			model.cart.push(book)
			model.total += book.price
		},

		removeFromCart(model, book){
			model.cart = model.cart.filter((item) =>
				item !== book)
			model.total -= book.price
		},

		fetchBooks(model){
			m.request({
				method: 'GET',
				url: 'https://mithril-examples.firebaseio.com/books.json'
			}).then(function(books){
				model.books = books || []
			})
		},

	}
