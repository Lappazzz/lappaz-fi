export default function ProductPageLoading() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
        {/* Left side: image placeholder */}
        <div>
          <div className="w-full h-[500px] bg-gray-300 rounded-md mb-4"></div>
          <div className="flex gap-4 mt-4 overflow-x-auto">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="w-24 h-24 bg-gray-300 rounded-md"></div>
            ))}
          </div>
        </div>

        {/* Right side: text placeholders */}
        <div className="flex flex-col gap-4">
          <div className="w-3/4 h-8 bg-gray-300 rounded"></div>
          <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
          <div className="w-full h-24 bg-gray-300 rounded"></div>
          {[...Array(2)].map((_, idx) => (
            <div key={idx}>
              <div className="w-1/3 h-5 bg-gray-300 rounded mb-2"></div>
              <div className="w-full h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom description placeholder */}
      <div className="mt-12 space-y-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="w-full h-4 bg-gray-300 rounded"></div>
        ))}
        <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
