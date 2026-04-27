import { useState } from 'react';
import ProductDetail from './ProductDetail';
import { Star, ShoppingCart, Heart } from 'lucide-react';

const getProductImage = (category, name) => {
    if (name.includes('Ring'))
        return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80';
    if (name.includes('Necklace'))
        return 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80';
    if (name.includes('Earrings'))
        return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80';
    if (name.includes('Bracelet') || name.includes('Bangle'))
        return 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80';
    if (name.includes('Pendant'))
        return 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80';

    // fallback
    return 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80';
};

export default function ProductGrid({ products, onAddToCart, selectedCategory }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category === selectedCategory);

    const handleCardClick = (product) => {
        setSelectedProduct(product);
        setDetailOpen(true);
    };

    return (
        <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {selectedCategory === 'All' ? 'All Collections' : selectedCategory}
                    </h2>
                    <p className="text-gray-600">
                        {filteredProducts.length} exquisite pieces in this collection
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleCardClick(product)}
                            className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-amber-300"
                        >
                            {/* Image Container */}
                            <div className="relative h-56 md:h-64 bg-gray-100 overflow-hidden">
                                <img
                                    src={getProductImage(product.category, product.name)}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Badges */}
                                {product.discount && (
                                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        -{product.discount}%
                                    </div>
                                )}
                                {product.isNew && (
                                    <div className="absolute top-3 left-3 bg-amber-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        NEW
                                    </div>
                                )}

                                {/* Wishlist Button */}
                                <button className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                                    <Heart size={18} className="text-red-500" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {/* Category Tag */}
                                <p className="text-xs text-amber-700 font-semibold uppercase mb-2">
                                    {product.category}
                                </p>

                                {/* Title */}
                                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 text-sm md:text-base">
                                    {product.name}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-3">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={i < product.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">({product.reviews})</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-lg md:text-xl font-bold text-gray-900">
                                        ₹{product.price.toLocaleString()}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-sm text-gray-500 line-through">
                                            ₹{product.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => onAddToCart(product)}
                                    className="w-full bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={16} />
                                    Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-600">No products found in this category</p>
                    </div>
                )}
            </div>
            <ProductDetail
                product={selectedProduct}
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
                onAddToCart={onAddToCart}
            />
        </section>
    );
}
