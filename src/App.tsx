import { useState, useMemo } from 'react'; 
import rocketLogo from './assets/rocket_logo.png';
import { useData } from './useData';

function slugify(text: string): string {
  let slug = text.toLowerCase().trim();
  slug = slug.replace(/[^a-z0-9]+/g, "-");
  return slug.replace(/^-+|-+$/g, ""); // Strip leading/trailing dashes
}

function extractIds(productUrl: string): { shopId: string; productId: string } | null {
  const match = productUrl.match(/-i\.(\d+)\.(\d+)/);
  if (!match) return null;
  return { shopId: match[1], productId: match[2] };
}

function App() {

  const { brands: BRANDS, products: PRODUCTS, loading } = useData();

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedIG, setSelectedIG] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [videoName, setVideoName] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  const igList = selectedBrand ? BRANDS[selectedBrand] : [];
  const productList = selectedBrand ? Object.keys(PRODUCTS[selectedBrand]) : [];

  const generatedLink = useMemo(() => {
    if (!selectedBrand || !selectedIG || !selectedProduct || !videoName || !date) {
      return "";
    }

    const productUrl = PRODUCTS[selectedBrand][selectedProduct];
    
    // Safety check for product URL
    if (!productUrl) return "Error: Product URL not found.";

    const ids = extractIds(productUrl);

    if (!ids) {
      return "Error: Could not extract Shop/Product ID from source URL.";
    }

    const { shopId, productId } = ids;

    // Campaign Logic: slugify(ig)-slugify(video)-formattedDate-slugify(product)
    const combinedSlug = `${slugify(videoName)}-${date}`;
    const campaignSlug = `${slugify(selectedIG)}-${combinedSlug}-${slugify(selectedProduct)}`;
    
    // UTM Campaign: s{shop_id}_SS_ID__{slugify(brand)}-{campaign}
    const utmCampaign = `s${shopId}_SS_ID__${slugify(selectedBrand)}-${campaignSlug}`;

    return `https://shopee.co.id/universal-link/product/${shopId}/${productId}?smtt=9&utm_source=instagram&utm_medium=seller&utm_campaign=${utmCampaign}&utm_content=&deep_and_web=1`;
  }, [selectedBrand, selectedIG, selectedProduct, videoName, date, BRANDS, PRODUCTS]);

  const handleReset = () => {
    setSelectedBrand("");
    setSelectedIG("");
    setSelectedProduct("");
    setVideoName("");
    setCopyFeedback(false);
    setDate("");
  };

  const handleCopy = () => {
    if (generatedLink && !generatedLink.startsWith("Error")) {
      navigator.clipboard.writeText(generatedLink);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-lg mx-auto space-y-4 flex flex-col gap-0">
        
        <div className="flex justify-center items-center gap-0">
          <img className='w-40' src={rocketLogo} alt="Rocketindo logo" />
          <h1 className="text-3xl text-primary font-regular">UTM Builder</h1>
        </div>
        
        <div className='card w-full h-[680px] shadow-md mx-auto rounded-xl p-4'>
          {
            loading ?
              <div className='m-auto'>
                <div className='text-md font-medium'>Loading data...</div>
              </div>
            :
            <>

              <div className='text-md font-medium'>Select brand</div>
              <div className='dropdown'>
                <div tabIndex={0} role="button" className="btn mt-2 w-full flex items-center justify-between">
                  <div className='text-md font-medium'>
                    {
                      selectedBrand ? selectedBrand : "Select brand"
                    }
                  </div>
                  <div></div>
                </div>
                <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-lg h-[400px] overflow-auto">
                  {
                    Object.keys(BRANDS).map((brand) => (
                      <li>
                        <a 
                        className='text-md font-medium'
                        onMouseDown={() => {
                          console.log(brand);
                          setSelectedBrand(brand);
                          setSelectedIG("");
                          setSelectedProduct("");
                          setVideoName("");
                          setDate("");
                        }}>{brand}</a>
                      </li>
                    ))
                  }
                </ul>
              </div>

              <div className='text-md font-medium mt-3'>Select IG account</div>
              <div onClick={() => !selectedBrand && alert("Please select a brand first.")} className='dropdown'>
                <div tabIndex={0} role="button" className="btn mt-2 w-full flex items-center justify-between">
                  <div className='text-md font-medium'>{ selectedIG ? selectedIG : "Select IG Account" }</div>
                  <div></div>
                </div>
                <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-lg">
                  {
                    igList.map(ig => (
                      <li><a className='text-md font-medium' onMouseDown={() => { setSelectedIG(ig) }}>{ig}</a></li>
                    ))
                  }
                </ul>
              </div>

              <div className='text-md font-medium mt-3'>Select product</div>
              <div onClick={() => !selectedIG && alert("Please select an IG account first.")} className='dropdown'>
                <div tabIndex={0} role="button" className="btn mt-2 w-full flex items-center justify-between">
                  <div className='text-md font-medium'>{selectedProduct ? selectedProduct : "Select a product"}</div>
                  <div></div>
                </div>
                <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-lg">
                  {
                    productList.map(prod => (
                      <li><a className='text-md font-medium' onMouseDown={() => { setSelectedProduct(prod)}}>{prod}</a></li>
                    ))
                  }
                </ul>
              </div>

              <div className='text-md font-medium mt-3'>Insert video name</div>
              <input 
                type="text" 
                placeholder="Insert video name" 
                className='input w-full mt-2 text-md font-medium'
                onChange={(e) => setVideoName(e.target.value)}
                disabled={!selectedProduct}
                value={videoName}
              />

              <div className='text-md font-medium mt-3'>Insert video date</div>
              <input value={date} disabled={!videoName} type="date" placeholder='Select date' className="input w-full mt-2 text-md font-medium" onChange={(e) => {
                setDate(e.target.value);
              }} />

              <div className='text-md font-medium mt-3'>Your UTM link</div>
              {/* <input
                disabled={!videoName} 
                type="text" 
                placeholder="Your UTM Link" 
                className='input w-full mt-2'
                value={generatedLink}
              /> */}
              <textarea disabled={!videoName || !date} className="textarea textarea-base w-full h-36 mt-2 text-md font-medium" placeholder="Your UTM Link" value={generatedLink}></textarea>

              <div className='flex justify-center gap-3'>
                <button onClick={() => handleReset()} className={`btn btn-ghost mt-4 w-fit`}>Reset</button>
                <button disabled={!generatedLink} onClick={() => handleCopy()} className={`btn mt-4 w-fit ${copyFeedback ? "btn-secondary" : "btn-primary"}`}>{copyFeedback ? "Copied!" : "Copy link"}</button>
              </div>
            </>
          }
        </div>

        <div className="text-center text-xs text-base-content/40">
           &copy; {new Date().getFullYear()}. Business Intelligence Team
        </div>
      </div>
    </div>
  );
}

export default App;