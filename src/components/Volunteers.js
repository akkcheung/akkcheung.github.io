window.Volunteers = {
	view(vnode) {
		let { volunteers, add, remove } = vnode.attrs
		let showRemove = ( volunteers.length >= 2)

		return m('.Volunteers', [
			volunteers.map(function (volunteer, idx) {
				return m('fieldset', [
					m('legend', "Volunteer #" + (idx + 1)),
					m('label', "Name:"),
					m('input[type=text]', {
						value: volunteer.name,
						onchange(e) {
							volunteer.name = e.target.value
						}
					}),
					m('br'),
					m('label', "Email:"),
					m('input[type=text]', {
						value: volunteer.email,
						onchange(e) {
							volunteer.email = e.target.value
						}
					}),

					showRemove && 
						m('button', { onclick(){ remove(idx)}}, 'remove')
				])
			}),

			m('button', { onclick: add }, 'Add another volunteer'),
		])
	}
}
