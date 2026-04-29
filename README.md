# Appliance Inventory Management System

A Next.js web application for managing appliance inventory with user management capabilities.

## Features

- **Search Appliances**: Search and filter appliances by various criteria
- **Add Appliances**: Add new appliances with user information
- **User Management**: Automatic user creation and management
- **Responsive Design**: Mobile-friendly interface
- **Input Validation**: Comprehensive client and server-side validation
- **Error Handling**: Robust error handling with user-friendly messages

## Tech Stack

- **Frontend**: Next.js 16, React 19, CSS Modules
- **Backend**: Next.js API Routes
- **Database**: MySQL with mysql2/promise
- **Styling**: Custom CSS with responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=appliance_inventory
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Documentation

### POST /api/add
Adds a new appliance to the inventory.

**Request Body:**
```json
{
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "john.doe@example.com",
  "Mobile": "0851234567",
  "Eircode": "D01 AB12",
  "ApplianceType": "Washing Machine",
  "Brand": "Samsung",
  "ModelNumber": "WM123",
  "SerialNumber": "SN123456789",
  "PurchaseDate": "2024-01-15",
  "WarrantyDate": "2027-01-15",
  "Cost": 599.99
}
```

**Response:**
```json
{
  "message": "Appliance has been added successfully",
  "code": "SUCCESS"
}
```

### PUT /api/update
Updates an existing appliance and associated user information.

**Request Body:**
```json
{
  "SerialNumber": "SN123456789",
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "john.doe@example.com",
  "Mobile": "0851234567",
  "Eircode": "D01 AB12",
  "ApplianceType": "Washing Machine",
  "Brand": "Samsung",
  "ModelNumber": "WM123",
  "PurchaseDate": "2024-01-15",
  "WarrantyDate": "2027-01-15",
  "Cost": 599.99
}
```

**Response:**
```json
{
  "message": "Appliance has been updated successfully",
  "code": "SUCCESS"
}
```

**Notes:**
- SerialNumber is required to identify which appliance to update
- Only provided fields will be updated (partial updates supported)
- Email changes are validated to prevent conflicts

### DELETE /api/delete
Deletes an appliance from the inventory by serial number.

**Request Body:**
```json
{
  "SerialNumber": "SN123456789"
}
```

**Response:**
```json
{
  "message": "Appliance has been successfully deleted",
  "code": "SUCCESS"
}
```

**Notes:**
- This action is permanent and cannot be undone
- Only deletes the appliance record, user data is preserved

## Database Schema

### User Table
- UserID (Primary Key)
- FirstName
- LastName
- Email (Unique)
- Mobile
- Eircode

### Appliance Table
- ApplianceID (Primary Key)
- UserID (Foreign Key)
- ApplianceType
- Brand
- ModelNumber
- SerialNumber (Unique)
- PurchaseDate
- WarrantyDate
- Cost

## Validation Rules

- **Names**: 2-60 characters, letters, spaces, and hyphens only
- **Email**: Standard email format
- **Mobile**: Irish format (+353 or 0 prefix, 9-10 digits)
- **Eircode**: Irish postal code format (XXX XXXX)
- **Serial Number**: 5-50 characters, alphanumeric with hyphens

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── components/    # Reusable components
│   ├── lib/          # Database utilities
│   └── [page]/       # Page components
└── lib/
    └── db.js         # Database connection
```

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Update documentation for API changes
4. Test thoroughly before submitting

## License

This project is part of an academic assignment.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
