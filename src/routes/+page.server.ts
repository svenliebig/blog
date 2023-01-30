import { filePostRespository } from '$lib/repositories/filePostRepository'
import { error } from '@sveltejs/kit'

export const load: import('./$types').PageServerLoad = function () {
	try {
		return {
			posts: filePostRespository.getPosts()
		}
	} catch (e) {
		throw error(404, 'Not found')
	}
}
