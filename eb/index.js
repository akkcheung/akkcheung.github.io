
let book = ePub("book.epub");
// const book = ePub("CNET_T.epub");
//
let rendition = book.renderTo("viewer", {
  manager: "continuous",
  flow: "paginated",
  width: "100%",
  height: "100%",
});

rendition.themes.fontSize("120%");
const displayed=rendition.display();

let headerText="太白金星有點煩"

let bookmarks = []


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
  console.log("renderToc...")
  renderToc(nav.toc)
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

const picker = document.getElementById('picker')
console.log('picker', picker)

picker.addEventListener('change', (event) => {
  const choice = event.target.value;
  headerText = event.target.options[event.target.selectedIndex].text

  if (choice !== ""){
    console.log('choice', choice)
    console.log('headerText', headerText)
    
    if (rendition){
      rendition.destroy()
    };

    book = ePub(choice);

    rendition = book.renderTo("viewer", {
      manager: "continuous",
      flow: "paginated",
      width: "100%",
      height: "100%",
    });

    rendition.themes.fontSize("120%");
    rendition.display();


    book.loaded.navigation.then(function(nav) {
      renderToc(nav.toc)
    })

  }
})

function renderToc(toc){
  $toc.innerHTML = "";

   const docfrag = document.createDocumentFragment();
   const header = document.createElement("header");

   header.textContent = headerText
   docfrag.append(header)

   toc.forEach(function(chapter) {
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
}

function saveBookmark(bookId){
  const bookmarks = JSON.parse(localStorage.getItem('epub_bookmarks')) || []

  const currentCfi = rendition.currentLocation().start.cfi
  bookmarks[bookId] = currentCfi

  localStorage.setItem("epub_bookmarks", JSON.stringify(bookmarks))
  console.log(`Bookmark set for: ${bookId}`)

};




rendition.on("relocated", function(location){
  console.log("Current CFI:", location.start.cfi)
})
