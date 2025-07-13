# Property Approval Workflow - Complete Implementation

This document provides a comprehensive overview of the property approval system implemented for the TamudaStay booking platform.

## 📋 Overview

The property approval workflow ensures quality control by requiring admin approval before properties become visible to the public. This system provides security, proper access controls, and a smooth user experience for all stakeholders.

## 🏗️ System Architecture

### Database Schema

The `properties` table includes the following key fields for the approval workflow:

```sql
-- Core approval fields
status TEXT NOT NULL DEFAULT 'pending'  -- 'pending' | 'approved' | 'rejected'
owner_id INTEGER NOT NULL REFERENCES users(id)
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

-- Constraints
CONSTRAINT properties_status_check CHECK (status IN ('pending', 'approved', 'rejected'))

-- Indexes for performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_owner_status ON properties(owner_id, status);
```

### Status Flow

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│   PENDING   │───▶│   APPROVED   │───▶│   VISIBLE    │
│  (default)  │    │  (by admin)  │    │ (to public)  │
└─────────────┘    └──────────────┘    └──────────────┘
       │
       ▼
┌─────────────┐
│  REJECTED   │
│ (by admin)  │
└─────────────┘
```

## 🔧 Backend Implementation

### API Endpoints

#### Public Routes (No Auth Required)
```typescript
GET /api/properties/public           // Only approved properties
GET /api/properties/public/:id       // Only approved property by ID
```

#### Host Routes (Auth Required)
```typescript
POST /api/properties                 // Create property (auto-pending for hosts)
PUT /api/properties/:id              // Update own property
GET /api/properties/owner/:ownerId   // Get own properties only
```

#### Admin Routes (Admin Auth Required)
```typescript
GET /api/properties                  // All properties regardless of status
GET /api/properties/:id              // Any property by ID
PATCH /api/properties/:id/approve    // Approve property
PATCH /api/properties/:id/reject     // Reject property
DELETE /api/properties/:id           // Delete any property
```

### Key Backend Features

1. **Automatic Status Assignment**: New properties from hosts are automatically set to "pending"
2. **Owner ID Enforcement**: Properties are automatically assigned to the authenticated user
3. **Role-Based Access**: Different endpoints based on user role
4. **Audit Logging**: All approval actions are logged for tracking

### Security Implementation

```typescript
// Property creation enforces owner and status
app.post("/api/properties", requireAuth, async (req, res) => {
  const finalPropertyData = {
    ...propertyData,
    ownerId: parseInt(userId),
    status: (userRole === 'admin' || userRole === 'staff') ? 'approved' : 'pending'
  };
  // ...
});

// Host endpoint only returns own properties
app.get("/api/properties/owner/:ownerId", requireAuth, async (req, res) => {
  const properties = await storage.getPropertiesByOwner(ownerId);
  // Only returns properties where ownerId matches
});
```

## 🎨 Frontend Implementation

### PropertiesContext (State Management)

The context provides role-based property fetching:

```typescript
const fetchProperties = async () => {
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');
  
  if (isAdminUser) {
    data = await propertiesApi.getAllAdmin();      // All properties
  } else if (isOwner && userId) {
    data = await propertiesApi.getByOwner(userId);  // Own properties only
  } else {
    data = await propertiesApi.getAll();           // Approved only
  }
};
```

### Admin Dashboard Features

1. **Property Tabs**: Pending, Approved, Rejected, All Properties
2. **Bulk Actions**: Approve/Reject with visual feedback
3. **Property Details**: Full property information for review
4. **Status Indicators**: Clear visual status badges
5. **Search & Filter**: Find properties quickly

```typescript
const handleApproveProperty = async (id: string) => {
  await approveProperty(id);
  toast({
    title: "Property approved",
    description: "The property listing has been published and is now visible to visitors.",
  });
};
```

### Host Dashboard Features

1. **Status Visibility**: Clear status badges (Pending/Active/Rejected)
2. **Property Stats**: Total, Active, Pending counts
3. **Submission Feedback**: Clear messaging about approval process
4. **Notification Center**: Real-time status updates

```typescript
// Property creation with proper feedback
const handleAddProperty = async (propertyData: any) => {
  await addProperty({
    ...propertyData,
    ownerId: parseInt(ownerId),
    status: 'pending',
  });
  
  toast({
    title: "Property submitted",
    description: "Your property listing has been submitted for admin review and will be published once approved.",
  });
};
```

### Notification System

Real-time notifications for property status changes:

```typescript
// Property status notifications
const notifications = [
  {
    type: 'property_approved',
    title: 'Property Approved',
    message: 'Your property "Villa Tamuda Bay" has been approved and is now live!',
  },
  {
    type: 'property_rejected',
    title: 'Property Rejected',
    message: 'Your property "Riad Martil" needs updates before approval.',
  }
];
```

## 🔒 Security Features

### Access Control Matrix

| User Role | Create | View Own | View All | Approve | Reject | Delete |
|-----------|--------|----------|----------|---------|--------|--------|
| Public    | ❌     | ❌       | ✅ (approved only) | ❌ | ❌ | ❌ |
| Host      | ✅     | ✅       | ❌       | ❌     | ❌     | ❌ |
| Admin     | ✅     | ✅       | ✅       | ✅     | ✅     | ✅ |

### Security Measures

1. **Input Validation**: Zod schemas validate all property data
2. **Authentication**: JWT tokens for all authenticated routes
3. **Authorization**: Role-based access control
4. **Data Isolation**: Hosts can only access their own properties
5. **Audit Trail**: All actions logged with user and timestamp

## 🧪 Testing

### Automated Test Suite

The system includes comprehensive tests:

```bash
node test-property-approval-workflow.mjs
```

Tests cover:
- ✅ Property creation with correct status
- ✅ Admin access to all properties
- ✅ Host access restricted to own properties
- ✅ Public access to approved properties only
- ✅ Approval workflow functionality
- ✅ Rejection workflow functionality
- ✅ Status visibility updates

### Manual Testing Scenarios

1. **Host Property Submission**:
   - Create property as host → Status: "pending"
   - Property not visible on public site
   - Property visible in host dashboard with "Pending" badge

2. **Admin Approval Process**:
   - Admin sees property in "Pending Review" tab
   - Admin approves property → Status: "approved"
   - Property now visible on public site

3. **Security Validation**:
   - Host A cannot see Host B's properties
   - Non-admin cannot access admin endpoints
   - Public cannot see pending/rejected properties

## 📁 File Structure

```
/server/
  ├── routes.ts                    # API endpoints
  ├── storage.ts                   # Database operations
  └── db.ts                        # Database connection

/client/src/
  ├── contexts/PropertiesContext.tsx    # State management
  ├── pages/AdminProperties.tsx         # Admin dashboard
  ├── pages/OwnerDashboard.tsx         # Host dashboard
  ├── components/PropertyNotificationCenter.tsx  # Notifications
  └── lib/api.ts                       # API client

/migrations/
  └── 003_property_approval_system.sql # Database schema

/tests/
  └── test-property-approval-workflow.mjs # Test suite
```

## 🚀 Deployment Checklist

- [ ] Run database migration: `003_property_approval_system.sql`
- [ ] Update environment variables for JWT authentication
- [ ] Deploy backend with new routes
- [ ] Deploy frontend with updated components
- [ ] Run test suite to verify functionality
- [ ] Configure notification system (email/SMS)
- [ ] Set up monitoring for approval queue

## 📞 API Reference

### Property Creation
```bash
POST /api/properties
Content-Type: application/json
Authorization: Bearer <token>
X-User-ID: <user_id>
X-User-Role: <user_role>

{
  "title": "Beautiful Villa",
  "description": "A stunning property...",
  "price": 150,
  "location": "Martil, Morocco",
  "bedrooms": 3,
  "bathrooms": 2,
  "capacity": 6,
  "amenities": ["WiFi", "AC", "Pool"],
  "images": ["https://example.com/image1.jpg"]
}
```

### Property Approval
```bash
PATCH /api/properties/:id/approve
Authorization: Bearer <admin_token>
```

### Property Rejection
```bash
PATCH /api/properties/:id/reject
Authorization: Bearer <admin_token>
```

## 🔄 Future Enhancements

1. **Email Notifications**: Automatic emails on status changes
2. **Review Comments**: Admin feedback on rejections
3. **Bulk Actions**: Approve/reject multiple properties
4. **Auto-Approval**: Rules-based automatic approval
5. **Analytics**: Approval metrics and timing
6. **Mobile App**: Property management on mobile

## 🛠️ Troubleshooting

### Common Issues

1. **Properties not appearing for hosts**:
   - Check `ownerId` assignment in property creation
   - Verify user authentication and role

2. **Public sees pending properties**:
   - Check public API endpoint filtering
   - Verify database status constraints

3. **Admin cannot approve**:
   - Check admin role assignment
   - Verify authentication middleware

### Debug Commands

```bash
# Check property status distribution
SELECT status, COUNT(*) FROM properties GROUP BY status;

# Find properties without owners
SELECT * FROM properties WHERE owner_id IS NULL;

# Check user roles
SELECT id, username, role FROM users;
```

---

## 📋 Summary

This property approval workflow provides:

✅ **Security**: Role-based access control and data isolation  
✅ **Quality Control**: Admin review before publication  
✅ **User Experience**: Clear status feedback and notifications  
✅ **Scalability**: Efficient database queries and caching  
✅ **Maintainability**: Clean code structure and comprehensive tests  

The system ensures that only quality, admin-approved properties are visible to the public while providing hosts with clear feedback on their listing status and admins with efficient tools for property management.
