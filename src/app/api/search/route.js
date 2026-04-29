import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

function sanitize(input) {//Sanitization to prevent XSS attacks
  if (typeof input !== "string") return input;// If it is not a string, return it as it is 
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
// Validation with regex patterns
const patterns = {
  name: /^[A-Za-z\s-]{2,60}$/,// Allows letters, spaces, and hyphens
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,//Basic email standard
  mobile: /^(\+353|0)[0-9]{9,10}$/,//Irish mobile numbers
  eircode: /^[A-Z0-9]{3}\s?[A-Z0-9]{4}$/i,//Eircode standard format
  serialNumber: /^[A-Za-z0-9\-]{5,50}$/,//Alphanumeric with hyphens
  brand: /^[A-Za-z0-9\s\-]{2,50}$/,//Allows letters, numbers, spaces, and hyphens
  modelNumber: /^[A-Za-z0-9\s\-]{1,50}$///Allows letters, numbers, spaces, and hyphens
};

function validateField(field, value, pattern) {//Checks the users answer against the regex pattern
  if (!value || value.trim() === '') return true; // Empty fields are optional
  return pattern.test(value.trim());
}

export async function GET(req) {//Handles the search functionality
  try {
    const { searchParams } = new URL(req.url);//Search parameters are extracted from the request URL using the URL API. 
    // Extracting search parameters
    const searchTerm = searchParams.get('q') || '';
    const firstName = searchParams.get('firstName') || '';
    const lastName = searchParams.get('lastName') || '';
    const email = searchParams.get('email') || '';
    const mobile = searchParams.get('mobile') || '';
    const eircode = searchParams.get('eircode') || '';
    const applianceType = searchParams.get('applianceType') || '';
    const brand = searchParams.get('brand') || '';
    const modelNumber = searchParams.get('modelNumber') || '';
    const serialNumber = searchParams.get('serialNumber') || '';

    // Validate inputs
    const validations = [//Listing out the fields to be validated
      { field: 'firstName', value: firstName, pattern: patterns.name },
      { field: 'lastName', value: lastName, pattern: patterns.name },
      { field: 'email', value: email, pattern: patterns.email },
      { field: 'mobile', value: mobile, pattern: patterns.mobile },
      { field: 'eircode', value: eircode, pattern: patterns.eircode },
      { field: 'brand', value: brand, pattern: patterns.brand },
      { field: 'modelNumber', value: modelNumber, pattern: patterns.modelNumber },
      { field: 'serialNumber', value: serialNumber, pattern: patterns.serialNumber }
    ];

    for (const validation of validations) {//Iteration
      if (!validateField(validation.field, validation.value, validation.pattern)) {
        return NextResponse.json(
          { error: `Invalid ${validation.field} input format` },//Error message for invalid input
          { status: 400 }
        );
      }
    }

    const db = await connectDB();//Connecting to the database

    // Build dynamic query with JOIN
    let query = `
      SELECT
        u.UserID,
        u.FirstName,
        u.LastName,
        u.Email,
        u.Mobile,
        u.Eircode,
        a.ApplianceID,
        a.ApplianceType,
        a.Brand,
        a.ModelNumber,
        a.SerialNumber,
        DATE_FORMAT(a.PurchaseDate, '%Y-%m-%d') as PurchaseDate,
        DATE_FORMAT(a.WarrantyDate, '%Y-%m-%d') as WarrantyDate,
        a.Cost
      FROM User u
      LEFT JOIN Appliance a ON u.UserID = a.UserID
      WHERE 1=1
    `;

    const params = [];//Parameters array for the prepared statements

    // Adding search conditions
    if (searchTerm.trim()) {
      query += ` AND (
        u.FirstName LIKE ? OR
        u.LastName LIKE ? OR
        u.Email LIKE ? OR
        a.ApplianceType LIKE ? OR
        a.Brand LIKE ? OR
        a.ModelNumber LIKE ? OR
        a.SerialNumber LIKE ?
      )`;
      const searchWildcard = `%${searchTerm.trim()}%`;//These wildcards allow for partial matches in the search term, allowing for flexibility
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);//
    }
// Adding filters for each field filters
    if (firstName.trim()) {
      query += ` AND u.FirstName LIKE ?`;
      params.push(`%${firstName.trim()}%`);
    }
    if (lastName.trim()) {
      query += ` AND u.LastName LIKE ?`;
      params.push(`%${lastName.trim()}%`);
    }
    if (email.trim()) {
      query += ` AND u.Email LIKE ?`;
      params.push(`%${email.trim()}%`);
    }
    if (mobile.trim()) {
      query += ` AND u.Mobile LIKE ?`;
      params.push(`%${mobile.trim()}%`);
    }
    if (eircode.trim()) {
      query += ` AND u.Eircode LIKE ?`;
      params.push(`%${eircode.trim()}%`);
    }
    if (applianceType.trim()) {
      query += ` AND a.ApplianceType LIKE ?`;
      params.push(`%${applianceType.trim()}%`);
    }
    if (brand.trim()) {
      query += ` AND a.Brand LIKE ?`;
      params.push(`%${brand.trim()}%`);
    }
    if (modelNumber.trim()) {
      query += ` AND a.ModelNumber LIKE ?`;
      params.push(`%${modelNumber.trim()}%`);
    }
    if (serialNumber.trim()) {
      query += ` AND a.SerialNumber LIKE ?`;
      params.push(`%${serialNumber.trim()}%`);
    }

    query += ` ORDER BY u.LastName, u.FirstName, a.ApplianceType`;//Arrangingthe results by last name, first name, and appliance type
    const [rows] = await db.execute(query, params);//Executing the query with the parameters

    // Grouping results by user for better display
    const results = [];
    const userMap = new Map();
    rows.forEach(row => {
      const userKey = row.UserID;

      if (!userMap.has(userKey)) {//If the user doee not exist, add them
        userMap.set(userKey, {
          UserID: row.UserID,
          FirstName: sanitize(row.FirstName),
          LastName: sanitize(row.LastName),
          Email: sanitize(row.Email),
          Mobile: sanitize(row.Mobile),
          Eircode: sanitize(row.Eircode),
          appliances: []
        });
      }

      if (row.ApplianceID) {//If the appliance exists, add it to the user's appliance list
        userMap.get(userKey).appliances.push({
          ApplianceID: row.ApplianceID,
          ApplianceType: sanitize(row.ApplianceType),
          Brand: sanitize(row.Brand),
          ModelNumber: sanitize(row.ModelNumber),
          SerialNumber: sanitize(row.SerialNumber),
          PurchaseDate: row.PurchaseDate,
          WarrantyDate: row.WarrantyDate,
          Cost: row.Cost
        });
      }
    });

    results.push(...userMap.values());//Grouped results into an array for the response

    return NextResponse.json({//Return the search results as JSON
      success: true,
      count: results.length,
      results: results
    });

  } catch (error) {//Error handling for debugging
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}