
/*
window.Square = {
	view : function(vnode){
		let { id, randomId } = vnode.attrs

		let classList = (id === randomId) ? "square mole" : "square"

		return m("div", {class: classList, id: id}, "")
	}
}
*/

window.Square = function(vnode){
	let { id, randomId } = vnode.attrs
	let classList = (id === randomId) ? "square mole" : "square"

	return {
		view: function(){
			return m("div", {class: classList, id: id}, "")
		}
	}
}

window.Grid = function(){

  const model = WhacAMole.model()

	const arr = [1,2,3,4,5,6,7,8,9]

	WhacAMole.actions.moveMole(model) // call setInterval

	return {
		view: function(){
			return m("div", [

				m("p"),
				m("button", {
						 onclick(){
							WhacAMole.actions.reset(model)
						}
				}, "Reset"),

				m("p"),
				m("label", WhacAMole.actions.getResult(model)),

				m("p"),
				m("label", WhacAMole.actions.getTimeLeft(model)),

				m("p"),
				m("div", {class: "grid"}, [ 

				//todo: m.redraw not work in child component

				/*
				arr.map(function(id){
						// return m(Square)
						return m(Square, {
							id: id,
							randomId: model.randomPosition
						})
				 })
				 */

				 arr.map(function(id){
					return m("div", {
						class: (id === model.randomPosition) ? "square mole" : "square" 
						, id: id
						, onclick(){
							if (id === model.randomPosition)
								model.result++ 
						}
						}, "")
				 })
				]),


			])
		},
		
		onremove(){
			WhacAMole.actions.stop(model)
		},
	}
}

//m.mount(document.getElementById('app'), Square)
//m.mount(document.getElementById('app'), Grid)
