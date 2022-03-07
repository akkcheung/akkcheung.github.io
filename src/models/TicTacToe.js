// (function() { 
	window.TicTacToe = {}	

	TicTacToe.gameModel = function(){
		return {
			board: [
				[null, null, null],
				[null, null, null],
				[null, null, null],
			],
			isX: true
		}
	}

	TicTacToe.getWinner = function(board){

		const winningBoards = [
			// horizontal
			[0, 1, 2], // [[x, x, x], [_, _, _],  [_, _, _] 
			[3, 4, 5], // [[_, _, _], [x, x, x],  [_, _, _] 
			[6, 7, 8], // [[_, _, _], [_, _, _],  [x, x, x] 

			// vertical
			[0, 3, 6], 
			[1, 4 ,7], 
			[2, 5, 8], 
			
			// diagonal
			[0, 4, 8],
			[2, 4, 6],
		]

		for (let i =0; i< winningBoards.length; i++) {
			const [a, b, c] = winningBoards[i]

			const [aRow, aCol] = [Math.floor(a / 3), a % 3];
			const [bRow, bCol] = [Math.floor(b / 3), b % 3];
			const [cRow, cCol] = [Math.floor(c / 3), c % 3];

			const [aPlayer, bPlayer, cPlayer] = [
				board[aRow][aCol],
				board[bRow][bCol],
				board[cRow][cCol],
			]

			if (aPlayer && aPlayer === bPlayer && aPlayer === cPlayer) {
				return aPlayer
			}
		}

		return null
	}

	TicTacToe.getLabel = function(model){
		const winner = TicTacToe.getWinner(model.board) // todo
		const player = model.isX ? 'X': '0'

		return winner ?
			('Winner is: ' + winner) :
			('Player is: ' + player) 
	}

	TicTacToe.move = function(model, row, column){
		if (!TicTacToe.getWinner(model.board) && !model.board[row][column]) { // todo
			const player = model.isX ? 'X' : 'O'

			model.board[row][column] = player
			model.isX = !model.isX
		}
	}
// })
