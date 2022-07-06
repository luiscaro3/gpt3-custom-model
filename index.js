const server = require('server');
const  { request } = require('https');
const axios = require('axios');

const { error } = server.router;
const { status, redirect } = server.reply;
const { get } = server.router;

// ID that verifies the token transactions
let stateId = Math.floor(Math.random() * 1000000)

// Launch server
server({ port: 3000 }, [
    get('/', () => {
        // OAUth Reddit API
        return redirect(`https://www.reddit.com/api/v1/authorize?client_id=INwhUBiP5GHYBrU2BXBtvQ&response_type=code&state=${stateId}&redirect_uri=http://localhost:3000/initApi&duration=permanent&scope=read`)
        
    }),
    get('/initApi', (res) => {

			// Escape if stateId doesn't match
			if (res.query.state != stateId) {
					return;
			}

			axios({
					url: 'https://www.reddit.com/api/v1/access_token',
					method: 'POST',
					grant_type: 'authorization_code',
					code: res.query.code,
					redirect_uri: 'http://localhost:3000/initApi',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: 'Basic ' + Buffer.from('INwhUBiP5GHYBrU2BXBtvQ:QlOJqDioyKWjcq-yvGAf7B1AbaHBVg').toString('base64')
					}
				})
				.then(res => {
					console.log(res.data);

					// // Init API
					// const reddit = require('./reddit').initAPI(res.data.access_token)
	
					// // Get popular posts
					// reddit.getSubreddit('popular').getHot({limit: 10}).then(console.log);
				})
				.catch(error => {
					console.error(error);
				});

    }),
    error(ctx => status(500).send(ctx.error.message))
]);

