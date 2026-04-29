import { connectDB } from "@/lib/db";//Adds a new appliance to the inventory system.
import { NextResponse } from "next/server";

/**
 
 * Request Body:
 * - FirstName: string (required) - User's first name
 * - LastName: string (required) - User's last name
 * - Email: string (required) - User's email address
 * - Mobile: string (optional) - User's mobile number
 * - Eircode: string (optional) - User's Eircode
 * - ApplianceType: string (required) - Type of appliance
 * - Brand: string (optional) - Appliance brand
 * - ModelNumber: string (optional) - Appliance model number
 * - SerialNumber: string (required) - Unique serial number
 * - PurchaseDate: string (optional) - Purchase date (YYYY-MM-DD)
 * - WarrantyDate: string (optional) - Warranty expiry date (YYYY-MM-DD)
 * - Cost: number (optional) - Purchase cost
 */

function sanitize(input) {//Sanitizes input to prevent XSS attacks by escaping special characters
  if (typeof input !== "string") return input;
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// Validation patterns
const patterns = {
  name: /^[A-Za-z\s-]{2,60}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  mobile: /^(\+353|0)[0-9]{9,10}$/,
  eircode: /^[A-Z0-9]{3}\s?[A-Z0-9]{4}$/i,
  serialNumber: /^[A-Za-z0-9\-]{5,50}$/,
  brand: /^[A-Za-z0-9\s\-]{2,50}$/,
  modelNumber: /^[A-Za-z0-9\s\-]{1,50}$/
};

function validateField(field, value, pattern) {//Validates a field against its pattern, allowing empty values for optional fields
  if (!value || value.trim() === '') return true; // Empty fields are optional
  return pattern.test(value.trim());
}

export async function POST(req) {//Handles the addition of a new appliance to the inventory system
  try {
    const data = await req.json();

    const {
      FirstName,
      LastName,
      Email,
      Mobile,
      Eircode,
      ApplianceType,
      Brand,
      ModelNumber,
      SerialNumber,
      PurchaseDate,
      WarrantyDate,
      Cost
    } = data;

    // Validate required fields
    if (!FirstName || !LastName || !Email || !ApplianceType || !SerialNumber) {
      return NextResponse.json(
        {
          error: "Missing required fields: FirstName, LastName, Email, ApplianceType, and SerialNumber are required",
          code: "MISSING_REQUIRED_FIELDS"
        },
        { status: 400 }
      );
    }

    // Validate inputs
    const validations = [
      { field: 'FirstName', value: FirstName, pattern: patterns.name },
      { field: 'LastName', value: LastName, pattern: patterns.name },
      { field: 'Email', value: Email, pattern: patterns.email },
      { field: 'Mobile', value: Mobile, pattern: patterns.mobile },
      { field: 'Eircode', value: Eircode, pattern: patterns.eircode },
      { field: 'Brand', value: Brand, pattern: patterns.brand },
      { field: 'ModelNumber', value: ModelNumber, pattern: patterns.modelNumber },
      { field: 'SerialNumber', value: SerialNumber, pattern: patterns.serialNumber }
    ];

    for (const validation of validations) {//Iteration through the fields to be validated
      if (!validateField(validation.field, validation.value, validation.pattern)) {
        return NextResponse.json(
          {
            error: `Invalid ${validation.field} format`,
            code: "VALIDATION_ERROR",
            field: validation.field
          },
          { status: 400 }
        );
      }
    }

    const db = await connectDB();

    // Check if user exists
    const [existingUser] = await db.execute(
      "SELECT UserID FROM User WHERE Email = ?",
      [Email]
    );

    let userId;
    if (existingUser.length > 0) {
      userId = existingUser[0].UserID;
    } else {
      // Insert new user
      const [userResult] = await db.execute(
        `INSERT INTO User (FirstName, LastName, Email, Mobile, Eircode)
         VALUES (?, ?, ?, ?, ?)`,
        [sanitize(FirstName), sanitize(LastName), sanitize(Email), sanitize(Mobile), sanitize(Eircode)]
      );
      userId = userResult.insertId;
    }

    // Check if appliance already exists
    const [existingAppliance] = await db.execute(
      "SELECT * FROM Appliance WHERE SerialNumber = ?",
      [SerialNumber]
    );

    if (existingAppliance.length > 0) {//Error handling for duplicate appliance
      return NextResponse.json(
        {
          error: "An appliance with this serial number already exists",
          code: "DUPLICATE_APPLIANCE"
        },
        { status: 400 }
      );
    }

    // Insert appliance
    await db.execute(
      `INSERT INTO Appliance
      (UserID, ApplianceType, Brand, ModelNumber, SerialNumber, PurchaseDate, WarrantyDate, Cost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,//
        sanitize(ApplianceType),//Appliance type is required and needs to be sanitized for empty values
        sanitize(Brand),
        sanitize(ModelNumber),
        sanitize(SerialNumber),
        PurchaseDate,
        WarrantyDate,
        Cost
      ]
    );

    return NextResponse.json(
      {
        message: "Appliance has been added successfully",
        code: "SUCCESS"
      },
      { status: 201 }
    );

  } catch (error) {//Error handling for debugging
    console.error('Add appliance error:', error);
    // Handle different types of errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: "Database connection failed", code: "DB_CONNECTION_ERROR" },
        { status: 500 }
      );
    }

    if (error.message?.includes('JSON')) {
      return NextResponse.json(
        { error: "Invalid request format", code: "INVALID_JSON" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}