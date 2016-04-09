var client = new WebTorrent()

client.on('error', function (err) {
    console.error('ERROR: ' + err.message)
})

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault() // Prevent page refresh

    var torrentId = document.querySelector('form input[name=torrentId]').value
    log('Started')
    client.add(torrentId, onTorrent)
    document.querySelector('.form').innerHTML = ''
    document.querySelector('.form').style = 'margin-top:0%;'
    document.querySelector('#hide').style = ''
})

function onTorrent (torrent) {
    log('Got torrent metadata!')
    log(
        'Torrent info hash: ' + torrent.infoHash +
        '<a href="' + torrent.magnetURI + '" target="_blank">[Magnet URI]</a> ' +
        '<a href="' + torrent.torrentFileBlobURL + '" target="_blank" download="' + torrent.name + '.torrent">[Download .torrent]</a>'
)

var interval = setInterval(function () {
    Progress('Progress: ' + (torrent.progress * 100).toFixed(1) + '%' + ' Peers: ' + torrent.numPeers);document.querySelector('.ProgressBar').style.width = (torrent.progress * 100).toFixed(1) + '%';
}, 1000)


torrent.on('done', function () {
    Progress('100%')
    clearInterval(interval)
})

// Render all files into to the page
torrent.files.forEach(function (file) {
    file.appendTo('.video')
    
    file.getBlobURL(function (err, url) {
        if (err) return log(err.message)
        log('File done.')
        log('<a href="' + url + '">Download full file: ' + file.name + '</a>')
    })
})
}

function log (str) {
    var p = document.createElement('p')
    p.innerHTML = str
    document.querySelector('.log').appendChild(p)
}
function Progress (str) {
    var Progress = document.querySelector('#Progress')
    Progress.innerHTML = str
    document.title = str + ' | WebTorrent'
}