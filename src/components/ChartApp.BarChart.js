
ChartApp.BarChart = function(){
	
	const model = ChartApp.model()

	const actions = ChartApp.actions(model)

	let ctx  

	return {
		// view: () => [
		view: function(){
			return m("div", {
					class: "chart-container",
					style: "position: relative; height:20vh; width:40vw"	
				}, [ 
					m("canvas", {
						oncreate(vnode){
							ctx = vnode.dom.getContext('2d')
							
							actions.draw(ctx, model)
						},
					}),

					m("button", {
						onclick(){
							actions.generateRandomData()
						}
					}, "Generate random data"), 
				]
			)
		//]
		},
		
		onremove(){
			model.myChart.destroy()
			// console.log("BarChart -> onremove")
		},

	}

}

