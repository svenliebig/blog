import { filePostRespository } from '$lib/repositories/filePostRepository'
import { error } from '@sveltejs/kit'

export const load: import('./$types').PageServerLoad = function ({ params }) {
	if (params.slug) {
		const post = filePostRespository.getPost(params.slug)

		if (post) {
			return post
		}
	}

	throw error(404, 'Not found')
}
