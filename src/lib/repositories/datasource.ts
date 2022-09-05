import { Post } from '$lib/models/post'
import { DataSource, Repository } from 'typeorm'

const db = new DataSource({
	type: 'sqlite',
	database: 'src/lib/repositories/db.sqlite',
	synchronize: true,
	logging: true,
	entities: [Post],
	subscribers: [],
	migrations: []
})

export let posts: Repository<Post>

db.initialize().then(() => {
	posts = db.getRepository(Post)
})
