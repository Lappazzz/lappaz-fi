export default function AboutUs() {
  return (
    <div className="px-4 py-6 max-w-full lg:max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-lg text-gray-700 mb-4">
          <b>Lappaz.fi</b> on vuonna 2023 perustettu verkkokauppa, joka erikoistuu 3D-tulostettuihin tuotteisiin. Valikoimastamme löytyy monenlaisia tuotteita, kuten rattiadaptereita ja mittaritelineitä. Kaikki tuotteemme suunnittelemme ja valmistamme itse, ellei toisin mainita. Meille on kerääntynyt kokemusta ja asiantuntemusta 3D-tulostuksesta jo vuodesta 2017.
        </p>
        <p className="text-lg text-gray-700">
          Valmistamme kaikki tuotteemme omalla 3D-tulostimellamme Jyväskylässä. Jos tarvitset tietyn tuotteen, ole rohkeasti yhteydessä meihin, niin selvitämme, onko sen valmistaminen meidän kauttamme mahdollista. Ennen tuotteen valmistusta sovimme kanssasi kiinteän hinnan, jolloin lopullisessa hinnassa ei tule yllätyksiä.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row mb-8">
        <div className="flex-1 mb-6 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Yhteystiedot</h1>
          <a href="/ota-yhteytta" className="text-blue-500 hover:underline mb-4 block font-bold">Ota Yhteyttä</a>
          <p className="text-lg text-gray-700">Lappaz</p>
          <p className="text-lg text-gray-700">Y-tunnus: 3349460-9</p>
          <p className="text-lg text-gray-700">Harjukatu 12</p>
          <p className="text-lg text-gray-700">40100, Jyväskylä</p>
        </div>

        {/* Google Map Embed */}
        <div className="flex-1 md:ml-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Sijaintimme</h1>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29729.78541648138!2d25.736610624069165!3d62.24360248384533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46857416011e385f%3A0x5fde289f68807cdb!2sHarjukatu%2012%2C%2040100%20Jyv%C3%A4skyl%C3%A4!5e0!3m2!1sfi!2sfi!4v1719925075408!5m2!1sfi!2sfi"
            width="100%" height="300" style={{ border: 0 }} allowFullScreen="" loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  );
}
