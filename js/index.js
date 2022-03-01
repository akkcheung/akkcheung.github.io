
//  var instance = M.Tabs.init(elem)

document.addEventListener('DOMContentLoaded', function() {
    var el = document.querySelectorAll('.tabs');
    var tabInstances = M.Tabs.init(el);

    var elems = document.querySelectorAll('.sidenav');
    // var instances = M.Sidenav.init(elems, options);
    var instances = M.Sidenav.init(elems);

  });
