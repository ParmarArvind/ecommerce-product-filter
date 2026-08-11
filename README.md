# 🛍️ E-Commerce Product Filter & Sort

A full-stack e-commerce product filtering and sorting application built as part of a **Vibe Coding Assessment**.

The application allows users to browse products and instantly filter them using **category, price range, and minimum rating**. Users can also sort the filtered products by **price** or **rating**.

---

## 🚀 Features

### 1. Interactive Filter Sidebar

The application provides a sticky sidebar containing:

* ✅ Category filtering

  * Electronics
  * Apparel
  * Footwear

* ✅ Dual-point price range slider

  * Minimum price
  * Maximum price

* ✅ Minimum star rating

  * 1★ and above
  * 2★ and above
  * 3★ and above
  * 4★ and above
  * 5★ and above

* ✅ Reset filters button

---

### 2. Dynamic Product Inventory

Products are displayed as responsive cards containing:

* Product image
* Product name
* Product category
* Product price
* Star rating

The product count is also updated dynamically.

---

### 3. Instant Filtering

There is no manual **Submit** button.

Whenever the user:

* Selects a category
* Changes the price range
* Selects a rating
* Changes the sorting option

the application immediately requests updated data from the backend and refreshes the product grid.

---

### 4. Product Sorting

The application supports:

* **Default**
* **Price: Low to High**
* **Top Rated First**

The backend follows the required processing pipeline:

```text
Master Product Inventory
          ↓
        Filter
          ↓
   Matching Products
          ↓
         Sort
          ↓
    Final Response
```

Filtering always happens **before sorting**.

---

### 5. Empty State

If no product satisfies the selected filters:

```text
🛍️

No items match your criteria

Try changing your filters to find more products.

[ Reset filters ]
```

The product grid is hidden and the empty state is displayed.

---

## 🏗️ Project Architecture

```text
ecommerce-product-filter-main/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── backend/
    ├── server.js
    │
    ├── data/
    │   └── products.js
    │
    ├── controllers/
    │   └── productController.js
    │
    └── routes/
        └── productRoutes.js
```

---

## 💻 Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

### Backend

* Node.js
* Express.js
* CORS

### Data

The current version uses an in-memory JavaScript array as the master product inventory.

---

## 🔄 Application Flow

```text
User
 │
 ▼
Frontend UI
 │
 │ Select filters / sorting
 ▼
JavaScript Filter State
 │
 │ GET /api/products
 ▼
Express Backend
 │
 ├── Validate request
 │
 ├── Filter products
 │
 ├── Sort filtered products
 │
 └── Return JSON
 │
 ▼
Frontend
 │
 ▼
Product Grid
```

---

## 🧠 Filtering Logic

The backend uses intersection-based filtering.

A product must satisfy **all active conditions**.

For example:

```text
Category = Electronics
        AND
Price >= ₹1000
        AND
Price <= ₹3000
        AND
Rating >= 4
```

Only products satisfying every condition are returned.

Conceptually:

```javascript
return (
    categoryMatch &&
    minimumPriceMatch &&
    maximumPriceMatch &&
    ratingMatch
);
```

---

## 🛡️ Graceful Null Handling

Filters are optional.

If a filter is not selected, it does not restrict the results.

For example:

```text
categories = []
rating = null
```

means:

```text
No category restriction
No rating restriction
```

If all filters are cleared, the complete product inventory is returned.

---

## 🔢 Sorting Logic

Sorting is applied **after filtering**.

### Price: Low to High

```javascript
sortedProducts.sort(
    (a, b) => a.price - b.price
);
```

### Top Rated First

```javascript
sortedProducts.sort(
    (a, b) => b.rating - a.rating
);
```

A copy of the filtered array is created before sorting:

```javascript
const sortedProducts =
    [...filteredProducts];
```

This avoids modifying the original filtered array.

---

## 🌐 API

### Get Products

```text
GET /api/products
```

### Optional Query Parameters

| Parameter    | Description                 |
| ------------ | --------------------------- |
| `categories` | Selected product categories |
| `minPrice`   | Minimum price               |
| `maxPrice`   | Maximum price               |
| `rating`     | Minimum rating              |
| `sortBy`     | Sorting method              |

---

## 📌 API Examples

### Get all products

```text
GET /api/products
```

### Filter by category

```text
GET /api/products?categories=Electronics
```

### Filter by price

```text
GET /api/products?minPrice=1000&maxPrice=3000
```

### Filter by rating

```text
GET /api/products?rating=4
```

### Sort by price

```text
GET /api/products?sortBy=price-low-high
```

### Sort by rating

```text
GET /api/products?sortBy=top-rated
```

### Combined filtering and sorting

```text
GET /api/products?categories=Electronics,Footwear&minPrice=1000&maxPrice=3000&rating=4&sortBy=top-rated
```

---

## 📦 API Response

A successful response looks like:

```json
{
    "success": true,
    "count": 2,
    "filters": {
        "categories": ["Electronics"],
        "minPrice": 1000,
        "maxPrice": 3000,
        "rating": 4
    },
    "sortBy": "top-rated",
    "data": []
}
```

---

## ⚙️ Backend Validation

The backend validates incoming parameters.

Examples:

* Invalid category → `400 Bad Request`
* Negative price → `400 Bad Request`
* Minimum price greater than maximum price → `400 Bad Request`
* Rating outside 1–5 → `400 Bad Request`
* Invalid sorting option → `400 Bad Request`

This ensures that business rules are enforced on the server.

---

## 🛠️ Installation & Setup

### Prerequisites

Install:

* Node.js
* npm

Check installation:

```bash
node --version
npm --version
```

---

### 1. Open the project

```bash
cd ecommerce-product-filter-main
```

---

### 2. Go to backend

```bash
cd backend
```

---

### 3. Install dependencies

```bash
npm install
```

Required packages:

```bash
npm install express cors
```

---

### 4. Start the backend

```bash
node server.js
```

The API will run at:

```text
http://localhost:5000
```

---

### 5. Run the frontend

Open:

```text
frontend/index.html
```

using a local development server such as **VS Code Live Server**.

The frontend communicates with:

```text
http://localhost:5000/api/products
```

---

## 🧪 Testing Checklist

Before submission, verify:

* [ ] All products load initially
* [ ] Electronics filter works
* [ ] Apparel filter works
* [ ] Footwear filter works
* [ ] Multiple categories work together
* [ ] Minimum price works
* [ ] Maximum price works
* [ ] Price range cannot become invalid
* [ ] Rating filters work
* [ ] Multiple filters work together
* [ ] Price sorting works
* [ ] Rating sorting works
* [ ] Filtering happens before sorting
* [ ] Empty state appears when there are no matches
* [ ] Reset button restores all products
* [ ] Backend validation works
* [ ] API responds correctly
* [ ] Frontend and backend communicate correctly

---

## 🎯 Assessment Requirements Covered

| Requirement             | Implementation                         |
| ----------------------- | -------------------------------------- |
| Interactive sidebar     | HTML + CSS                             |
| Category checklist      | Checkbox filters                       |
| Dual-point price slider | Two range inputs                       |
| Minimum rating          | Radio buttons                          |
| Dynamic product grid    | JavaScript rendering                   |
| Instant feedback        | Event listeners + API requests         |
| Empty state             | Dedicated empty-state UI               |
| Server-side filtering   | Express controller                     |
| Intersection filtering  | AND-based conditions                   |
| Graceful null handling  | Empty/null filters bypass restrictions |
| Sorting                 | Backend sorting                        |
| Filter before sort      | Backend processing pipeline            |
| Validation              | Server-side validation                 |
| Clean architecture      | Routes + Controllers + Data            |

---

## 🔐 Design Principle

The project follows a clear separation of responsibilities:

### Frontend

Responsible for:

* Presentation
* User interaction
* Filter state
* API requests
* Rendering results

### Backend

Responsible for:

* Business logic
* Validation
* Filtering
* Sorting
* API responses

This keeps the application modular and easier to maintain.

---

## 🚧 Future Improvements

The current project can be extended with:

* MongoDB database
* Product search
* Pagination
* Product detail pages
* Authentication
* Shopping cart
* Wishlist
* Advanced sorting
* More product categories
* Real product APIs
* Product availability tracking

---

## 👨‍💻 Project Purpose

This project demonstrates how a full-stack application can handle:

* Dynamic filtering
* Multiple simultaneous criteria
* Server-side business logic
* Input validation
* Sorting pipelines
* REST API communication
* Responsive UI
* Empty-state handling
* Modular backend architecture

---

## 📄 License

This project was created for educational and assessment purposes.
