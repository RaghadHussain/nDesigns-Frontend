function ShopSidebar({
    categories,
    productCountByCategory,
    selectedCategory,
    onCategoryChange,
    minPriceBound,
    maxPriceBound,
    priceCeiling,
    onPriceChange,
    availableSizes,
    selectedSizes,
    onToggleSize,
}) {
    return (
        <aside>
            <div>
                <h2>Categories</h2>
                <ul>
                    <li>
                        <label>
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === ""}
                                onChange={() => onCategoryChange("")}
                            />
                            All Collections
                        </label>
                    </li>
                    {categories.map((category) => (
                        <li key={category._id}>
                            <label>
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === category._id}
                                    onChange={() => onCategoryChange(category._id)}
                                />
                                {category.name} ({productCountByCategory[category._id] || 0})
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Price Range</h2>
                <input
                    type="range"
                    min={minPriceBound}
                    max={maxPriceBound}
                    value={priceCeiling}
                    onChange={(event) => onPriceChange(Number(event.target.value))}
                />
                <div>
                    <span>BHD {minPriceBound}</span>
                    <span>BHD {priceCeiling}</span>
                </div>
            </div>

            {availableSizes.length > 0 && (
                <div>
                    <h2>Size Availability</h2>
                    <div>
                        {availableSizes.map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => onToggleSize(size)}
                            >
                                {selectedSizes.includes(size) ? `[x] ${size}` : size}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
}

export default ShopSidebar;
