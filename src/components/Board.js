window.Board = function Board(){

		// component state variable, unique to each instance
		let model = TicTacToe.gameModel();

		return {
			view : function() {
				// return [
				return m('div', [
					m('button.right', {
						onclick() { model = TicTacToe.gameModel() }
					}, 'Reset'),

					m('div', TicTacToe.getLabel(model)),

					m('table.Board', 
						model.board.map(function(row, i) {
							return m('tr', row.map(function(value, j) {
								return m('td.Square', {
									onclick() {
										TicTacToe.move(model, i, j)
									}
								}, value)
							}))
						})
					),
					
				])
			}
		}
	}


