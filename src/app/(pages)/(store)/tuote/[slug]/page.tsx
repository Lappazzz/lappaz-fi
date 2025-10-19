import { getProductBySlug, getProductVariations } from '@/lib/api/api';
import ProductDetailsClient from '@/_components/ProductDetailsClient';
import type { WooVariation, Product } from '@/types/woocommerce';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    throw new Error('Product not found');
  }

  let variations: WooVariation[] = [];
  if (product.type === 'variable') {
    variations = await getProductVariations(product.id);
  }

  const productForClient: Product = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: String(product.price), 
    type: product.type === 'variable' ? 'variable' : 'simple',
    images: product.images?.map(img => ({ src: img.src })) || [],
    categories: product.categories?.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
  };

  return <ProductDetailsClient product={productForClient} variations={variations} />;
}
