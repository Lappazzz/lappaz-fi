export default function ProductLoading() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, index) => (
        <li
          key={index}
          className="border rounded-lg p-4 shadow-md animate-pulse flex flex-col items-center"
        >
          <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
          <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
          <div className="w-1/2 h-5 bg-gray-300 rounded"></div>
        </li>
      ))}
    </ul>
  );
}
