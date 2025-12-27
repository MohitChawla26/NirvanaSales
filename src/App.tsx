import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ProductView } from './components/ProductView';
import { AdminDashboard } from './components/AdminDashboard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Toast } from './components/Toast';
import { fetchProducts, recordSale, Product } from './services/api';

type Screen = 'home' | 'products' | 'admin';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      setToast({ message: 'Failed to load products', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentScreen('products');
  };

  const handleRecordSale = async (product: Product) => {
    setToast({ message: 'Sale Recorded!', type: 'success' });

    try {
      const success = await recordSale(product.product_id, product.price);
      if (!success) {
        setToast({ message: 'Failed to record sale', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Error recording sale', type: 'error' });
    }
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setSelectedCategory('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {currentScreen === 'home' && (
        <HomeScreen
          onCategorySelect={handleCategorySelect}
          onAdminClick={() => setCurrentScreen('admin')}
        />
      )}

      {currentScreen === 'products' && (
        <ProductView
          category={selectedCategory}
          products={products}
          onBack={handleBack}
          onRecordSale={handleRecordSale}
        />
      )}

      {currentScreen === 'admin' && <AdminDashboard onBack={handleBack} />}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

export default App;
