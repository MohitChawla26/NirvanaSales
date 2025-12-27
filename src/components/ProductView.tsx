import { ArrowLeft, DollarSign } from "lucide-react";
import { Product } from "../services/api";
import { useState } from "react";

interface ProductViewProps {
  category: string;
  products: Product[];
  onBack: () => void;
  onRecordSale: (product: Product) => Promise<void>;
}

export function ProductView({
  category,
  products,
  onBack,
  onRecordSale,
}: ProductViewProps) {
  const [processingId, setProcessingId] = useState<number | null>(null);

  const categoryProducts = products.filter(
    (p) => p.category.trim().toLowerCase() === category.trim().toLowerCase()
  );

  const handleSale = async (product: Product) => {
    setProcessingId(product.product_id);
    try {
      await onRecordSale(product);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4B2C5E] to-[#6B4C7E] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="bg-[#FFFDF5] p-3 rounded-xl hover:bg-[#FFD700] transition-colors shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 text-[#4B2C5E]" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-[#FFFDF5]">
            {category}
          </h1>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="bg-[#FFFDF5] rounded-2xl p-8 text-center shadow-xl">
            <p className="text-[#4B2C5E] text-xl font-medium">
              No products found in this category
            </p>
          </div>
        ) : (
          // src/components/ProductView.tsx modification
          <div className="space-y-2">
            {" "}
            {/* Reduced spacing between cards */}
            {categoryProducts.map((product) => (
              <div
                key={product.product_id}
                className="bg-[#FFFDF5] rounded-xl p-3 shadow-md flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  {" "}
                  {/* min-w-0 prevents text overflow */}
                  <h3 className="text-base font-bold text-[#4B2C5E] truncate">
                    {product.item_name}
                  </h3>
                  <div className="flex items-center text-[#FFD700] text-sm">
                  
                    <span className="font-bold">
                      ₹{Number(product.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSale(product)}
                  disabled={processingId === product.product_id}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
                    processingId === product.product_id
                      ? "bg-gray-300 text-gray-500"
                      : "bg-[#4B2C5E] text-[#FFFDF5] active:scale-95"
                  }`}
                >
                  {processingId === product.product_id ? "..." : "Sell"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
