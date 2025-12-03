// src/useData.ts
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase/config';

export function useData() {
  const [brands, setBrands] = useState<Record<string, string[]>>({});
  const [products, setProducts] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from "Brands" collection
        const querySnapshot = await getDocs(collection(db, "Brands"));
        
        const tempBrands: Record<string, string[]> = {};
        const tempProducts: Record<string, Record<string, string>> = {};

        querySnapshot.forEach((doc) => {
          const brandName = doc.id;
          const data = doc.data();

          // Map Firestore fields to your app's expected structure
          // Note: using 'ig_account' based on your previous screenshot
          tempBrands[brandName] = data.ig_account || [];
          tempProducts[brandName] = data.products || {};
        });

        setBrands(tempBrands);
        setProducts(tempProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { brands, products, loading };
}