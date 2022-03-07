window.StopWatch = {}

StopWatch.getModel = function(){
	return {
		interval: null,
		seconds: 0
	}
}

StopWatch.actions = {

	increment(model){
		model.seconds++
		m.redraw()
	},

	start(model){
		model.interval = setInterval(StopWatch.actions.increment, 1000, model)
	},

	stop(model){
		model.interval = clearInterval(model.interval)
	},

	reset(model){
		console.log('reset')
		model.seconds = 0;
	},

	toggle(model){
		if (model.isPaused){
			StopWatch.actions.start(model)
		} else {
			StopWatch.actions.stop(model)
		}

		model.isPaused = !model.isPaused
	},
}

