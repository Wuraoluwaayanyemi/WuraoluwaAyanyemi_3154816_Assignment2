import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * PUT /api/update
 * Updates an existing appliance and associated user information.
 *
 * Request Body:
 * - SerialNumber: string (required) - Serial number of appliance to update
 * - FirstName: string (optional) - User's first name
 * - LastName: string (optional) - User's last name
 * - Email: string (optional) - User's email address
 * - Mobile: string (optional) - User's mobile number
 * - Eircode: string (optional) - User's Eircode
 * - ApplianceType: string (optional) - Type of appliance
 * - Brand: string (optional) - Appliance brand
 * - ModelNumber: string (optional) - Appliance model number
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

/**
 * Validates a field against its pattern
 * @param {string} field - Field name for error messages
 * @param {string} value - Value to validate
 * @param {RegExp} pattern - Regex pattern to test against
 * @returns {boolean} - True if valid or empty (for optional fields)
 */
function validateField(field, value, pattern) {
  if (!value || value.trim() === '') return true; // Empty fields are optional
  return pattern.test(value.trim());
}

/*PUT handler for updating appliances
 */
export async function PUT(req) {
  let db = null;

  try {
    // Parse request body
    const data = await req.json();

    const {
      SerialNumber,
      FirstName,
      LastName,
      Email,
      Mobile,
      Eircode,
      ApplianceType,
      Brand,
      ModelNumber,
      PurchaseDate,
      WarrantyDate,
      Cost
    } = data;

    // Validate required SerialNumber
    if (!SerialNumber || SerialNumber.trim() === '') {
      return NextResponse.json(
        {
          error: "SerialNumber is required to identify the appliance to update",
          code: "MISSING_SERIAL_NUMBER"
        },
        { status: 400 }
      );
    }

    // Validate SerialNumber format
    if (!validateField('SerialNumber', SerialNumber, patterns.serialNumber)) {
      return NextResponse.json(
        {
          error: "Invalid SerialNumber format",
          code: "VALIDATION_ERROR",
          field: "SerialNumber"
        },
        { status: 400 }
      );
    }

    // Validate other input formats if provided
    const validations = [
      { field: 'FirstName', value: FirstName, pattern: patterns.name },
      { field: 'LastName', value: LastName, pattern: patterns.name },
      { field: 'Email', value: Email, pattern: patterns.email },
      { field: 'Mobile', value: Mobile, pattern: patterns.mobile },
      { field: 'Eircode', value: Eircode, pattern: patterns.eircode },
      { field: 'Brand', value: Brand, pattern: patterns.brand },
      { field: 'ModelNumber', value: ModelNumber, pattern: patterns.modelNumber }
    ];

    for (const validation of validations) {
      if (validation.value && !validateField(validation.field, validation.value, validation.pattern)) {
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

    // Connect to database
    db = await connectDB();

    // Find the appliance to update
    const [existingAppliance] = await db.execute(
      `SELECT a.ApplianceID, a.UserID, u.Email as CurrentEmail
       FROM Appliance a
       JOIN User u ON a.UserID = u.UserID
       WHERE a.SerialNumber = ?`,
      [SerialNumber]
    );

    if (existingAppliance.length === 0) {
      return NextResponse.json(
        {
          error: "Appliance with this serial number not found",
          code: "APPLIANCE_NOT_FOUND"
        },
        { status: 404 }
      );
    }

    const { ApplianceID, UserID, CurrentEmail } = existingAppliance[0];

    // If email is being changed, check if new email already exists for another user
    if (Email && Email !== CurrentEmail) {
      const [emailCheck] = await db.execute(
        "SELECT UserID FROM User WHERE Email = ? AND UserID != ?",
        [Email, UserID]
      );

      if (emailCheck.length > 0) {
        return NextResponse.json(
          {
            error: "Email address already exists for another user",
            code: "EMAIL_EXISTS"
          },
          { status: 400 }
        );
      }
    }

    // Update user information if provided
    if (FirstName || LastName || Email || Mobile || Eircode) {
      const updateFields = [];
      const updateValues = [];

      if (FirstName) {
        updateFields.push("FirstName = ?");
        updateValues.push(sanitize(FirstName));
      }
      if (LastName) {
        updateFields.push("LastName = ?");
        updateValues.push(sanitize(LastName));
      }
      if (Email) {
        updateFields.push("Email = ?");
        updateValues.push(sanitize(Email));
      }
      if (Mobile !== undefined) {
        updateFields.push("Mobile = ?");
        updateValues.push(Mobile ? sanitize(Mobile) : null);
      }
      if (Eircode !== undefined) {
        updateFields.push("Eircode = ?");
        updateValues.push(Eircode ? sanitize(Eircode) : null);
      }

      if (updateFields.length > 0) {
        updateValues.push(UserID);
        await db.execute(
          `UPDATE User SET ${updateFields.join(", ")} WHERE UserID = ?`,
          updateValues
        );
      }
    }

    // Update appliance information if provided
    if (ApplianceType || Brand || ModelNumber || PurchaseDate !== undefined || WarrantyDate !== undefined || Cost !== undefined) {
      const updateFields = [];
      const updateValues = [];

      if (ApplianceType) {
        updateFields.push("ApplianceType = ?");
        updateValues.push(sanitize(ApplianceType));
      }
      if (Brand !== undefined) {
        updateFields.push("Brand = ?");
        updateValues.push(Brand ? sanitize(Brand) : null);
      }
      if (ModelNumber !== undefined) {
        updateFields.push("ModelNumber = ?");
        updateValues.push(ModelNumber ? sanitize(ModelNumber) : null);
      }
      if (PurchaseDate !== undefined) {
        updateFields.push("PurchaseDate = ?");
        updateValues.push(PurchaseDate || null);
      }
      if (WarrantyDate !== undefined) {
        updateFields.push("WarrantyDate = ?");
        updateValues.push(WarrantyDate || null);
      }
      if (Cost !== undefined) {
        updateFields.push("Cost = ?");
        updateValues.push(Cost || null);
      }

      if (updateFields.length > 0) {
        updateValues.push(ApplianceID);
        await db.execute(
          `UPDATE Appliance SET ${updateFields.join(", ")} WHERE ApplianceID = ?`,
          updateValues
        );
      }
    }

    // Success response
    return NextResponse.json(
      {
        message: "Appliance has been updated successfully",
        code: "SUCCESS"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update appliance error:', error);

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