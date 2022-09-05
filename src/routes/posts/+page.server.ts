import { postRepository } from '$lib/repositories/postRepository'
import { error } from '@sveltejs/kit'

export const load: import('./$types').PageServerLoad = async function () {
	try {
		return {
			posts: await postRepository.getPosts()
		}
	} catch (e) {
		throw error(404, 'Not found')
	}
}
