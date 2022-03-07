// import m from "mithril"

const Layout = {
	view: function(vnode) {
		return m("main.layout", [
			m("nav.menu", [
				// m(m.route.Link, {href: "/list", "class": "btn"}, "Entry List"),
				m(m.route.Link, {href: "/board", "class": "btn"}, "Tic Tac Toe"),
				m(m.route.Link, {href: "/bookshop", "class": "btn"}, "Book Shop"),
				m(m.route.Link, {href: "/stopwatch", "class": "btn"}, "Stop Watch"),
			]),
			m("section", vnode.children)
		])
	}
}

// export default Layout
