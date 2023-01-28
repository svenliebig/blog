import type { Post } from '$lib/models/post'
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
				content: html,
				...getDescriptionById(id)
			}
		} else {
			return null
		}
	}
}

function getDescriptionById(id: string): Pick<Post, 'description' | 'keywords'> {
	switch (id) {
		case 'Developing-a-technical-Blog':
			return {
				description: 'How to write a technical blog based on typescript, svelte & markdown files.',
				keywords: 'svelte, markdown, technical blog, typescript'
			}
		case 'Installing-and-Configuring-Apache2-on-Debian-11-(Bullseye)':
			return {
				description: 'How to install and configure apache2 on debian 11 bullseye.',
				keywords: 'apache2, debian 11, bullseye, configure, install'
			}
		case 'Create-and-Manage-Users-in-Unix':
			return {
				description:
					'How to create and manage user in unix, give them specific rights and sudo powers for specific commands.',
				keywords: 'unix, user management, rights, sudo, privilege, groups'
			}
		default:
			return {
				description: `A technical blog entry about ${id.replace(/-/g, ' ')}.`,
				keywords: 'HTML, CSS, TypeScript'
			}
	}
}
