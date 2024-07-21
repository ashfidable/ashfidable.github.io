import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'

const parser = new MarkdownIt()

export async function GET(context: APIContext) {
	const posts = await getCollection('posts', ({ id }) => {
		return id.startsWith('blog/')
	})
	const snippets = await getCollection('posts', ({ id }) => {
		return id.startsWith('snippets/')
	})

	return rss({
		title: "Ashfid's Posts",
		description:
			'I’m a Software Engineer and Programmer. This cozy corner is for sharing my thoughts, tutorials, and much more. Welcome to my digital garden.',
		site: context.site ?? 'localhost:4321',
		items: [
			...posts.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				tags: post.data.tags.join(', '),
				link: `${post.slug}`,
				pubDate: post.data.published_time,
				content: sanitizeHtml(parser.render(post.body), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
				})
			})),
			...snippets.map((snippet) => ({
				title: snippet.data.title,
				description: snippet.data.description,
				tags: snippet.data.tags.join(', '),
				link: `${snippet.slug}`,
				pubDate: snippet.data.published_time,
				content: sanitizeHtml(parser.render(snippet.body), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
				})
			}))
		],
		// (optional) inject custom xml
		customData: `<language>en-us</language>`
	})
}
