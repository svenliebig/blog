import { Post } from '$lib/models/post'

import showdown from 'showdown'
import { posts } from './datasource'
const { Converter } = showdown

export interface PostRespository {
	getPost(id: string): Promise<Post | null>
	getPosts(): Promise<Array<Pick<Post, 'title'>>>
	createPost(post: Post): Promise<Post>
	deletePost(id: string): Promise<void>
}

export const postRepository: PostRespository & { createPost: (post: Post) => Promise<Post> } = {
	getPost: async function (name: string): Promise<Post | null> {
		const post = await posts.findOne({ where: { title: name } })
		const converter = new Converter()
		if (post) {
			const html = converter.makeHtml(post.content)
			return new Post(post.title, html)
		} else {
			return null
		}
	},
	getPosts: async function (): Promise<Array<Pick<Post, 'title'>>> {
		return await posts.find({ select: { title: true } })
	},
	createPost: async function (post: Post): Promise<Post> {
		try {
			return posts.save(post)
		} catch (e) {
			console.error(e)
			throw e
		}
	},
	async deletePost(id) {
		await posts.delete({ title: id })
	}
}
