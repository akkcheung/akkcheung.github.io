window.ChartApp = {}

ChartApp.model = function(){
	return {
		myChart: null,
		data: [12, 19, 3, 5, 2, 3],
	}
}

ChartApp.actions = state => ({
		clear: () => {
			state.myChart.data.datasets.forEach((dataset) => { 
				dataset.data = []
			})
		},

		generateRandomData: () => {
			state.data = state.data.map(() => Math.round(Math.random() * 20))

			state.myChart.data.datasets.forEach((dataset) => { 
				dataset.data = state.data
			})

			state.myChart.update()
		},

		draw: (ctx, model) => {

			const myChart = new Chart(ctx, {
				type: 'bar',
				data: {
				labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
				datasets: [{
					label: '# of Votes',
					data: model.data,
					backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(255, 206, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(153, 102, 255, 0.2)',
							'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
							'rgba(255, 99, 132, 1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 159, 64, 1)'
					],
					borderWidth: 1
				}]
				},
				options: {
				scales: {
					y: {
							beginAtZero: true
					}
				}
				}
			});

			model.myChart = myChart
		},
})
