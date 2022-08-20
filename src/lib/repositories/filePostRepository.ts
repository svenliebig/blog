import { existsSync, readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'

import showdown from 'showdown'
const { Converter } = showdown

import type { PostRespository } from './postRepository'

export const filePostRespository: PostRespository = {
	getPosts() {
		try {
			const files = readdirSync('posts')
			const markdownFiles = files.filter((file) => file.endsWith('.md'))
			return markdownFiles.map((file) => {
				return {
					name: file.replace(/\.md$/, '')
				}
			})
		} catch (e) {
			// TODO error handling
			return []
		}
	},
	getPost(id) {
		const converter = new Converter()

		const path = resolve('posts', `${id}.md`)
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
