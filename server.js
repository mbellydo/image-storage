// OUR "BBDD" 
var images = [
    { title: 'Perro_gordo', url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.W4A7fToVwIlIaJMcD7_inAHaFj%26pid%3DApi&f=1", date: "2018-01-17", color: "rgb(113, 90, 81)"},
    { title: 'Test_fecha', url: "https://i.picsum.photos/id/722/200/300.jpg?hmac=MDrZtULoytyxS357HVHCqzJRUv_BsxU0MEgszPVuMyY", date: "2021-01-17", color:"rgb(205, 188, 152)"}
];
// load the things we need
var express = require('express');
var app = express();
const { getColorFromURL, getPaletteFromURL } = require('color-thief-node');
const chalk = require('chalk');

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
// parse url-encoded params
app.use(express.urlencoded({extended: false}))

// show img page 
app.get('/', function(req, res) {

    var tagline = "These are the images you uploaded";
    console.log(images)
    res.render('pages/index', {
        images: images.sort(function (a,b) {
            var dateA = new Date(a.date), dateB = new Date(b.date)
	        return dateB - dateA
        }),
        tagline: tagline,
    });
});

// add img page
app.get('/add-img', function(req, res) {
    
    //console.log(images)
    res.render('pages/add-img');
});

function checkImgExists(link){
    let imageFound = false
    let i = 0
    while (i != images.length && !imageFound) {
        imageFound = images[i].url == link
        i++
    }

    return imageFound
}

async function getColor(url) {
    const dominantColor = await getColorFromURL(url);
    //const [r, g, b] = dominantColor;
    const color = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
    console.log(
        'Dominant Color:',
        color
    );
    return color
}

app.post('/add-img', async function(req, res) {
    const title = req.body.title;
    const url = req.body.url;
    const date = req.body.date;

    if ( title.length > 0){
        if ( title.match('^.*$') ) {
            console.log('Title is valid')
        } else{
            console.log('Title is invalid')
        }
    }

    if (checkImgExists(url)) {
        res.send("Esta Imagen ya esta almacenada, no se añadirá")
    } else {
        console.log("url no repetida")
        
        const color = await getColor(url)
        
        images.push({
            title: title,
            url: url,
            date: date,
            color: color,
        });

        res.redirect('/')
    }

});

app.listen(8080);
console.log('8080 is the magic port');
