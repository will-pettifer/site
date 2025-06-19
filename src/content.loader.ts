export interface Post {
    slug: string;
    title: string;
    date: Date;
    body: string;
    url: string;
}

export async function getPosts(): Promise<Post[]> {

    const posts = import.meta.glob('./content/**/*.md', { eager: true });

    return Object.entries(posts).map(([filepath, post]: [string, any]) => {
        const slug = filepath
            .replace('./content/', '')
            .replace('.md', '');
        const date = new Date(post.frontmatter?.date)
        date.setMonth(date.getMonth() + 1)
        return {
            slug,
            title: post.frontmatter?.title || slug.split('/').pop(),
            date,
            body: post.compiledContent(),
            url: '/site/' + slug
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostsMetadata(): Promise<Omit<Post, 'body'>[]> {
    const posts = await getPosts();
    return posts.map(({ body, ...metadata }) => metadata);
}
