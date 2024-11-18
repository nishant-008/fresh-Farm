const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');


////////////////////////////////////////////////////////
///// FILE

// Blocking, Synchronous way

// const textIn = fs.readFileSync('txt/input.txt','utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on: ${Date.now()}`;
// fs.writeFileSync('txt/output.txt', textOut);
// console.log('file written');

// Non-blocking, Asynchronous way

// fs.readFile('txt/startt.txt', 'utf-8', (err,data1) => {
//     if(err) return console.log('Error!☢️  ☢️');
//     fs.readFile(`txt/${data1}.txt`, 'utf-8', (err,data2) => {
//         console.log(data2);
//         fs.readFile('txt/append.txt', 'utf-8', (err,data3) => {
//             console.log(data3)
//             fs.writeFile('txt/final.txt', `${data2}\n${data3}`,'utf-8', err => {
//                 console.log('your file has been written 😊')
//             })
//         });
//     }); 
// });
// console.log('Will read file!');

////////////////////////////////////////////////////////
///// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8',);
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8',);
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`,'utf-8',);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8',);
const dataObj = JSON.parse(data);

const server = http.createServer((req,res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});
          const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
          const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
          res.end(output);

    // Product
    } else if(pathname === '/product'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API
    } else if(pathname === '/api'){
            res.writeHead(200, {'content-type': 'application/json'});
            res.end(data);

    // Not Found
    }else{
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found !!</h1>');
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
})