const audio = document.getElementById('audio');
const lyricsContainer = document.getElementById('lyrics');

let lyrics=[]
let currentLine = 0;

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

links.forEach(link => {
  link.addEventListener('click', handleLinkClick)
})

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

