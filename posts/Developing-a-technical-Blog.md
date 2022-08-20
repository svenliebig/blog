# Developing a technical Blog

I noticed that I write a lot of documentation just for myself, because I tend to forget how those nifty little things work or what is the correct way to do `xyz` or how do I configure an `apache2` again etc.

Based on that, I want to put these articles just out in the world, and I was creating my first post on medium.com when I recognized that my code had no syntax highlighting. It annoyed me somehow, and I am sure it would also be possible to upload images or something do something else, search for another web page to publish things. But I could also learn something and create it for myself, like millions other did it. So here I am, documenting the story how I started developing this.

## Choose your Weapon 🗡

Being a Frontend Developer in 2022 should ship with free in deep course in decision making. There are so many ways to create a web page these days. Since I want to use a full stack framework, I had some in mind to choose from:

- Next.js: [https://nextjs.org/](https://nextjs.org/)
- Svelte (Sveltekit): [https://svelte.dev/](https://svelte.dev/)
- Remix: [https://remix.run/](https://remix.run/)
- Nuxt.js [https://nuxtjs.org/](https://nuxtjs.org/)

I developed in `react` and `TypeScript` the last five years of my life. But the projects have been mostly bare bone without any Framework like Next.js or Remix, so I could get some learning’s from this. Besides some very small projects I developed nothing with Svelte or Vue.js so far, but I hear a lot good things about it.

So I decided to do some research, and for me there is one source for this type of research: [https://stackoverflow.com/](https://stackoverflow.com/). I could go there and ask the question “wHiCh FrOnTeNd StAcK sHoUlD i UsE fOr…” and get downvoted to hell, but for now we just look into the raw data:

![Stackoverflow Count Questions by Tag Name](Developing-a-technical-Blog/Untitled.png)

Stackoverflow Count Questions by Tag Name

This Table shows how many questions have been asked grouped by a tag name. You can also view the live data here: [https://data.stackexchange.com/stackoverflow/query/1628437/count-svelte-remix-next-js-questions](https://data.stackexchange.com/stackoverflow/query/1628437/count-svelte-remix-next-js-questions)

Based on that, Next.js is clearly #1 in popularity. Or it is just the most confusing and there is no need to ask so many questions about Svelte and remix. 🤓

The is also the possibility to look for trends: [https://insights.stackoverflow.com/trends?tags=svelte%2Cnext.js%2Cnuxt.js](https://insights.stackoverflow.com/trends?tags=svelte%2Cnext.js%2Cnuxt.js)

![Trends for next,js, nuxt.js & svelte as diagram](Developing-a-technical-Blog/stackoverflow-trends.svg)

Trends for next,js, nuxt.js & svelte as diagram

remix amount of questions are to little to be available as selection for these graphs.

After collecting all the facts I do what I always do, and decide against the facts with my gut! I’ll try to develop that thing in **Svelte**! I really enjoyed my small projects with Svelte, and I would like to have a more in deep understanding of it.

## Which functionalities do I need? 🚁

I would love to have a piece of software where it is possible to login, edit posts in the browser directly, publish them, with different share methods, comments, all that cool stuff. But for the start it has to be something simplified that will not consumed so much time. Later I can discover a lot more things that I want to implement, for now the minimal features are:

- parsing markdown into html
- showing a list of available blog posts
- showing single blog posts and navigate back
- code syntax highlighting

With that, I can write these posts in a for me very convenient way.

## Setup the project! 🏗

Let’s head over to the [SvelteKit Website](https://kit.svelte.dev/) and create a new project!

I just followed the basic instructions, since SvelteKit is in early development, you should double check if these commands are still in use!

```bash
npm create svelte@latest blog
cd blog
yarn install
yarn dev --open
```

I working with the version `2.0.0-next.157` and used the _Skeleton project_ template with TypeScript. I also considered using playwright for testing, but I didn’t want to learn to many things at once for now, I can add it later if I really want to.

![Untitled](Developing-a-technical-Blog/Untitled-1.png)

Also also installed the [Svelte VS Code extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) to have good support in my editor.

## Start developing! 🚀

After the everything is set up, I looked into the project, and immediately regretted that I chose the empty project skeleton, because I like to learn by reading example code, but Okay!

I went back the Svelte web page to get familiar with the [project structure](https://kit.svelte.dev/docs/project-structure) that is before me.

### Project Structure

SvelteKit uses a similar approach like other frameworks, if you developed a bigger react application without any framework behind, you will most probably have two files:

- `routes.js` - a file that contains all routes available in your project, like `/post/:id` etc.
- `view.jsx` - a file that matches all these routes, with react-router and map’s them to components

With SvelteKit these `routes` and `mapping` files are not needed, because everything is taken implicitly from the files structure in the `routes` folder. This is especially handy for me, because it takes away these decisions that I needed to do in all these react projects:

- how do I name the folder for the views
- where do I put these `views.jsx` & `routes.js` files
- how do I structure the files in the views etc.

To have a standard here that I need to follow is kind of a relief for me, because I know that all these answers to the questions above changed in every 3rd project. What also makes it extremely hard to switch between projects while maintenance, you always have to remember “Okay how was our approach in this project”. So I really like it to have some standards here!

I create a folder called `posts` and a file called `+page.svelte`:

```bash
src
└── routes/
    └── posts
        └── +page.svelte
```

```html
<!-- /src/routes/posts/+page.svelte -->

<script lang="ts"></script>

<h1>Hello World!</h1>

<style></style>
```

The `+` in front of the filename is not a mistake, it’s the standard that SvelteKit uses! The empty `script` and the `styles` tags will be filled later, but this is the basic file structure of a Svelte component. The `style` you will declared is scoped to that component. The `lang` attribute is telling Svelte that we want to use TypeScript in there.

The filename give SvelteKit the information what this file is going to do, the most interesting for me are currently:

- `+page.svelte` is the component that get rendered when you call that route in the browser
- `+page.ts` (or `+page.js`) is a file that exports a function called `load`, it will be called with some site metadata like parameters before the page is rendered. It is called on the client side (or while server side rendering), so you can do Rest API calls here, but not database actions or interact with the file system. The `data` that you return in that function, will be available in your `+page.svelte` component.
- `+page.server.ts` (or `+page.server.js`) has the same role as the `+page.ts` file, with the small exception that this file is executed on the server. So you can access your database, file system or environment variables here!
- `+layout.svelte` is a component that is rendered before the `+page.svelte` component. I say “_before_” but it actually is rendered “_instead_” of the `+page`, but the `+page` is giving into the `+layout` as children (that’s how it is called in react at least). So you should not forget to render these children with the `<slot />` element that Svelte provides! You can have multiple `+layout`'s, layered in the different directories of your route.

There are many more files, but it should be enough for my current plan. You can read more about in deep about these files and that routing [here](https://kit.svelte.dev/docs/routing).

### Rendering a page

When you start the development server and navigate to `/posts` you will be able to see your page content!

```html
yarn dev --open
```

![Untitled](Developing-a-technical-Blog/Untitled-2.png)

Wuhu! 🎉 We did it. But we want to list all our available “posts” here. So we need to actually load data.

### Getting the data

In the long run, all these things should be in the a database or something similar. But I want faster results here, that’s why I’ll just use the file system for now! I want to define my model and my repository interface first, so I can easily switch from a file system based repository to a database later.

I create these two files in the `lib` directory, which is defined by SvelteKit to be the directory for all your library code:

```bash
src
└── lib/
    ├── models
    │   └─── post.ts
    └── repositories
        └─── postRepository.ts
```

Both will be very simple:

```tsx
// src/lib/models/post.ts

export type Post = {
	name: string
	content: string
}
```

```tsx
import type { Post } from '../models/post'

export interface PostRespository {
	getPost(id: string): Post | null
	getPosts(): Array<Pick<Post, 'name'>>
}
```

We define the function to get a single post (`getPost`) together with the function to get all posts (`getPosts`) here.

Since I want to use the file system and I want to parse markdown, I need to install two things, the `@types` for node.js and a markdown parser, I decided [https://showdownjs.com/](https://showdownjs.com/) looks good:

```bash
yarn add --dev @types/node @types/showdown
yarn add showdown
```

And I create an example markdown file in a directory called `posts` in the root of the project. This maybe is not an ideal location for that, but it’s enough for now!

````markdown
<!-- posts/my-first-post.md -->

# My first post

This is html

```html
<h1>hello world</h1>
```
````

This is javascript

```js
console.log('hello world')
```

This is `inline-code`.

This is a list:

- of
- different
- things

````

Let’s implement the repository, aka the file reader:

```tsx
// src/lib/repositories/filePostRepository.ts

import { readdirSync } from 'fs'
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
		return null
	},
}
````

What happens here:

- we are reading all the files in the `posts` directory, which I would normally do with something like `__dirname` & `path.resolve`. But the example here works for now.
- filter out every file that does not end on `.md`
- lastly, mapping all filenames into a `Pick<Post, "name">>` object

To provide our page with this data, we need to add a file with a load function, we need this load function to be executed on the server, that why we create a `+page.server.ts` file in `/src/routes/posts`:

```tsx
// src/routes/posts/+page.server.ts

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
```

The `import('./$types').PageServerLoad` is extremely cool, it is generated to the folder `.svelte-kit/types/src/routes/posts/$types.d.ts` by SvelteKit. I was not able to find out how they are able to convince the TypeScript compiler that `/$types` is leading to the correct repositories, it’s definitely very cool and advanced black voodoo! The types are only created if you are running the `yarn dev` command ofcourse.

### Displaying the posts as list

Okay currently the types does not do much for us, you are right. But let’s see what happens when we alter our `+page.svelte` to receive and use the given data:

```html
<!-- src/routes/posts/+page.svelte -->

<script lang="ts">
	export let data: import('./$types').PageData
</script>

<h1>Posts</h1>

<ul>
	{#each data.posts as post}
	<li>
		<a href="/posts/{post.name}">{post.name}</a>
	</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
	}

	li {
		list-style: none;
	}
</style>
```

You will notice, the `data` is already implicitly types by the generated `PageData` type! I really like that, less to import and typed data.

Navigating to `/posts` again will now result in:

![Untitled](Developing-a-technical-Blog/Untitled-3.png)

Another step done! We are able to see what markdown files are in that directory. But clicking on the link still results in an error:

![Untitled](Developing-a-technical-Blog/Untitled-4.png)

So we have to implement this as well!

### Displaying single posts

We need the name of the post (which is in our URL) and send it somehow to our repository, so we can find it in our posts directory.

To get this information, SvelteKit has the standard to name a directory `[slug]`, it is a placeholder for any parameter you might want to have in your URL path.

We create a few more files and the `[slug]` directory underneath the `posts` directory:

```bash
src
└── routes/
    └── posts
        └── [slug]
             ├── +layout.svelte
             ├── +page.server.ts
             └── +page.svelte
```

```html
<!-- src/routes/posts/[slug]/+layout.svelte

<div class="post-container">
	<slot />
</div>

<style>
	.post-container {
		max-width: 46rem;
		padding: 0 2rem;
		margin: 0 auto;
	}
</style>
```

We just add a simple layout here, the `<slot />` will render the `+page.svelte` component.

Let’s add the page:

```html
<!-- src/routes/posts/[slug]/+page.svelte

<script lang="ts">
	export let data: import('./$types').PageData
</script>

{@html data.content}
```

Not much to see here, we just want to render the `content` property of our `data` as actual HTML, that what that `@html` tag means! You can read more about this and other tags here: [https://svelte.dev/docs#template-syntax-html](https://svelte.dev/docs#template-syntax-html)

```tsx
// src/routes/posts/[slug]/+page.server.ts

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
```

A straight forward implementation, but our repository current has a default implementation for `getPost`, so we need to adjust this and add an implementation for this:

```tsx
// src/lib/repositories/filePostRepository.ts

import { existsSync, readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { Converter } from 'showdown'
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
```

Now we are all set. Let’s run the development server again with `yarn dev` if it is no running , go to `/posts` and click on the link to the post. There it is!

![Untitled](Developing-a-technical-Blog/Untitled-5.png)

We rendered the markdown as HTML! There is no syntax highlighting 😅.

### Code highlighting

For that we will use [https://highlightjs.org/](https://highlightjs.org/), a library that was made exactly for this.

We will just add the `cdn`'s into the `app.html` file and create a lifecycle method that calls executes the function to highlight our code, but on the long run we should import that lib as node module into our `package.json`!

```html
<!-- src/app.html -->

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width" />

		<link
			rel="stylesheet"
			href="https://unpkg.com/@highlightjs/cdn-assets@11.6.0/styles/default.min.css"
		/>
		<script src="https://unpkg.com/@highlightjs/cdn-assets@11.6.0/highlight.min.js"></script>

		%sveltekit.head%
	</head>

	<body>
		<div>%sveltekit.body%</div>
	</body>
</html>
```

These imports will add the function for highlighting globally to the `window` object. We need to give TypeScript this information in the `app.d.ts` by adding the function `hljs` to the `Window` interface:

```tsx
// src/app.d.ts

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
}

interface Window {
	hljs: {
		highlightElement(el: Element): void
	}
}
```

Now we can update our `+page.svelte` with the code to highlight our rendered code properly!

```html
<!-- src/routes/posts/[slug]/+page.svelte -->

<script lang="ts">
	import { onMount } from 'svelte'

	export let data: import('./$types').PageData

	onMount(async () => {
		document.querySelectorAll('pre code').forEach((el) => {
			window.hljs.highlightElement(el)
		})
	})
</script>

{@html data.content}
```

The `onMount` function will run after the component first render to the DOM, which means you can access the elements and modifiy them.

If we run our server and navigate to our post again, we will finally see the result:

![Untitled](Developing-a-technical-Blog/Untitled-6.png)

Yay! 🎉 Code highlighting. We did it!

### Final words

If you came so far, thank you very much for reading my very first post about how I started developing this thing. 🙂 I hope some of you found some helpful information here, feel free to reach out to me every time! Maybe I’ll do more of these to update on further development.

The code for this is available on Github: [https://github.com/svenliebig/blog/tree/e6b1363ffcdf01aa456d785a99f7ecf2ea2092f3](https://github.com/svenliebig/blog/tree/e6b1363ffcdf01aa456d785a99f7ecf2ea2092f3), the link contains the commit hash to the exact state of the code that this post is referring to!

Ciao 👋
