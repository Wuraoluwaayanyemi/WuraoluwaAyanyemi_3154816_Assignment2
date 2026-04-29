import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * DELETE /api/delete
 * Deletes an appliance from the inventory by serial number.
 *
 * Request Body:
 * - SerialNumber: string (required) - Serial number of appliance to delete
 *
 * Response:
 * - 200: Success with message
 * - 400: Validation error or appliance not found
 * - 500: Server error
 */

export async function DELETE(req) {
  let db = null;

  try {
    // Parse request body
    const data = await req.json();
    const { SerialNumber } = data;

    // Validate required SerialNumber
    if (!SerialNumber || SerialNumber.trim() === '') {
      return NextResponse.json(
        {
          error: "SerialNumber is required to identify the appliance to delete",
          code: "MISSING_SERIAL_NUMBER"
        },
        { status: 400 }
      );
    }

    // Validate SerialNumber format
    const serialPattern = /^[A-Za-z0-9\-]{5,50}$/;
    if (!serialPattern.test(SerialNumber.trim())) {
      return NextResponse.json(
        {
          error: "Invalid SerialNumber format",
          code: "VALIDATION_ERROR",
          field: "SerialNumber"
        },
        { status: 400 }
      );
    }

    // Connect to database
    db = await connectDB();

    // Check if appliance exists
    const [existingAppliance] = await db.execute(
      "SELECT ApplianceID, UserID FROM Appliance WHERE SerialNumber = ?",
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

    const { ApplianceID, UserID } = existingAppliance[0];

    // Delete the appliance
    try {
      await db.execute(
        "DELETE FROM Appliance WHERE ApplianceID = ?",
        [ApplianceID]
      );
    } catch (deleteError) {
      console.error('Appliance deletion error:', deleteError);
      return NextResponse.json(
        { error: "Failed to delete appliance from database", code: "DELETE_FAILED" },
        { status: 500 }
      );
    }

    // Check if the user has any other appliances
    // If not, we could optionally delete the user record too, but for now we'll keep it
    // This maintains data integrity in case the user is referenced elsewhere

    // Success response
    return NextResponse.json(
      {
        message: "Appliance has been successfully deleted",
        code: "SUCCESS"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete appliance error:', error);

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