window.WhacAMole = {}

WhacAMole.model = function(){
	return {
		result: 0,
		randomPosition: 0,
		currentTime: 60,
		interval: null,
	}
}

WhacAMole.actions = {

	getResult : function(model){
		return "Your score is " + model.result
	},

	getRandomPosition : function(model){

		model.randomPosition = Math.floor(Math.random() * 9) + 1 
		model.currentTime--

		if (model.currentTime === 0){
			clearInterval(model.interval)
			alert('GAME OVER!')
		}

		m.redraw()
		// console.log("from model -> " + model.randomPosition)

	},	 

	getTimeLeft : function(model){
		return "Time left : " + model.currentTime
	},

	moveMole : function(model){

		if (model.interval === null) {
			 model.interval = setInterval( this.getRandomPosition
			, 1000, model)
		}
	},

	timer : function(){
		const date = new Date()	
		//console.log(date.toLocaleTimeString())
	},

	stop : function(model){
		clearInterval(model.interval)
		model.interval = null
	},

	reset : function(model){
		model.result = 0
		model.currentTime = 60

		this.stop(model)
		this.moveMole(model)
	},

}





