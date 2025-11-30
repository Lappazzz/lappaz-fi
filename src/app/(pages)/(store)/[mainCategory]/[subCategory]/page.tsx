import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/api/api';
import type { WooProduct } from '@/types/woocommerce';

interface Props {
  params: Promise<{ mainCategory: string; subCategory: string }>;
}

export default async function SubCategoryPage({ params }: Props) {
  const { subCategory } = await params;

  const allProducts: WooProduct[] = await getProducts();

  const filtered: WooProduct[] = allProducts.filter((product) =>
    product.categories?.some((cat) => cat.slug === subCategory)
  );

  const toTitle = (slug?: string) =>
    slug?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) ?? '';

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{toTitle(subCategory)}</h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((product: WooProduct) => (
          <li
            key={product.id}
            className="border rounded-lg shadow-md cursor-pointer overflow-hidden transition-shadow duration-200 hover:shadow-lg"
          >
            <Link href={`/tuote/${product.slug}`} className="flex flex-col items-center p-4">
              <Image
                src={product.images?.[0]?.src || '/images/Tuotekuva-tulossa.webp'}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-full object-cover rounded-md mb-4"
                unoptimized 
              />
              <h2 className="text-xl font-semibold text-center">{product.name}</h2>
              <p className="text-lg text-gray-700">{product.price} €</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
