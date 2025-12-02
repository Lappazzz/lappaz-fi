import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
        userAgent: '*',
        allow: '/',
        },
        sitemap: 'https://beta.lappaz.fi/sitemap.xml',
        host: 'https://beta.lappaz.fi',
    };
}