
window.CompositeStopWatchDisplay = function(){

		return {
			view : function(){
				return (
					m('div',
						m('strong', 'Stopwatch 1:'),
						m(StopWatchDisplay),

						m('hr'),
						m('strong', 'Stopwatch 2:'),
						m(StopWatchDisplay),
					)
				)
			},
		}
}
