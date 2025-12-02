import { notFound } from 'next/navigation';
import type { ComponentProps } from 'react';
import { getProductBySlug, getProductVariations } from '@/lib/api/api';
import ProductDetailsClient from '@/_components/ProductDetailsClient';
import type { WooVariation } from '@/types/woocommerce';

type ProductDetailsProps = ComponentProps<typeof ProductDetailsClient>;
type ProductDetailsProduct = ProductDetailsProps['product'];
type ProductDetailsVariations = NonNullable<ProductDetailsProps['variations']>;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  let wooVariations: WooVariation[] = [];
  if (product.type === 'variable') {
    wooVariations = await getProductVariations(product.id);
  }


  const normalizedProduct: ProductDetailsProduct = {
    ...product,
    price:
      product.price !== undefined && product.price !== null
        ? String(product.price)
        : undefined,
    attributes: product.attributes?.map((attr) => ({
      name: attr.name,
      variation: Boolean(attr.variation),
      options: attr.options ?? [],
    })),
  };

  const normalizedVariations: ProductDetailsVariations = wooVariations.map(
    (v) => ({
      ...v,
      price: String(v.price),
    })
  );

  return (
    <ProductDetailsClient
      product={normalizedProduct}
      variations={normalizedVariations}
    />
  );
}
