export interface Post {
    slug: string;
    title: string;
    date: Date;
    body: string;
    url: string;
    order: number;
}

export async function getPosts(): Promise<Post[]> {

    const posts = import.meta.glob('./content/**/*.md', {eager: true});

    return Object.entries(posts).map(([filepath, post]: [string, any]) => {
        const slug = filepath
            .replace('./content/', '')
            .replace('.md', '');
        const date = new Date(post.frontmatter?.date)
        return {
            slug,
            title: post.frontmatter?.title || slug.split('/').pop(),
            date,
            draft: post.frontmatter?.draft || false,
            body: post.compiledContent(),
            url: '/site/' + slug,
            order: post.frontmatter?.order ?? 0
        };
    }).filter(post => {
        return import.meta.env.PROD ? !post.draft : true;
    }).map(({draft, ...post}) => post)
        .sort((a, b) => {
            if (a.order !== b.order) {
                return b.order - a.order;
            }
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
}

export async function getPostsMetadata(): Promise<Omit<Post, 'body'>[]> {
    const posts = await getPosts();
    return posts.map(({body, ...metadata}) => metadata);
}