// Create web server and listen on port 3000
const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const resource = parsedUrl.pathname;
    console.log('resource: ', resource);

    if (resource === '/about') {
        response.writeHead(200, {'Content-Type': 'text/html'});
        const html = fs.readFileSync('about.html', 'utf8');
        response.end(html);
    } else if (resource === '/comments') {
        if (request.method === 'GET') {
            response.writeHead(200, {'Content-Type': 'application/json'});
            const data = fs.readFileSync('data.txt', 'utf8');
            response.end(data);
        } else if (request.method === 'POST') {
            response.writeHead(201, {'Content-Type': 'application/json'});
            const data = fs.readFileSync('data.txt', 'utf8');
            const comments = JSON.parse(data);
            let body = '';
            request.on('data', (data) => {
                body += data;
            });
            request.on('end', () => {
                const comment = JSON.parse(body);
                comment.id = comments.length + 1;
                comments.push(comment);
                fs.writeFileSync('data.txt', JSON.stringify(comments));
                response.end(JSON.stringify(comment));
            });
        }
    } else {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
