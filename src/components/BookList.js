window.BookList = function(){

	return {
		view : function({ attrs }){
			return (
				m('ul', 
					attrs.items.map((book) => 
						m('li', { key: book.id },
							m('span', book.name, ' $', book.price),

							m('button', {
								onclick(){
									attrs.action(attrs.model, book)
								}
							}, attrs.actionLabel)
						)
					)	
				)
			)
		}

	}
}
