# King Burger - Algolia Search Implementation

This project implements a product search functionality using Algolia's search technology. The current implementation uses a local search system that mimics Algolia's behavior, but can be easily upgraded to use the real Algolia service.

## Features

- **Real-time Search**: Search products as you type
- **Category Filtering**: Filter by product categories (Classic, Premium, Vegetarian, Spicy)
- **Advanced Search**: Search by product name, description, tags, and ingredients
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Product Badges**: Visual indicators for Popular, Spicy, and Vegetarian products
- **Add to Cart**: Quick add functionality with visual feedback

## Current Implementation

The search functionality is currently implemented using a local JavaScript search system that:

1. **Stores product data** in a JavaScript array
2. **Performs real-time filtering** based on user input
3. **Supports category filtering** and text search
4. **Displays results** in a responsive grid layout

## Product Data Structure

Each product in the system has the following structure:

```javascript
{
    id: 1,
    name: "Classic King",
    description: "Hambúrguer clássico com queijo, alface, tomate e molho especial",
    price: 25.90,
    category: "classic",
    image: "assets/images/burguer.png",
    tags: ["clássico", "queijo", "alface", "tomate", "molho especial"],
    ingredients: ["pão", "carne", "queijo", "alface", "tomate", "molho especial"],
    spicy: false,
    vegetarian: false,
    popular: true
}
```

## How to Use

1. **Open the website** and click the search icon in the header
2. **Type your search query** in the search input
3. **Optionally select a category** from the dropdown
4. **View results** in real-time as you type
5. **Click "Adicionar"** to add products to cart
6. **Use "Limpar busca"** to clear the search

## Upgrading to Real Algolia

To upgrade to the real Algolia service, follow these steps:

### 1. Create an Algolia Account

1. Go to [Algolia's website](https://www.algolia.com/)
2. Sign up for a free account
3. Create a new application

### 2. Get Your Credentials

From your Algolia dashboard, you'll need:
- **Application ID**
- **Search-Only API Key** (for frontend)
- **Admin API Key** (for backend)

### 3. Update the JavaScript Code

Replace the local search implementation in `assets/js/index.js` with real Algolia:

```javascript
// Initialize Algolia client
const searchClient = algoliasearch(
    'YOUR_APPLICATION_ID',
    'YOUR_SEARCH_ONLY_API_KEY'
);

const index = searchClient.initIndex('products');

// Update the performSearch method
async performSearch() {
    if (!this.currentQuery && !this.currentCategory) {
        this.hideResults();
        return;
    }
    
    const searchParams = {
        query: this.currentQuery,
        hitsPerPage: 20
    };
    
    if (this.currentCategory) {
        searchParams.filters = `category:${this.currentCategory}`;
    }
    
    try {
        const { hits } = await index.search(this.currentQuery, searchParams);
        this.displayResults(hits);
    } catch (error) {
        console.error('Search error:', error);
        this.showNoResults();
    }
}
```

### 4. Index Your Data

You'll need to upload your product data to Algolia. You can do this via:

- **Algolia Dashboard**: Manual upload
- **API**: Programmatic upload
- **Algolia CLI**: Command-line tool

Example data upload:

```javascript
// Using Algolia's JavaScript client
const adminClient = algoliasearch(
    'YOUR_APPLICATION_ID',
    'YOUR_ADMIN_API_KEY'
);

const index = adminClient.initIndex('products');

// Upload your products array
index.saveObjects(products).then(({ objectIDs }) => {
    console.log('Products indexed:', objectIDs);
});
```

### 5. Configure Search Settings

In your Algolia dashboard, configure:

- **Searchable attributes**: Which fields to search
- **Facets**: For category filtering
- **Ranking**: How to order results
- **Synonyms**: For better search matching

## Search Configuration

### Searchable Attributes

Configure these attributes as searchable in Algolia:

- `name` (primary)
- `description`
- `tags`
- `ingredients`

### Facets

Set up facets for:
- `category`
- `spicy`
- `vegetarian`
- `popular`

### Ranking

Recommended ranking:
1. Typo
2. Geo
3. Filters
4. Attribute
5. Exact
6. Custom

## Performance Optimization

### Frontend Optimizations

1. **Debounce search input** to avoid too many API calls
2. **Cache results** for better performance
3. **Use search insights** to improve search quality

### Backend Optimizations

1. **Batch indexing** for large datasets
2. **Incremental updates** for product changes
3. **Use webhooks** for real-time updates

## Analytics and Insights

Algolia provides built-in analytics:

- **Search analytics**: What users are searching for
- **Click analytics**: Which results get clicked
- **Conversion analytics**: Search to purchase conversion

## Security Considerations

1. **Use search-only API key** in frontend code
2. **Implement rate limiting** on your backend
3. **Validate search parameters** before sending to Algolia
4. **Use user authentication** for personalized search

## Troubleshooting

### Common Issues

1. **No results appearing**: Check if data is properly indexed
2. **Search not working**: Verify API keys and application ID
3. **Slow search**: Check network connectivity and Algolia plan limits

### Debug Mode

Enable debug mode to see search requests:

```javascript
const searchClient = algoliasearch(
    'YOUR_APPLICATION_ID',
    'YOUR_SEARCH_ONLY_API_KEY'
);

// Enable debug mode
searchClient.setExtraHeader('X-Algolia-API-Key', 'YOUR_SEARCH_ONLY_API_KEY');
```

## Support

For issues with:
- **Current implementation**: Check the browser console for errors
- **Algolia integration**: Refer to [Algolia's documentation](https://www.algolia.com/doc/)
- **Performance issues**: Contact Algolia support

## License

This project is for educational purposes. For production use, ensure you comply with Algolia's terms of service. 