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
        <aside className='shop-sidebar'>
            <div className='shop-sidebar__section'>
                <h2>Categories</h2>
                <ul className='shop-sidebar__categories'>
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

            <div className='shop-sidebar__section'>
                <h2>Price Range</h2>
                <input
                    type="range"
                    min={minPriceBound}
                    max={maxPriceBound}
                    value={priceCeiling}
                    onChange={(event) => onPriceChange(Number(event.target.value))}
                    className='shop-sidebar__range'
                />
                <div className='shop-sidebar__range-labels'>
                    <span>BHD {minPriceBound}</span>
                    <span>BHD {priceCeiling}</span>
                </div>
            </div>

            {availableSizes.length > 0 && (
                <div className='shop-sidebar__section'>
                    <h2>Size Availability</h2>
                    <div className='shop-sidebar__sizes'>
                        {availableSizes.map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => onToggleSize(size)}
                                className={`shop-sidebar__size${selectedSizes.includes(size) ? ' shop-sidebar__size--active' : ''}`}
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
