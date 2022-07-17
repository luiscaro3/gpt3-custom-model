const server = require('server');
const axios = require('axios');
const fs = require('fs');

const { error } = server.router;
const { status, render } = server.reply;
const { get } = server.router;

const myArgs = process.argv.slice(2);

if(myArgs[0] === '--web') {
	// Launch server
	server({ port: 3000 }, [
		get('/', initAPI),
		error(ctx => status(500).send(ctx.error.message))
	]);
} else {
	setInterval(initAPI, 1000 * 15)
}





function initAPI() {
	console.log('Ping reddit...');
	return axios({
		url: 'https://www.reddit.com/api/v1/me',
		method: 'GET',
		grant_type: 'password',
		username: 'Suspicious-Novel-412',
		password: '=_umj&s5@XQ4Lq/',
		redirect_uri: 'http://localhost:3000/initApi',
		headers: {
			'User-Agent': 'chrome:ReadMeClient:v0.1 by /u/Suspicious-Novel-412',
		}
	})
	.then(async () => {
		// Init API
		const reddit = require('./reddit').initAPI('Ha4Qr8PEv_sE4yYpS25gzfyipJQwSg')

		const mapPost = post => (
			{
				title: post.title,
				score: post.score,
				upvote: post.upvote,
				num_comments: post.num_comments,
				date: new Date(post.created * 1000).toLocaleString(),
				over_18: post.over_18,
			}
		)

		const formatPost = post => `<h1>${post.title}</h1>
		<b>num_comments</b>: ${post.num_comments}<br>
		<b>score</b>: ${post.score}<br>
		<b>date</b>: ${post.date}<br>
		<b>over_18</b>: ${post.over_18}<br /><br />`

		const promptFormat = post => JSON.stringify({"prompt":"", "completion": ` ${post.title}`})
		
		// Get popular posts
		const hotList = await reddit.getSubreddit('popular').getHot({limit: 100, sort: 'relevance'}).reduce((prev, next) => 
					// Only include posts that are not NSFW, with more than 100 comments and that have high score relative to comments
			next.over_18 || next.score / next.num_comments > 10 || next.num_comments < 100 ? prev : [...prev, mapPost(next)], [])


		// Get controversial posts
		const controversialList = await reddit.getSubreddit('popular').getControversial({limit: 100, sort: 'relevance'}).reduce((prev, next) => 
					// Only include posts that are not NSFW, with more than 100 comments and that have high score relative to comments
			next.over_18 || next.score < next.num_comments || next.num_comments < 100 ? prev : [...prev, mapPost(next)], [])
		
		
		let list = [...hotList, ...controversialList].sort((b, a) => a.num_comments - b.num_comments)

		// Filter out posts that are already recorded
		const jsondata = fs.readFileSync('./output.jsonl').toString().replace(/\\"/g, '"')
				
		list= list.filter(post => {
			return jsondata.indexOf(post.title) === -1
		})


		// Save new data jsonL file
		if(list.length > 0) {
				fs.open('./output.jsonl', "a", (err, fd)=>{
					if(err){
							console.log(err.message);
					}else{
							fs.write(fd, '\n' + list.map(promptFormat).join('\n'), (err, bytes)=>{
									if(err){
											console.log(err.message);
									}else{
											console.log(bytes +' bytes written');
									}
							})        
					}
			})
		} else {
			console.log('No bytes written');
		}

		// Print to server view
		return render('index.hbs', {postCount: list.length, page: Object.values(list.map(post => formatPost(post))).join('\n')})
	})
	.catch(error => {
		// console.error(error);
		return render('index.hbs', {page: error})
	})
}
