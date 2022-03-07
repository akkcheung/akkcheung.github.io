window.Total = {
	view(vnode){
		let { count, discount } = vnode.attrs

		return m('.total', [
			m('label', "Total: "),

			discount > 0 &&
				discountView(count, discount),
			
			m('b', "$" + calculatePrice(discount, count))
		])
	}
}

function discountView(count, discount){
	let total = calculateTotal(count)
	let discountedAmount = total * discount

	return m('span', "(Coupon discount: -$" + discountedAmount + ")")
}

/* Model logic */
	
const PRICE_PER_COUNT = 10

function calculatePrice(discount, count){
	let total = calculateTotal(count)

	return roundCents(total - total * discount)
}

function calculateTotal (count) {
	return count * PRICE_PER_COUNT
}

function roundCents(num){
	return Math.round(num * 100) / 100
}
