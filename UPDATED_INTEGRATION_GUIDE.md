# Updated Frontend Integration Guide

## 🆕 **New Hierarchical Category System**

The frontend has been updated to support the new hierarchical category system with categories and subcategories as described in your API documentation.

---

## 📁 **Updated File Structure**

```
src/
├── services/
│   ├── api.ts                    # Axios configuration
│   ├── authService.ts            # Authentication
│   ├── portfolioService.ts       # Portfolio API (updated)
│   ├── adminService.ts           # Admin portfolio management (NEW)
│   ├── feedbackService.ts        # Feedback system
│   ├── contactService.ts         # Contact form
│   └── instagramService.ts       # Instagram integration
├── pages/
│   ├── Portfolio.tsx             # Original portfolio page
│   └── PortfolioNew.tsx          # New hierarchical portfolio (NEW)
├── routes/
│   └── index.tsx                 # Updated with new routes
└── types/                        # Updated TypeScript interfaces
```

---

## 🔄 **Updated Portfolio Service**

### **New Interfaces**

```typescript
// Hierarchical Category System
export interface PortfolioSubcategory {
  id: string;
  name: string;
  slug: string;
  client_name: string;
  event_date?: string;
  location?: string;
  cover_image_url: string;
  project_count?: number;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  portfolio_subcategories: PortfolioSubcategory[];
}

export interface CategoriesResponse {
  message: string;
  categories: PortfolioCategory[];
}

export interface SubcategoryResponse {
  message: string;
  subcategory: {
    id: string;
    name: string;
    slug: string;
    client_name: string;
    event_date?: string;
    location?: string;
    cover_image_url: string;
    portfolio_categories: {
      id: string;
      name: string;
      slug: string;
    };
    portfolio_projects: PortfolioProject[];
  };
}

// Updated Project Interface
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image_url: string;
  image_public_id: string;
  thumbnail_url: string;
  is_published: boolean;
  view_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  portfolio_subcategories?: {
    id: string;
    name: string;
    slug: string;
    client_name: string;
    portfolio_categories: {
      id: string;
      name: string;
      slug: string;
    };
  };
}
```

### **New API Methods**

```typescript
// Get all categories with subcategories
async getCategories(): Promise<CategoriesResponse>

// Get category by slug
async getCategoryBySlug(slug: string): Promise<PortfolioCategory>

// Get subcategory by slug
async getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): Promise<SubcategoryResponse>

// Updated search parameters
export interface SearchParams {
  query?: string;
  category?: string;
  subcategory?: string;  // NEW
  tags?: string[];
  featured?: boolean;
  page?: number;
  limit?: number;
}
```

---

## 🆕 **New Portfolio Page (PortfolioNew.tsx)**

### **Features**

1. **Hierarchical Navigation**
   - Main categories (Maternity, Wedding, etc.)
   - Subcategories (Client-specific portfolios)
   - Breadcrumb navigation

2. **Dynamic Content Loading**
   - All projects view
   - Category view (shows subcategories)
   - Subcategory view (shows projects)

3. **Responsive Design**
   - Mobile-friendly grid layouts
   - Smooth animations with Framer Motion
   - Loading states and error handling

### **Route Structure**

```typescript
// Routes in src/routes/index.tsx
<Route path="/portfolio" element={<MainLayout><Portfolio /></MainLayout>} />
<Route path="/portfolio/:categorySlug" element={<MainLayout><PortfolioNew /></MainLayout>} />
<Route path="/portfolio/:categorySlug/:subcategorySlug" element={<MainLayout><PortfolioNew /></MainLayout>} />
```

### **URL Examples**

```
/portfolio                           # All projects
/portfolio/maternity                 # Maternity category
/portfolio/wedding                   # Wedding category  
/portfolio/wedding/john-sarah        # John & Sarah's wedding
/portfolio/maternity/emma-session    # Emma's maternity session
```

---

## 🆕 **Admin Service (adminService.ts)**

### **Category Management**

```typescript
// Create category
async createCategory(categoryData: CreateCategoryData): Promise<PortfolioCategory>

// Update category
async updateCategory(categoryId: string, categoryData: Partial<CreateCategoryData>): Promise<PortfolioCategory>

// Delete category
async deleteCategory(categoryId: string): Promise<void>
```

### **Subcategory Management**

```typescript
// Create subcategory with cover image
async createSubcategory(subcategoryData: CreateSubcategoryData): Promise<PortfolioSubcategory>

// Update subcategory
async updateSubcategory(subcategoryId: string, subcategoryData: Partial<CreateSubcategoryData>): Promise<PortfolioSubcategory>

// Delete subcategory
async deleteSubcategory(subcategoryId: string): Promise<void>
```

### **Project Management**

```typescript
// Create project with subcategory
async createProject(projectData: CreateProjectData): Promise<PortfolioProject>

// Update project
async updateProject(projectId: string, projectData: UpdateProjectData): Promise<PortfolioProject>

// Delete project
async deleteProject(projectId: string): Promise<void>

// Toggle publish status
async toggleProjectPublish(projectId: string, isPublished: boolean): Promise<PortfolioProject>
```

### **Admin Statistics**

```typescript
// Get portfolio statistics
async getPortfolioStats(): Promise<AdminPortfolioStats>

// Get all projects (including unpublished)
async getAllProjects(params?: AdminSearchParams): Promise<AdminProjectsResponse>
```

---

## 🎨 **UI/UX Features**

### **Portfolio Navigation**

```typescript
// Dynamic category navigation
<nav className="flex flex-wrap gap-4 justify-center">
  <Link to="/portfolio" className="nav-link">All Work</Link>
  {categories.map((category) => (
    <Link
      key={category.id}
      to={`/portfolio/${category.slug}`}
      className="nav-link"
    >
      {category.name}
    </Link>
  ))}
</nav>
```

### **Subcategory Grid**

```typescript
// Subcategory cards with cover images
{currentCategory.portfolio_subcategories.map((subcategory) => (
  <div key={subcategory.id} className="subcategory-card">
    <img src={subcategory.cover_image_url} alt={subcategory.name} />
    <h3>{subcategory.name}</h3>
    <p>{subcategory.client_name}</p>
    <p>{subcategory.project_count} photos</p>
    <Link to={`/portfolio/${categorySlug}/${subcategory.slug}`}>
      View Gallery
    </Link>
  </div>
))}
```

### **Project Display**

```typescript
// Project cards with metadata
{projects.map((project) => (
  <div key={project.id} className="project-card">
    <img src={project.thumbnail_url} alt={project.title} />
    <h3>{project.title}</h3>
    <p>{project.description}</p>
    <div className="project-meta">
      <span>Views: {project.view_count}</span>
      <span>Category: {project.portfolio_subcategories?.portfolio_categories?.name}</span>
    </div>
  </div>
))}
```

---

## 🔧 **Implementation Examples**

### **1. Fetch Categories**

```typescript
const [categories, setCategories] = useState<PortfolioCategory[]>([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await portfolioService.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  fetchCategories();
}, []);
```

### **2. Load Category Content**

```typescript
useEffect(() => {
  const fetchData = async () => {
    if (categorySlug && subcategorySlug) {
      // Load specific subcategory
      const response = await portfolioService.getSubcategoryBySlug(categorySlug, subcategorySlug);
      setCurrentSubcategory(response.subcategory);
      setProjects(response.subcategory.portfolio_projects);
    } else if (categorySlug) {
      // Load specific category
      const category = await portfolioService.getCategoryBySlug(categorySlug);
      setCurrentCategory(category);
    } else {
      // Load all projects
      const response = await portfolioService.getPublishedProjects({
        page: currentPage,
        limit: 12,
      });
      setProjects(response.projects);
    }
  };

  fetchData();
}, [categorySlug, subcategorySlug, currentPage]);
```

### **3. Admin Category Creation**

```typescript
const createCategory = async (formData: CreateCategoryData) => {
  try {
    const category = await adminService.createCategory(formData);
    // Refresh categories list
    fetchCategories();
    return category;
  } catch (error) {
    console.error('Failed to create category:', error);
    throw error;
  }
};
```

### **4. Admin Subcategory Creation**

```typescript
const createSubcategory = async (formData: CreateSubcategoryData) => {
  try {
    const subcategory = await adminService.createSubcategory(formData);
    // Refresh categories list
    fetchCategories();
    return subcategory;
  } catch (error) {
    console.error('Failed to create subcategory:', error);
    throw error;
  }
};
```

---

## 🚀 **Migration Guide**

### **From Old Portfolio to New**

1. **Update Routes**: The new portfolio is available at the same routes
2. **Backward Compatibility**: Old portfolio page still works
3. **Gradual Migration**: You can switch between old and new implementations

### **Environment Setup**

```env
# .env file
VITE_API_BASE_URL=https://api.manishbosephotography.com/api
```

### **Testing the New System**

1. **Start the backend server** on port 3000
2. **Navigate to `/portfolio`** to see all projects
3. **Click on category links** to see subcategories
4. **Click on subcategory cards** to see specific client portfolios

---

## 📊 **Admin Dashboard Features**

### **Category Management**

- Create new categories (Maternity, Wedding, etc.)
- Edit category details and descriptions
- Set display order for categories
- Delete categories (with confirmation)

### **Subcategory Management**

- Create client-specific subcategories
- Upload cover images for subcategories
- Set client names, event dates, and locations
- Manage subcategory display order

### **Project Management**

- Create projects within specific subcategories
- Upload project images
- Set project metadata (title, description, tags)
- Toggle publish/unpublish status
- Delete projects with confirmation

### **Statistics Dashboard**

- Total projects count
- Published vs unpublished projects
- Category and subcategory counts
- Total view counts
- Recent projects list

---

## 🔍 **Search and Filtering**

### **Enhanced Search Parameters**

```typescript
// Search by category
GET /api/portfolio/published?category=maternity

// Search by subcategory
GET /api/portfolio/published?subcategory=john-sarah-wedding

// Search by tags
GET /api/portfolio/published?tags=wedding&tags=dance

// Combined search
GET /api/portfolio/published?category=wedding&subcategory=john-sarah&page=1&limit=10
```

### **Frontend Search Implementation**

```typescript
const searchProjects = async (searchParams: SearchParams) => {
  const response = await portfolioService.getPublishedProjects(searchParams);
  setProjects(response.projects);
  setPagination(response.pagination);
};
```

---

## 🎯 **Next Steps**

### **1. Admin Interface Development**
- Create admin dashboard components
- Implement category/subcategory forms
- Add project management interface
- Create statistics dashboard

### **2. Enhanced Features**
- Add search functionality
- Implement advanced filtering
- Add image lightbox for projects
- Create project detail pages

### **3. Performance Optimization**
- Implement image lazy loading
- Add pagination for large galleries
- Optimize bundle size
- Add caching strategies

### **4. User Experience**
- Add breadcrumb navigation
- Implement smooth transitions
- Add loading skeletons
- Improve mobile responsiveness

---

## 📝 **API Endpoints Summary**

### **Public Endpoints**
- `GET /api/portfolio/categories` - Get all categories
- `GET /api/portfolio/categories/:slug` - Get category by slug
- `GET /api/portfolio/categories/:categorySlug/:subcategorySlug` - Get subcategory
- `GET /api/portfolio/published` - Get published projects
- `GET /api/portfolio/featured` - Get featured projects
- `GET /api/portfolio/search` - Search projects

### **Admin Endpoints**
- `POST /api/portfolio/categories` - Create category
- `PUT /api/portfolio/categories/:id` - Update category
- `DELETE /api/portfolio/categories/:id` - Delete category
- `POST /api/portfolio/subcategories` - Create subcategory
- `PUT /api/portfolio/subcategories/:id` - Update subcategory
- `DELETE /api/portfolio/subcategories/:id` - Delete subcategory
- `POST /api/portfolio/` - Create project
- `PUT /api/portfolio/:id` - Update project
- `DELETE /api/portfolio/:id` - Delete project
- `PATCH /api/portfolio/:id/publish` - Toggle publish status

---

The frontend is now fully updated to support the new hierarchical category system. The new portfolio page provides a much better user experience with organized categories and client-specific subcategories, while the admin service enables complete management of the portfolio structure. 