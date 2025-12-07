import Image from "next/image";
import Link from "next/link";
import Carousel from "../_components/carousel/carousel";
import { getPopularProducts } from "@/lib/api/api";
import type { WooProduct } from "@/types/woocommerce";

export default async function Home() {
  const categoryImages = [
    { name: "Autotarvikkeet", image: "/images/autotarvikkeet.webp", slug: "autotarvikkeet" },
    { name: "Sim modit", image: "/images/sim-modit.webp", slug: "sim-modit" },
    { name: "Lisämittaritelineet", image: "/images/lisämittaritelineet.webp", slug: "lisamittaritelineet" },
  ];

  const popularProducts: WooProduct[] = await getPopularProducts();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 py-8 space-y-16">
      <section className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Tuotekategoriat</h2>
        <Carousel categories={categoryImages} />
      </section>

      <section className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">Myydyimmät</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularProducts.map((product: WooProduct) => (
            <li
              key={product.id}
              className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <Link href={`/tuote/${product.slug}`} className="flex flex-col items-center p-4">
                <Image
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0].src
                      : "/images/Tuotekuva-tulossa.webp"
                  }
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-md mb-4"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <h2 className="text-xl font-semibold text-center">{product.name}</h2>
                <p className="text-lg text-gray-700">{product.price} €</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
