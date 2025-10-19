import { getProductBySlug, getProductVariations } from '@/lib/api/api';
import ProductDetailsClient from '@/_components/ProductDetailsClient';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  let variations: any[] = [];
  if (product.type === 'variable') {
    // ✅ one request instead of many
    variations = await getProductVariations(product.id);
  }

  return <ProductDetailsClient product={product} variations={variations} />;
}
