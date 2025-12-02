import{ useState, useMemo } from 'react';

// ======================================================
// DATA STORAGE (Ported from Python)
// ======================================================

const BRANDS: Record<string, string[]> = {
  "Eileen Grace": ["eileengraceindonesia"],
  "Mamaway": ["mamawayid"],
  "SHRD": ["shrdidn", "shrdessence", "shrdredginseng"],
  "Miss Daisy": ["missdaisyindonesia", "missdaisyid"],
  "Polynia": ["polyniaid", "polyniaacne"],
  "CHESS": ["chessbodyshaper"],
  "Cleviant": ["cleviantofficial", "cleviantmakeup", "cleviantbase"],
  "Mosseru": ["mosseruofficial", "mosserubodytoner", "mosseruid"],
  "Evoke": ["evokeindonesia", "evokeindo"],
  "Dr. Jou": ["drjoufacialcare", "drjouindonesia"],
  "Mirae": ["miraeindonesia", "miraeskincare", "miraevitaminc"],
  "Swissvita": ["swissvitaid"],
  "G-Belle": ["gbelleindonesia", "gbelleidn"],
  "Past Nine": ["pastnineofficial"],
  "Nutri & Beyond": ["nutribeyondindonesia", "nutribeyondid"],
  "Ivy & Lily": ["ivylilyofficial", "ivylilyessence", "ivylilyindonesia"],
  "Naruko": ["narukoindonesia"],
};

const PRODUCTS: Record<string, Record<string, string>> = {
  "Eileen Grace": {
    "RJM": "https://shopee.co.id/EILEEN-GRACE-Moisturize-Rose-Jelly-Mask-300-ml-Masker-Wajah-Jerawat-Bruntus-Bopeng-Bekas-Jerawat-Kemerahan-Skin-Barrier-Mencerahkan-Melembapkan-i.33221984.460504215",
    "BJM": "https://shopee.co.id/EILEEN-GRACE-Deep-Cleansing-Black-Jelly-Mask-300-ml-Masker-Wajah-Komedo-Pori-Kulit-Berminyak-Chicken-skin-Gentle-exfoliation-Mencerahkan-i.33221984.460504210"
  },
  "Mamaway": {
    "Korset": "https://shopee.co.id/Mamaway-FAST-SLIM-Antibakteri-Aman-untuk-Caesar-Korset-Pelangsing-Pasca-Melahirkan-Nano-Bamboo-i.134522124.2026362507"
  },
  "SHRD": {
    "PC": "https://shopee.co.id/SHRD-Protein-Cream-50ml-80ml-Moisturizer-Vitamin-Rambut-Hair-Care-Rambut-Ngembang-Kering-Kusut-i.167106407.3606884214",
    "Red Ginseng": "https://shopee.co.id/SHRD-Bundle-Paket-Atasi-Rambut-Rontok-dan-Patah-Red-Ginseng-Shampoo-Hair-Essence-Sisir-Anti-Kusut-Tipis-Rontok-Kusut-Patah-i.167106407.5816867915",
    "SHRD Essence": "https://shopee.co.id/SHRD-Bundle-Paket-Atasi-Rambut-Rontok-dan-Patah-Red-Ginseng-Shampoo-Hair-Essence-Sisir-Anti-Kusut-Tipis-Rontok-Kusut-Patah-i.167106407.5816867915"
  },
  "Miss Daisy": {
    "Shampoo": "https://shopee.co.id/MISS-DAISY-French-Perfume-Shampoo-Anti-Ketombe-Rontok-Lepek-Berminyak-Gentle-Shampoo-BPOM-500ml-i.332381969.9004199542",
    "Hair Mask - Peony": "https://shopee.co.id/Miss-Daisy-French-Perfume-Hair-Mask-Peony-Amber-Hairmask-Rambut-Halus-Mengkilap-Wangi-Tahan-Lama-Hit-Protection-Hair-Mask-BPOM-i.332381969.3965562564",
    "Hair Mask - Blackcurrant": "https://shopee.co.id/Miss-Daisy-French-Perfume-Hair-Mask-Blackcurrant-Vanilla-Sugar-Hairmask-Rambut-Halus-Mengkilap-Wangi-Tahan-Lama-Hit-Protection-Hair-Mask-BPOM-i.332381969.9100097492",
    "Hair Mask - Rose": "https://shopee.co.id/Miss-Daisy-French-Perfume-Hair-Mask-Rose-Oud-Hairmask-Rambut-Halus-Mengkilap-Wangi-Tahan-Lama-Hit-Protection-Hair-Mask-BPOM-i.332381969.7565425382"
  },
  "Polynia": {
    "Pomegranate": "https://shopee.co.id/POLYNIA-Pomegranate-Revitalizing-Face-Mask-Masker-Anti-Aging-Pudarkan-Kerutan-Garis-Halus-Samarkan-Flek-Hitam-BPOM-i.832362926.18734566734",
    "Orange": "https://shopee.co.id/POLYNIA-Orange-Brightening-Face-Mask-Samarkan-Bekas-Jerawat-Masker-Vitamin-C-Rawat-Jerawat-Melembabkan-Wajah-BPOM-i.832362926.18734565021"
  },
  "CHESS": {
    "Shapewear - Pink M": "https://shopee.co.id/CHESS-Bodyshaper-M-Black-2x-LEBIH-CEPAT-LANGSING-Shapewear-(Tanpa-Tulang-Kawat)-Anti-Gatal-Ruam-i.942271012.18473486317",
    "Shapewear - Pink L": "https://shopee.co.id/CHESS-Bodyshaper-L-Black-2x-LEBIH-CEPAT-LANGSING-Shapewear-(Tanpa-Tulang-Kawat)-Anti-Gatal-Ruam-i.942271012.23924811709",
    "Shapewear - Pink S": "https://shopee.co.id/CHESS-Bodyshaper-S-Baby-Pink-2x-LEBIH-CEPAT-LANGSING-Shapewear-(Tanpa-Tulang-Kawat)-Anti-Gatal-Ruam-i.942271012.19585742888",
    "Pants - S": "https://shopee.co.id/CHESS-Bodyshaper-with-Slimming-Pants-S-Black-2x-LEBIH-CEPAT-LANGSING-Shapewear-(Tanpa-Tulang-Kawat)-Anti-Gatal-Ruam-i.942271012.28285735326",
    "Pants - M": "https://shopee.co.id/CHESS-Bodyshaper-with-Slimming-Pants-M-Black-2x-LEBIH-CEPAT-LANGSING-Shapewear-(Tanpa-Tulang-Kawat)-Anti-Gatal-Ruam-i.942271012.25844877195",
    "Pants - L": "https://shopee.co.id/CHESS-Bodyshaper-with-Slimming-Pants-L-Black-2x-LEBIH-CEPAT-LANGSING-Shapewear-(Tanpa-Tulang-Kawat)-Anti-Gatal-Ruam-i.942271012.27935761342"
  },
  "Cleviant": {
    "Glazy Tint": "https://shopee.co.id/CLEVIANT-Liptint-Crystal-Glazy-Tint-Cover-Bibir-Gelap-Lip-Stain-Transferproof-Melembabkan-Bibir-Gelap-Tahan-Lama-Ringan-Waterproof-2-5gr-i.1073691990.42905191825",
    "Lip Pudding": "https://shopee.co.id/CLEVIANT-4-in-1-Juicy-Lip-Pudding-Tinted-Lip-balm-Lip-treatment-Lip-tint-with-UV-filter-Lip-gloss-Bibir-kering-jadi-lembap-Pelembab-bibir-Berwarna-Lip-Butter-Balm-Lip-Moisturizer-Melting-Balm-Pot-i.1073691990.26365950474",
    "Contour": "https://shopee.co.id/CLEVIANT-NEW-Contour-Lasting-Serum-Sculpt-Contour-2-in-1-Aplikator-Brush-Face-Contour-Seamless-Liquid-Contour-Hasil-Natural-Bronzer-i.1073691990.41372069159",
    "Concelaer": "https://shopee.co.id/CLEVIANT-NEW-Concealer-Panthenol-All-Day-Cover-Concealer-Medium-to-High-Coverage-Tekstur-Ringan-Melembapkan-Tidak-dempul-Tidak-geser-Creamy-Make-Up-i.1073691990.40167511676",
    "Corrector": "https://shopee.co.id/CL%C3%89VIANT-NEW-Corrector-Panthenol-All-Day-Corrector-Netralkan-Kemerahan-Cover-Acne-Samarkan-Kantung-Mata-Gelap-Blur-Dark-Spot-Dark-Circle-i.1073691990.40818401579",
    "Mascara": "https://shopee.co.id/CLEVIANT-NEW-Mascara-Anti-Gravity-Iron-Lash-i.1073691990.41422657439"
  },
  "Mosseru": {
    "Brightening Serum": "https://shopee.co.id/MOSS%C3%88RU-3-Tranexamic-Bright-Booster-Serum-Tranexamic-Acid-Niacinamide-Brightening-Serum-Menenangkan-kulit-Kemerahan-Pudarkan-Flek-Melasma-Serum-Bekas-Jerawat-Menghidrasi-kulit-Meratakan-warna-kulit-Memudarkan-bekas-je-i.1073676847.21793052172",
    "Body Toner": "https://shopee.co.id/MOSSERU-AHA-8-BHA-2-Dead-Skin-Removal-Body-Toner-Angkat-Set-Kulit-Mati-Bersihkan-Pori-Mencerahkan-Badan-Membantu-Melembabkan-Kulit-i.1073676847.26122544795",
    "Body Retinol": "https://shopee.co.id/MOSS%C3%88RU-Retinol-Power-Duo-Wrinkle-Treatment-Krim-Retinol-Anti-Aging-Anti-Keriput-Atasi-Kerutan-Garis-Halus-Melembabkan-Kulit-Memudarkan-Garis-Halus-i.1073676847.29375390840",
    "Royal Jelly": "https://shopee.co.id/-NEW-LAUNCH-Moss%C3%A8ru-Royal-Jelly-Body-Cream-Body-Butter-170gr-Pelembap-Badan-Anti-Aging-Body-Serum-Body-Lotion-Brightening-Lotion-Hand-Body-Body-Care-i.1073676847.26189623267"
  },
  "Evoke": {
    "Coastal Journey": "https://shopee.co.id/EVOKE-Body-Wash-Coastal-Journey-Sabun-Mandi-Sabun-Koreng-Luka-Kering-Gatal-Kulit-Sensitif-(300ml)-i.1201531553.25617106663",
    "Afternoon Teahouse": "https://shopee.co.id/EVOKE-Body-Wash-Afternoon-Teahouse-Sabun-Mandi-Lipatan-Gelap-Kulit-Kering-Gatal-Luka-Basah-(300ml)-READY-STOCK-i.1201531553.24117101707"
  },
  "Dr. Jou": {
    "Cleansing Whip": "https://shopee.co.id/Dr.-JOU-Gentle-Cleansing-Whip-(Facial-Wash)-Hyaluronic-Acid-Moisturizing-Foaming-Whip-145ml-Samarkan-Kerutan-Garis-Halus-Samarkan-Flek-Hitam-BPOM-i.1279626608.25532410824"
  },
  "Mirae": {
    "Sonic Cleanser": "https://shopee.co.id/MIRAE-Facial-Sonic-Cleansing-Device-Pembersih-Wajah-Pembersih-Wajah-Elektrik-Jerawat-Kulit-Kusam-Kulit-Kendur-Komedo-Bekas-Jerawat-Bruntusan-Deep-Cleansing-Pembersih-Wajah-Silikon-Tahan-Air-Alat-Pembersih-Wajah-i.1285980982.27853701282",
    "Face Wash": "https://shopee.co.id/MIRAE-Facial-Cleanser-120-ml-Anti-Aging-Sabun-Cuci-Muka-Facial-Wash-Sabun-Pembersih-Wajah-Ultra-Firming-Solution-i.1285980982.27371201322",
    "Lifting Serum - 30ml": "https://shopee.co.id/MIRAE-Retinol-Lifting-Serum-30ml-Anti-Wrinkle-Atasi-Kerutan-Mencerahkan-Wajah-Mengencangkan-Wajah-Ultra-Firming-Solution-Retinol-Serum-MIRAE-i.1285980982.40218679402",
    "Lifting Cream - 50ml": "https://shopee.co.id/MIRAE-Retinol-Lifting-Cream-50ml-Kulit-Kusam-Anti-Aging-Kulit-Kendur-Melembabkan-Wajah-Ultra-Firming-Solution-Retinol-Cream-i.1285980982.26321193718",
    "Cica Essence - 30ml": "https://shopee.co.id/MIRAE-Vitamin-C-CICA-Extra-Brightening-Essence-30ml-Kulit-Kusam-Jerawat-Noda-Hitam-Bekas-Jerawat-Flek-Hitam-Bruntusan-Kulit-Kemerahan-Mencerahkan-Kulit-Glowing-i.1285980982.26172955161"
  },
  "Swissvita": {
    "Dark Spot": "https://shopee.co.id/Swissvita-Dark-Spot-Correcting-Serum-15gr-Noda-gelap-Flek-hitam-Bekas-Jerawat-PIH-Warna-Kulit-Tidak-Merata-Alcohol-Free-Fragrance-Free-i.29252724.390512881",
    "All Use Serum": "https://shopee.co.id/Swissvita-All-Use-Skin-Serum-50gr-Anti-Aging-Kusam-Garis-halus-Kerutan-Kulit-Kering-Kulit-Sensitif-Perkuat-Skin-Barrier-Fragrance-Free-Alcohol-Free-i.29252724.1067013033",
    "Acne Cleansing Cream": "https://shopee.co.id/Swissvita-Acne-Cleansing-Cream-100g-Jerawat-Oily-Skin-Kulit-Sensitif-Alcohol-Free-Fragrance-Free-Facial-Wash-i.29252724.11469261237",
    "Mandelic Acid": "https://shopee.co.id/Swissvita-Mandelic-Acid-Perfect-Ratio-Complex-Serum-30ml-Komedo-Pori-pori-besar-Beruntusan-Chicken-Skin-Bruntusan-Eksfoliasi-Kusam-Alcohol-Free-Fragrance-Free-i.29252724.7368049384"
  },
  "G-Belle": {
    "Brightening Face Wash": "https://shopee.co.id/GBELLE-Face-wash-3-in-1-Brightening-Cleansing-Foam-150ml-Pembersih-Wajah-Facial-Wash-Face-Massage-Kulit-sensitif-Hydrating-Mencerahkan-Bekas-jerawat-Hiperpigmentasi-Flek-hitam-Noda-hitam-Niacinamide-Glutathione-Vitamin-C-i.1354940630.29461576861",
    "Acne Face Wash": "https://shopee.co.id/GBELLE-Face-wash-3-in-1-Acne-Cleansing-Foam-150ml-Pembersih-Wajah-Facial-Wash-Face-Massage-Kulit-Berjerawat-Kulit-Iritasi-Kemerahan-Melembapkan-Hydrating-Jerawat-Salicylic-Acid-i.1354940630.27121588784"
  },
  "Past Nine": {
    "After Midnight": "https://shopee.co.id/Past-Nine-Perfume-After-Midnight-50-ml-Extrait-de-Parfum-i.1407420287.28468070411",
    "Jasmine Jardin": "https://shopee.co.id/Past-Nine-Perfume-Jasmin-Jardin-50-ml-Extrait-de-Parfum-i.1407420287.43971860363",
    "Evening Twilight": "https://shopee.co.id/Past-Nine-Perfume-Evening-Twilight-50-ml-Extrait-de-Parfum-i.1407420287.41821855609"
  },
  "Nutri & Beyond": {
    "16 pcs": "https://shopee.co.id/Nutri-Beyond-Fiber-Drink-dengan-Buah-dan-Sayur-Rasa-Mixberry-1-Box-isi-16-Sachet-i.1443219087.28384550341",
    "32 pcs": "https://shopee.co.id/Nutri-Beyond-Fiber-Drink-dengan-Buah-dan-Sayur-Rasa-Mixberry-32-Sachet-(-Box-isi-16-Sachet-X-2-)-i.1443219087.27784539970"
  },
  "Ivy & Lily": {
    "Hairfall": "https://shopee.co.id/IVY-LILY-Hairfall-Shampoo-Perawatan-Rambut-Rontok-Penumbuh-Rambut-Cegah-Rontok-i.1443274610.28822774336",
    "Ivy Essence": "https://shopee.co.id/IVY-LILY-Hair-Loss-Growth-Essence-50ml-Hair-Essence-Rambut-Tipis-Sensitive-Scalp-Hair-Care-i.1443274610.26041765519",
    "Dandruff": "https://shopee.co.id/IVY-LILY-Dandruff-Treatment-Shampoo-Perawatan-Rambut-Gatal-Ketombe-Basah-Ketombe-kering-Kering-Sensitive-Scalp-Haircare-i.1443274610.28872780234"
  },
  "Naruko": {
    "Clay Mask": "https://shopee.co.id/NARUKO-Tea-Tree-2in1-Clay-Mask-and-Cleanser-Pembersih-Wajah-Masker-Wajah-Jerawat-Bruntus-Bekas-Jerawat-Berminyak-Sensitif-Noda-Gelap-Jerawat-Meradang-Oily-Skin-Skin-Barrier-Mencerahkan-Melembapkan-i.1638001566.27842081626",
    "Acne Lotion": "https://shopee.co.id/NARUKO-Tea-Tree-Blemish-Lotion-Jerawat-Bekas-Jerawat-Berminyak-Sensitif-Noda-Gelap-Jerawat-Meradang-Oily-Skin-Skin-Barrier-Mencerahkan-Melembapkan-i.1638001566.41221058273"
  }
};

// ======================================================
// HELPER FUNCTIONS
// ======================================================

function slugify(text: string): string {
  let slug = text.toLowerCase().trim();
  slug = slug.replace(/[^a-z0-9]+/g, "-");
  return slug.replace(/^-+|-+$/g, ""); // Strip leading/trailing dashes
}

function extractIds(productUrl: string): { shopId: string; productId: string } | null {
  // Regex equivalent to python's r"-i\.(\d+)\.(\d+)"
  const match = productUrl.match(/-i\.(\d+)\.(\d+)/);
  if (!match) return null;
  return { shopId: match[1], productId: match[2] };
}

// ======================================================
// MAIN COMPONENT
// ======================================================

function App() {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedIG, setSelectedIG] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [videoName, setVideoName] = useState<string>("");
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  // Derive lists based on selection
  const igList = selectedBrand ? BRANDS[selectedBrand] : [];
  const productList = selectedBrand ? Object.keys(PRODUCTS[selectedBrand]) : [];

  // Generate UTM Link logic
  const generatedLink = useMemo(() => {
    if (!selectedBrand || !selectedIG || !selectedProduct || !videoName) {
      return "";
    }

    const productUrl = PRODUCTS[selectedBrand][selectedProduct];
    const ids = extractIds(productUrl);

    if (!ids) {
      return "Error: Could not extract Shop/Product ID from source URL.";
    }

    const { shopId, productId } = ids;

    // Campaign Logic: slugify(ig)-slugify(video)-slugify(product)
    const campaignSlug = `${slugify(selectedIG)}-${slugify(videoName)}-${slugify(selectedProduct)}`;
    
    // UTM Campaign: s{shop_id}_SS_ID__{slugify(brand)}-{campaign}
    const utmCampaign = `s${shopId}_SS_ID__${slugify(selectedBrand)}-${campaignSlug}`;

    return `https://shopee.co.id/universal-link/product/${shopId}/${productId}?smtt=9&utm_source=instagram&utm_medium=seller&utm_campaign=${utmCampaign}&utm_content=&deep_and_web=1`;
  }, [selectedBrand, selectedIG, selectedProduct, videoName]);


  // Handle Reset
  const handleReset = () => {
    setSelectedBrand("");
    setSelectedIG("");
    setSelectedProduct("");
    setVideoName("");
    setCopyFeedback(false);
  };

  // Handle Copy
  const handleCopy = () => {
    if (generatedLink && !generatedLink.startsWith("Error")) {
      navigator.clipboard.writeText(generatedLink);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-medium text-primary">Rocketindo UTM Builder</h1>
        </div>

        {/* Card */}
        <div className="card bg-base-100 shadow-xl rounded-xl">
          <div className="card-body">
            
            {/* 1. Brand Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-black">Select Brand</span>
              </label>
              <select 
                className="select select-bordered bg-slate-100 select-primary w-full mt-1"
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedIG("");
                  setSelectedProduct("");
                }}
              >
                <option value="" disabled>Pick a brand</option>
                {Object.keys(BRANDS).map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* 2. IG Account Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-black">Select IG Account</span>
              </label>
              <select 
                className="select select-bordered bg-slate-100 w-full"
                value={selectedIG}
                onChange={(e) => setSelectedIG(e.target.value)}
                disabled={!selectedBrand}
              >
                <option value="" disabled>Pick an IG account</option>
                {igList.map((ig) => (
                  <option key={ig} value={ig}>{ig}</option>
                ))}
              </select>
            </div>

            {/* 3. Product Selection */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-black">Select Product</span>
              </label>
              <select 
                className="select select-bordered bg-slate-100 w-full"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                disabled={!selectedBrand}
              >
                <option value="" disabled>Pick a product</option>
                {productList.map((prod) => (
                  <option key={prod} value={prod}>{prod}</option>
                ))}
              </select>
            </div>

            {/* 4. Video Name Input */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-black">Video Name & Date</span>
                <span className="label-text-alt text-base-content/60">ex: clevtest14nov</span>
              </label>
              <input 
                type="text" 
                placeholder="Type here..." 
                className="input input-bordered w-full bg-slate-100" 
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
                disabled={!selectedProduct}
              />
            </div>

            <div className="divider text-lg font-semibold text-black mt-8">Your UTM Link</div>

            {/* 5. Output */}
            <div className="form-control w-full">
              <div className="relative">
                <textarea 
                  className="textarea textarea-bordered w-full h-32 text-sm font-mono leading-relaxed" 
                  placeholder="Link will appear here..."
                  readOnly
                  value={generatedLink}
                ></textarea>
              </div>
            </div>

            {/* Actions */}
            <div className="card-actions justify-end items-center mt-4">
              <button 
                className="border-2 border-blue-400 p-2 text-blue-400 text-md rounded-md"
                onClick={handleReset}
              >
                Reset
              </button>
              <button 
                className={`flex items-center p-2 duration-300 ease-in-out ${copyFeedback ? 'bg-green-700' : 'bg-blue-700'} rounded-md`}
                onClick={handleCopy}
                disabled={!generatedLink || generatedLink.startsWith("Error")}
              >
                {copyFeedback ? (
                  <div className='flex items-center gap-2 text-white text-md'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Copied!
                  </div>
                ) : (
                  <div className='flex items-center gap-2 text-white text-md'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    Copy Link
                  </div>
                )}
              </button>
            </div>

          </div>
        </div>

        <div className="text-center text-xs text-base-content/40">
           &copy; {new Date().getFullYear()}. Business Intelligence Team
        </div>

      </div>
    </div>
  );
}

export default App;