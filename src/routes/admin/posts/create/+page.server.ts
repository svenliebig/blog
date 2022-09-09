import { Post } from '$lib/models/post'
import { postRepository } from '$lib/repositories/postRepository'
import { error } from '@sveltejs/kit'

export const load: import('./$types').PageServerLoad = async function () {
	try {
		const posts = await postRepository.getPosts()
		console.log(posts)
		return {
			posts: posts
		}
	} catch (e) {
		console.log('WHAT', e)
		throw error(404, 'Not found')
	}
}

export const POST: import('./$types').Action = async function ({ request }) {
	const values = await request.formData()

	const content = values.get('content')
	const title = values.get('title')

	if (!content || typeof content !== 'string') {
		console.log('return err')
		return {
			status: 403,
			errors: {
				content: 'Should have content.'
			}
		}
	}

	if (!title || typeof title !== 'string') {
		return {
			status: 403,
			errors: {
				title: 'Should have title.'
			}
		}
	}

	// setHeaders({})

	const post = await postRepository.createPost(new Post(title, content))

	return {
		// status: 200,
		// values: { post }
		location: '/admin/posts/create' // shoul be the new post
	}
}
