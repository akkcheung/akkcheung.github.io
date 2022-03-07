window.StopWatchDisplay = function(){

	const model = StopWatch.getModel()

	StopWatch.actions.start(model)

	return {
		view : function(){
			return (
				m('div',
					m('span', 'Timer: ' + model.seconds),

					m('button', {
						onclick(){
							StopWatch.actions.reset(model)
						}
					}, 'Reset'),

					m('button', {
						onclick(){
							StopWatch.actions.toggle(model)
						}
					}, model.isPaused ? 'Start' : 'Pause'),

				)
			)
		},

		onremove(){
			StopWatch.actions.stop(model)
		},
	}
}
