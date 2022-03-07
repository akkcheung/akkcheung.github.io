window.Cart = function(){
	let model = BookShop.cartModel()
	
	BookShop.actions.fetchBooks(model)

	return {
		view: function(){
			return [
				m('h3', 'Book Shop'),

				m('input[type=text]', {
					placeholder: 'Filter',
					value: model.query(),
					oninput(event){
						model.query(event.target.value)
					}
				}),

				m(BookList, {
					model,
					items: BookShop.actions.getResults(model),
					action: BookShop.actions.addToCart,
					actionLabel: 'Add'
				}),

				m('hr'),
				m('h3', 'Cart'),
				m(BookList, {
					model,
					items: model.cart,
					action: BookShop.actions.removeFromCart,
					actionLabel: 'Remove'
				}),

				m('strong', 'Total: '),
				m('span', '$', model.total),
			]
		}
	}
}
