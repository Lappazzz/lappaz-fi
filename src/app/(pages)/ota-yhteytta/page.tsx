export default function Otayhteytta() {
  return (
    <div className="max-w-4xl mx-auto p-7 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Ota Yhteyttä</h1>
      <div className="text-gray-700 space-y-4 mb-8 p">
        <p className="text-lg">
          Jäikö jokin asia mietityttämään? Eikö sivuilta löytynyt haluamaasi tuotetta? Ota yhteyttä!
        </p>
        <b className="block text-gray-800">Kerrothan tilausnumeron (esimerkiksi #1234), jos asia liittyy tilaukseen</b>
        <p className="mt-2">Lappaz 3349460-9</p>
        <p className="text-blue-600">asiakaspalvelu@lappaz.fi</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <form className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-600">Sähköposti:</label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="note" className="text-sm font-medium text-gray-600">Viesti:</label>
            <textarea
              name="note"
              id="note"
              className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
              required
            ></textarea>
          </div>
          <div className="flex justify-center">
            <input
              type="submit"
              value="Lähetä"
              className="mt-4 py-3 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
