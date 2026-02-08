
const book = ePub("book.epub");
const rendition = book.renderTo("viewer", {
  manager: "continuous",
  flow: "paginated",
  width: "100%",
  height: "100%",
});

const displayed=rendition.display();

var next = document.getElementById("next");
next.addEventListener("click", function(){
  rendition.next();
}, false);

var prev = document.getElementById("prev");
prev.addEventListener("click", function(){
  rendition.prev();
}, false);

const $toc = document.getElementById("toc-container");

book.loaded.navigation.then(function(nav) {
    const docfrag = document.createDocumentFragment();
    const header = document.createElement("header");

    header.textContent = "太白金星有點煩 - 馬伯庸";
    docfrag.append(header)

    nav.toc.forEach(function(chapter) {
        const item = document.createElement("li");
        const link = document.createElement("a");


        link.textContent = chapter.label;
        link.href = chapter.href;

        // Make the link functional
        link.onclick = function(e) {
            e.preventDefault();
            rendition.display(chapter.href);
            return false;
        };

        item.appendChild(link);
        docfrag.appendChild(item);
    });

    $toc.appendChild(docfrag);
});

const trigger = document.getElementById('open-modal')
const modal = document.getElementById('toc')

trigger.addEventListener('click', () => {
  modal.setAttribute('open', true);
});
 
console.log('modal', modal)

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.removeAttribute('open');
  }
});
