import { postRepository } from '$lib/repositories/postRepository'
import { error } from '@sveltejs/kit'

export const load: import('./$types').PageServerLoad = async function ({ params }) {
	if (params.slug) {
		const post = await postRepository.getPost(params.slug)

		if (post) {
			return post
		}
	}

	throw error(404, 'Not found')
}
