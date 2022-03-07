window.Coupon = function(){
	let code = ''
	let error = null

	function submit(onSuccess){
		error = null

		validateCoupon(code)
			.then(function(discount){
				alert('Coupon applied!')
				code = ''
				onSuccess(discount)
			})
			.catch(function(err){
				error = err
			})
	}

	return {
		view(vnode){
			let {onSuccess} = vnode.attrs

			return m('form', {
				onsubmit(e){
					e.preventDefault()
					submit(onSuccess)
				}
			}, [
				error && m('.error', error),
				
				m('label', "Enter coupon (if you have one):"),

				m('input[type=text]', {
					value: code,
					onchange(e){
						code = e.target.value
					}
					
				}),

				m('button[type=submit]', "Validate coupon")
			])
		}
	}
}

function validateCoupon(code){
	let isValid = (code === 'happy')
	let discount = 0.20

	if (isValid)
		return Promise.resolve(discount)
	else
		return Promise.reject('invalid_code')
}
