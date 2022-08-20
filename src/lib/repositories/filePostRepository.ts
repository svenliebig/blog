import { existsSync, readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { Converter } from 'showdown'
import type { PostRespository } from './postRepository'

export const filePostRespository: PostRespository = {
	getPosts() {
		try {
			const files = readdirSync('posts')
			const markdownFiles = files.filter((file) => file.endsWith('.md'))
			console.log(markdownFiles)
			return markdownFiles.map((file) => {
				return {
					name: file
				}
			})
		} catch (e) {
			console.log(e)
			// TODO error handling
			return []
		}
	},
	getPost(id) {
		const converter = new Converter()

		const path = resolve('posts', `${id.replaceAll(/-/g, ' ')}.md`)
		const exists = existsSync(path)

		if (exists) {
			const markdown = readFileSync(path, 'utf-8')
			const html = converter.makeHtml(markdown)
			return {
				name: id,
				content: html
			}
		} else {
			return null
		}
	}
}
