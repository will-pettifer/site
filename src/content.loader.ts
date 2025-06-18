export interface Post {
    slug: string;
    title: string;
    date: string;
    body: string;
    url: string;
}

export async function getPosts(): Promise<Post[]> {

    const posts = await import.meta.glob('./content/**/*.md', { eager: true });

    return Object.entries(posts).map(([filepath, post]: [string, any]) => {
        const slug = filepath
            .replace('./content/', '')
            .replace('.md', '');

        return {
            slug,
            title: post.frontmatter?.title || slug.split('/').pop(),
            date: post.frontmatter?.date || '1970-01-01',
            body: post.compiledContent(),
            url: '/site/' + slug
        };
    });
}

export async function getPostsMetadata(): Promise<Omit<Post, 'body'>[]> {
    const posts = await getPosts();
    return posts.map(({ body, ...metadata }) => metadata);
}
