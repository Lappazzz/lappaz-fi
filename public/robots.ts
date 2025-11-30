import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
        userAgent: '*',
        allow: '/',
        },
        sitemap: 'https://lappaz.fi/sitemap.xml',
        host: 'https://lappaz.fi',
    };
}