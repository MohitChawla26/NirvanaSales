import { ArrowLeft, DollarSign } from 'lucide-react';
import { Product } from '../services/api';
import { useState } from 'react';

interface ProductViewProps {
  category: string;
  products: Product[];
  onBack: () => void;
  onRecordSale: (product: Product) => Promise<void>;
}

export function ProductView({ category, products, onBack, onRecordSale }: ProductViewProps) {
  const [processingId, setProcessingId] = useState<number | null>(null);

  const categoryProducts = products.filter((p) => p.category === category);

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
          <h1 className="text-3xl md:text-4xl font-bold text-[#FFFDF5]">{category}</h1>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="bg-[#FFFDF5] rounded-2xl p-8 text-center shadow-xl">
            <p className="text-[#4B2C5E] text-xl font-medium">
              No products found in this category
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categoryProducts.map((product) => (
              <div
                key={product.product_id}
                className="bg-[#FFFDF5] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-[#4B2C5E] mb-2">
                      {product.item_name}
                    </h3>
                    <div className="flex items-center gap-2 text-[#FFD700]">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-2xl font-bold">{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSale(product)}
                  disabled={processingId === product.product_id}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                    processingId === product.product_id
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#4B2C5E] to-[#6B4C7E] text-[#FFFDF5] hover:from-[#6B4C7E] hover:to-[#4B2C5E] active:scale-95'
                  }`}
                >
                  {processingId === product.product_id ? 'Processing...' : 'Record Sale'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
