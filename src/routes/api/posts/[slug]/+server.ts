import { postRepository } from '$lib/repositories/postRepository'

export const DELETE: import('./$types').RequestHandler = async function ({ params }) {
	try {
		postRepository.deletePost(params.slug)
		return new Response(params.slug, { status: 200 })
	} catch (e) {
		console.error(e)
		return new Response('Uknown Error', { status: 500, statusText: `${e}` })
	}
}
