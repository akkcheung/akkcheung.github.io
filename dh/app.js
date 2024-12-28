const audio = document.getElementById('audio');
const lyricsContainer = document.getElementById('lyrics');
const menu = document.getElementById('menu');

const btnPlayNext = document.getElementById('playNext');
const btnPlayStop = document.getElementById('playStop');

let lyrics=[]
let currentLine = 0;

let songs = []
let songsPlaying = []

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

       songs = [...data.songs]
       songsPlaying = shuffle(songs) 

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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function playNext(){

  console.log(`playNext invoked`)

  // songsPlaying = shuffle(songs)
  console.log('songsPlaying:', songsPlaying)

  // const song = songs.pop()
  const song = songsPlaying.pop()

  const links = document.getElementsByTagName('a')

  for (let link of links){
    if (link.getAttribute('value') == song.id){
      console.log(`playing: ${songs.id}`)
      link.click()
    }
  }

  if (btnPlayNext.disabled == false)
    btnPlayNext.disabled = true   
}

function playStop(){
  clearInterval(checkInterval)
  btnPlayNext.disabled = false   
}

const checkInterval = setInterval(() => {
  console.log(`checkInterval invoked`)
  if (audio.ended){
     playNext()
  }
  if (songs.length == 0){
    clearInterval(checkInterval)
    playNext.disabled = false   
  }
}, 5000);


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

