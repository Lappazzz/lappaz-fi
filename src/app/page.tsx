import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Hero Section */}
      <header className="flex flex-col items-center text-center bg-blue-600 text-white p-8 w-full">
        <h1 className="text-4xl font-bold mb-4">Welcome to Lappaz!</h1>
        <p className="text-lg mb-6">Your go-to place for 3D printed products and more.</p>
        
        {/* Call to Action */}
        <a href="/shop" className="px-6 py-3 bg-blue-800 text-white text-lg rounded-md hover:bg-blue-900 transition duration-300">
          Explore Our Products
        </a>
      </header>

      {/* Image Section */}
      <section className="mt-12 w-full">
        <div className="relative w-full h-96">
          <Image
            src="/images/landing-image.jpg"  // Make sure to replace this with your image path
            alt="3D Printed Products"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="w-full py-12 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-4">About Us</h2>
        <p className="text-lg max-w-3xl mx-auto px-4">
          Lappaz is dedicated to providing high-quality 3D printed products for personal and business use. With a focus on precision and customer satisfaction, we offer a wide range of custom designs and solutions tailored to meet your needs.
        </p>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-600 text-white w-full py-4 text-center">
        <p>&copy; 2025 Lappaz. All rights reserved.</p>
      </footer>
    </div>
  );
}
