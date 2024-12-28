const audio = document.getElementById('audio');
const lyricsContainer = document.getElementById('lyrics');
const menu = document.getElementById('menu');

let lyrics=[]
let currentLine = 0;

// Functions

function handleLinkClick(event){
  event.preventDefault()

  const clickedLink = event.target;
  const linkValue = clickedLink.getAttribute('value');

  console.log('Link text:', clickedLink.text )
  
  lyricsContainer.innerText = clickedLink.text
  currentLine = 0

  audio.src = linkValue + ".mp3"

  fetch(linkValue + ".lrc")
    .then(response => response.text())
    .then(data => {
        // const parsedLyrics = parseLRC(data);
        lyrics = parseLRC(data);
        // console.log(parsedLyrics);

    })
    .then(audio.play())
  
}

function parseLRC(lrcText) {
    const lines = lrcText.split('\n');
    const regex = /^\[(\d{2}):(\d{2}\.\d{2})\](.*)$/;
    const lyrics = [];
    // lyrics = []

    lines.forEach(line => {
        const match = line.match(regex);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseFloat(match[2]);
            const time = minutes * 60 + seconds;
            const text = match[3].trim();
            lyrics.push({ time, text });
        }
    });

    return lyrics;
}

function getSongs(){
  fetch('songs.json')
    .then(response => response.json())
    .then(data => {
       data.songs.forEach( song => {
         console.log(song.name)
       })
    })
}

function getMenu(){
  fetch('songs.json')
    .then(response => response.json())
    .then(data => {

       let songList = ""

       data.songs.forEach( song => {
         if (String(song.id)[3] === "1"){
           if (String(song.id)[0] === "1")
             songList += `<li class="divider" data-content="廣東話"></li>`

           if (String(song.id)[0] === "2")
             songList += `<li class="divider" data-content="國語"></li>`

           if (String(song.id)[0] === "3")
             songList += `<li class="divider" data-content="ENG"></li>`
         }

         songList += `
         <li class="menu-item">
            <a href="#" value="${song.id}">${song.name}</a>
         </li>
         `
       })
       
       console.log(songList)
       // return songList
       
       menu.innerHTML = songList


    })
}

// EventListeners

audio.addEventListener('timeupdate', () => {
    if (currentLine < lyrics.length && audio.currentTime > lyrics[currentLine].time) {
        lyricsContainer.innerText = lyrics[currentLine].text;
        currentLine++;
    }
});

audio.addEventListener('ended', () => {
    currentLine = 0; // Reset when the song ends
});

const links = document.querySelectorAll('a')


// getSongs()
// menu.innerHTML = getMenu()

getMenu()

// links.forEach(link => {
//   link.addEventListener('click', handleLinkClick)
// })

document.addEventListener('DOMContentLoaded', () => {
  menu.addEventListener('click', (event) => {

    if (event.target.tagName.toLowerCase() === 'a'){
      // console.log(event.target)
      handleLinkClick(event)
    }
  })
})
