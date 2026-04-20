'use client';

export default function Hero() {
    return (
        <section className="relative bg-gradient-to-r from-amber-50 to-amber-100 py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Content */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Discover <span className="text-amber-700">Timeless</span> Elegance
                        </h2>
                        <p className="text-lg text-gray-600">
                            Explore our exquisite collection of premium jewelry crafted with precision and passion. Each piece tells a story of elegance and craftsmanship.
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition-colors font-medium">
                                Shop Now
                            </button>
                            <button className="border-2 border-amber-700 text-amber-700 px-8 py-3 rounded-lg hover:bg-amber-50 transition-colors font-medium">
                                View Collection
                            </button>
                        </div>
                    </div>
                    {/* Image */}
                    <div className="relative h-80 md:h-96 bg-white rounded-xl overflow-hidden shadow-lg">
                        <img
                            src="https://i.pinimg.com/1200x/a9/b3/e5/a9b3e5dbd20f1ab19a70cb5f2f3cfa5f.jpg"
                            alt="Premium Jewelry Collection"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                            <p className="text-sm font-semibold tracking-widest uppercase opacity-80">New Arrivals</p>
                            <p className="text-lg font-bold">Premium Collection 2025</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
