// import m from "mithril"

const Layout = {
	view: function(vnode) {
		return m("main.layout", [
			// m("nav.menu", [
			m("nav", 
				m("div.nav-wrapper", [
					m('ul',
					m('li', m(m.route.Link, {href: "/list"}, "Entry List")),
					m('li', m(m.route.Link, {href: "/board"}, "Tic Tac Toe")),
					m('li', m(m.route.Link, {href: "/bookshop"}, "Book Shop")),
					m('li', m(m.route.Link, {href: "/stopwatch"}, "Stop Watch")),
					m('li', m(m.route.Link, {href: "/whacamole"}, "Whac-A-Mole")),
					),
				]),
			),
			m("section", vnode.children),
		])
	}
}

// export default Layout
