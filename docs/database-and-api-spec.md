# ServiceMate Database Schema and API Specification

## 1. Overview

This document converts the ServiceMate PRD into an implementation-ready backend specification for a MERN stack application using `Node.js`, `Express.js`, `MongoDB`, `Mongoose`, `JWT`, `bcrypt`, `Nodemailer`, and `Cloudinary`.

## 2. Suggested Backend Structure

```text
backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
    utils/
    app.js
    server.js
```

## 3. Core Collections

## 3.1 User

Used for all roles: `user`, `technician`, and `admin`.

### Fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `name` | String | Yes | Full name |
| `email` | String | Yes | Unique, lowercase |
| `password` | String | Yes | Hashed with bcrypt |
| `phone` | String | No | Required for technicians |
| `role` | String | Yes | `user`, `technician`, `admin` |
| `isVerified` | Boolean | Yes | Email OTP verification status |
| `isActive` | Boolean | Yes | Admin can disable account |
| `avatarUrl` | String | No | Optional profile image |
| `createdAt` | Date | Yes | Auto-generated |
| `updatedAt` | Date | Yes | Auto-generated |

### Notes

- Keep all roles in one collection for simpler authentication.
- Technician-specific details should live in a separate `TechnicianProfile` collection.

## 3.2 OtpVerification

Stores OTPs for signup and resend flow.

### Fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `email` | String | Yes | Lowercase |
| `otp` | String | Yes | Store hashed OTP if possible |
| `purpose` | String | Yes | Example: `signup` |
| `attempts` | Number | Yes | Default `0` |
| `expiresAt` | Date | Yes | 5 minute expiry |
| `createdAt` | Date | Yes | Auto-generated |

### Rules

- OTP expires in 5 minutes.
- Maximum 3 verification attempts.
- Resend should invalidate prior OTP.
- Add TTL index on `expiresAt`.

## 3.3 TechnicianProfile

Stores technician-specific data and geolocation.

### Fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `userId` | ObjectId | Yes | Ref `User`, unique |
| `serviceCategoryId` | ObjectId | Yes | Ref `ServiceCategory` |
| `experienceYears` | Number | Yes | Integer or decimal |
| `bio` | String | No | About technician |
| `address` | String | No | Human-readable location |
| `location` | GeoJSON Point | Yes | `{ type: "Point", coordinates: [lng, lat] }` |
| `approvalStatus` | String | Yes | `pending`, `approved`, `rejected` |
| `isAvailable` | Boolean | Yes | Used for search filters |
| `averageRating` | Number | Yes | Default `0` |
| `reviewCount` | Number | Yes | Default `0` |
| `completedJobs` | Number | Yes | Default `0` |
| `createdAt` | Date | Yes | Auto-generated |
| `updatedAt` | Date | Yes | Auto-generated |

### Indexes

- `2dsphere` index on `location`
- index on `serviceCategoryId`
- index on `approvalStatus`
- index on `isAvailable`

## 3.4 TechnicianActivity

Portfolio items uploaded by technicians.

### Fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `technicianId` | ObjectId | Yes | Ref `TechnicianProfile` |
| `title` | String | Yes | Work title |
| `description` | String | Yes | Work details |
| `imageUrl` | String | Yes | Cloudinary URL |
| `publicId` | String | No | Cloudinary public id |
| `completedAt` | Date | No | Work completion date |
| `createdAt` | Date | Yes | Auto-generated |
| `updatedAt` | Date | Yes | Auto-generated |

## 3.5 ServiceCategory

Admin-managed service categories.

### Fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `name` | String | Yes | Unique category name |
| `slug` | String | Yes | Unique identifier |
| `description` | String | No | Category summary |
| `isActive` | Boolean | Yes | Admin can hide category |
| `createdAt` | Date | Yes | Auto-generated |
| `updatedAt` | Date | Yes | Auto-generated |

## 3.6 Booking

Represents a user request to a technician.

### Fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `userId` | ObjectId | Yes | Ref `User` |
| `technicianUserId` | ObjectId | Yes | Ref `User` with role `technician` |
| `technicianProfileId` | ObjectId | Yes | Ref `TechnicianProfile` |
| `serviceCategoryId` | ObjectId | Yes | Ref `ServiceCategory` |
| `bookingDate` | Date | Yes | Scheduled start time |
| `address` | String | Yes | Service location |
| `location` | GeoJSON Point | No | Optional service coordinates |
| `issueDescription` | String | Yes | User problem summary |
| `status` | String | Yes | `pending`, `accepted`, `rejected`, `completed`, `cancelled` |
| `statusHistory` | Array | Yes | Status change log |
| `cancelledBy` | String | No | `user`, `technician`, `admin` |
| `rejectionReason` | String | No | Technician/admin note |
| `completionNote` | String | No | Optional close note |
| `createdAt` | Date | Yes | Auto-generated |
| `updatedAt` | Date | Yes | Auto-generated |

### Rules

- User creates bookings with initial status `pending`.
- Technician can move status from `pending` to `accepted` or `rejected`.
- Accepted bookings can later become `completed` or `cancelled`.
- Review submission only allowed when booking status is `completed`.

## 3.7 Review

User review linked to a completed booking.

### Fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `bookingId` | ObjectId | Yes | Ref `Booking`, unique per booking |
| `userId` | ObjectId | Yes | Ref `User` |
| `technicianUserId` | ObjectId | Yes | Ref `User` |
| `technicianProfileId` | ObjectId | Yes | Ref `TechnicianProfile` |
| `rating` | Number | Yes | `1` to `5` |
| `comment` | String | No | Optional review |
| `isVisible` | Boolean | Yes | Admin moderation flag |
| `createdAt` | Date | Yes | Auto-generated |
| `updatedAt` | Date | Yes | Auto-generated |

### Rules

- One review per booking.
- Only booking owner can create the review.
- Aggregate `averageRating` and `reviewCount` into `TechnicianProfile`.

## 4. Recommended Mongoose Shape

## 4.1 User Model

```js
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ["user", "technician", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  avatarUrl: { type: String }
}
```

## 4.2 TechnicianProfile Model

```js
{
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  serviceCategoryId: { type: Schema.Types.ObjectId, ref: "ServiceCategory", required: true },
  experienceYears: { type: Number, required: true, min: 0 },
  bio: { type: String, trim: true },
  address: { type: String, trim: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  isAvailable: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 }
}
```

## 4.3 Booking Model

```js
{
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  technicianUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  technicianProfileId: { type: Schema.Types.ObjectId, ref: "TechnicianProfile", required: true },
  serviceCategoryId: { type: Schema.Types.ObjectId, ref: "ServiceCategory", required: true },
  bookingDate: { type: Date, required: true },
  address: { type: String, required: true, trim: true },
  location: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: [Number]
  },
  issueDescription: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
    default: "pending"
  },
  statusHistory: [
    {
      status: String,
      changedBy: { type: Schema.Types.ObjectId, ref: "User" },
      changedAt: { type: Date, default: Date.now },
      note: String
    }
  ],
  cancelledBy: { type: String, enum: ["user", "technician", "admin"] },
  rejectionReason: { type: String, trim: true },
  completionNote: { type: String, trim: true }
}
```

## 5. Authentication and Authorization

## 5.1 JWT Payload

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "user"
}
```

## 5.2 Middleware

- `authMiddleware`: verifies JWT and loads current user
- `requireVerifiedUser`: blocks unverified accounts
- `authorizeRoles(...roles)`: RBAC enforcement
- `requireTechnicianApproval`: only approved technicians can receive bookings

## 6. API Conventions

- Base path: `/api/v1`
- Response shape:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

- Error shape:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": []
}
```

## 7. REST API Specification

## 7.1 Auth

### `POST /api/v1/auth/register`

Registers a normal user.

#### Request

```json
{
  "name": "Amit Kumar",
  "email": "amit@example.com",
  "password": "Password@123",
  "phone": "9876543210"
}
```

### `POST /api/v1/auth/register-technician`

Registers a technician account and creates a pending technician profile.

#### Request

```json
{
  "name": "Ravi Electrician",
  "email": "ravi@example.com",
  "password": "Password@123",
  "phone": "9876543210",
  "serviceCategoryId": "category_id",
  "experienceYears": 5,
  "address": "Chennai",
  "latitude": 13.0827,
  "longitude": 80.2707
}
```

### `POST /api/v1/auth/verify-otp`

Verifies signup OTP.

#### Request

```json
{
  "email": "amit@example.com",
  "otp": "123456"
}
```

### `POST /api/v1/auth/resend-otp`

Resends OTP if account is not yet verified.

### `POST /api/v1/auth/login`

Logs in user and returns JWT.

#### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "name": "Amit Kumar",
      "email": "amit@example.com",
      "role": "user"
    }
  }
}
```

### `GET /api/v1/auth/me`

Returns current authenticated user.

### `POST /api/v1/auth/logout`

Client-side token discard endpoint if needed for consistency.

## 7.2 Service Categories

### `GET /api/v1/service-categories`

Public list of active categories.

### `POST /api/v1/service-categories`

Admin creates a category.

### `PATCH /api/v1/service-categories/:id`

Admin updates a category.

### `DELETE /api/v1/service-categories/:id`

Admin disables or deletes a category.

## 7.3 Technician Discovery and Profiles

### `GET /api/v1/technicians/nearby`

Search technicians by location and optional filters.

#### Query Params

- `lat`
- `lng`
- `radiusKm`
- `serviceCategoryId`
- `isAvailable`
- `sortBy=distance|rating`

#### Example

`GET /api/v1/technicians/nearby?lat=13.0827&lng=80.2707&radiusKm=5&serviceCategoryId=123`

### `GET /api/v1/technicians`

Admin can view all technicians. Public version can optionally list approved technicians.

### `GET /api/v1/technicians/:id`

Returns public technician profile with portfolio and recent reviews.

### `PATCH /api/v1/technicians/profile`

Technician updates own profile.

### `PATCH /api/v1/technicians/availability`

Technician updates availability status.

#### Request

```json
{
  "isAvailable": true
}
```

## 7.4 Technician Portfolio

### `POST /api/v1/technician-activities`

Technician uploads a portfolio item.

#### Request

- `multipart/form-data`
- fields: `title`, `description`, `completedAt`, `image`

### `GET /api/v1/technician-activities/me`

Technician views own portfolio items.

### `GET /api/v1/technicians/:id/activities`

Public portfolio for a technician.

### `PATCH /api/v1/technician-activities/:id`

Technician updates own portfolio item.

### `DELETE /api/v1/technician-activities/:id`

Technician deletes own portfolio item.

## 7.5 Bookings

### `POST /api/v1/bookings`

User creates booking.

#### Request

```json
{
  "technicianProfileId": "technician_profile_id",
  "serviceCategoryId": "category_id",
  "bookingDate": "2026-03-20T10:00:00.000Z",
  "address": "Flat 10, Anna Nagar, Chennai",
  "latitude": 13.084,
  "longitude": 80.278,
  "issueDescription": "Switch board sparking in kitchen"
}
```

### `GET /api/v1/bookings/me`

User views own bookings.

### `GET /api/v1/bookings/technician`

Technician views assigned bookings.

### `GET /api/v1/bookings/:id`

User, assigned technician, or admin views one booking.

### `PATCH /api/v1/bookings/:id/cancel`

User cancels own booking, admin can cancel any booking.

### `PATCH /api/v1/bookings/:id/respond`

Technician accepts or rejects pending booking.

#### Request

```json
{
  "action": "accepted",
  "note": "Available at requested time"
}
```

### `PATCH /api/v1/bookings/:id/status`

Technician or admin updates booking progress.

#### Request

```json
{
  "status": "completed",
  "note": "Work finished successfully"
}
```

## 7.6 Reviews

### `POST /api/v1/reviews`

User submits review for a completed booking.

#### Request

```json
{
  "bookingId": "booking_id",
  "rating": 5,
  "comment": "Quick and professional service"
}
```

### `GET /api/v1/technicians/:id/reviews`

Public technician reviews.

### `GET /api/v1/reviews/me`

User views reviews submitted by self.

### `PATCH /api/v1/reviews/:id/visibility`

Admin hides or restores a review.

## 7.7 Admin

All admin routes require `role=admin`.

### `GET /api/v1/admin/dashboard`

Returns platform analytics.

#### Example Response

```json
{
  "success": true,
  "data": {
    "totalUsers": 120,
    "totalTechnicians": 40,
    "totalBookings": 220,
    "completedBookings": 160,
    "pendingTechnicians": 8
  }
}
```

### `GET /api/v1/admin/users`

View all users.

### `PATCH /api/v1/admin/users/:id/status`

Enable or disable user account.

### `GET /api/v1/admin/technicians`

View all technician profiles.

### `PATCH /api/v1/admin/technicians/:id/approval`

Approve or reject technician.

#### Request

```json
{
  "approvalStatus": "approved"
}
```

### `GET /api/v1/admin/bookings`

View all bookings with filters.

### `PATCH /api/v1/admin/bookings/:id/cancel`

Cancel fraudulent or invalid booking.

### `GET /api/v1/admin/reviews`

View all reviews for moderation.

## 8. Validation Rules

- `email`: valid email format, unique
- `password`: minimum 8 characters
- `otp`: exactly 6 digits
- `rating`: integer from 1 to 5
- `experienceYears`: minimum 0
- `bookingDate`: must be in the future at creation time
- `latitude`: range `-90` to `90`
- `longitude`: range `-180` to `180`

## 9. Booking State Rules

Allowed status flow:

1. `pending -> accepted`
2. `pending -> rejected`
3. `pending -> cancelled`
4. `accepted -> completed`
5. `accepted -> cancelled`

Disallow:

- `completed -> any other state`
- `rejected -> accepted`
- duplicate review creation for same booking

## 10. Important Security Decisions

- Hash passwords with `bcrypt`
- Store JWT in secure HTTP-only cookies or secure client storage depending on frontend design
- Hash OTP values instead of storing plain text when possible
- Rate-limit login, OTP verify, and OTP resend endpoints
- Validate uploaded images before sending to Cloudinary
- Restrict all write routes with role checks

## 11. Recommended Next Build Order

1. Set up backend project structure and environment config
2. Implement `User`, `OtpVerification`, `ServiceCategory`, `TechnicianProfile`
3. Build auth with registration, OTP, login, and JWT middleware
4. Build technician discovery with geospatial query
5. Build booking workflow
6. Build review system and rating aggregation
7. Build admin dashboard APIs
8. Connect React frontend to these endpoints
