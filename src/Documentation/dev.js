import React, { useState } from "react";
import ApiSidebar from "./DevSideBar";
import { FaLock } from "react-icons/fa";

export default function ApiDocsPage() {
  const [selected, setSelected] = useState("createProduct");

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="w-[260px] border-r bg-white shadow-sm">
        <ApiSidebar onSelect={(route) => setSelected(route)} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <main className="flex-1 p-5 md:p-10 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            <span className="text-purple-600">{selected}</span>
          </h1>

          {selected === "SignIn" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    POST /auth/signIn
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  No API keys required. This endpoint is used to authenticate
                  users.
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  Authenticates a user via email and password. Returns JWT
                  token, user role, and auto-generated API credentials (if not
                  already created).
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Body Parameters:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <strong>email</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    User’s email
                  </li>
                  <li>
                    <strong>password</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    User’s password
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> Returns <code>401</code> on invalid
                  password, <code>404</code> if user not found, and{" "}
                  <code>400</code> if validation fails.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      POST
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/auth/signIn`}
                  </pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Body</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">{`{
  "email": "user@example.com",
  "password": "your-password"
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white whitespace-pre-wrap">{`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "Vendor",
  "user": {
    "_id": "64b123abc456",
    "email": "user@example.com",
    "role": "Vendor",
    "createdAt": "2023-07-01T00:00:00Z"
  },
  "apiKey": "abc-xyz-key",
  "apiSecretKey": "abc-xyz-secret",
  "userId": "64b123abc456"
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "getAllProduct" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /product/getAllProducts
                  </code>
                  <p className="mt-1 text-xs text-gray-500">
                    This endpoint retrieves all products across all users. It
                    returns product data along with user information.
                  </p>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint returns a list of all products created by all
                  users. Each product includes details like title, price, tags,
                  status, and also includes the user’s information (such as name
                  and email) who created the product.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) Your API access key.
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) Your API secret key.
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Response:
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  A successful response will return a JSON object with:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 mb-6 list-disc list-inside">
                  <li>
                    <code>success</code>: <code>true</code> or{" "}
                    <code>false</code>
                  </li>
                  <li>
                    <code>products</code>: Array of all product objects
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong>
                  <br />
                  Returns <code>400</code> if no products are found.
                  <br />
                  Returns <code>500</code> if a server or aggregation error
                  occurs.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/getAllProducts`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "products": [
    {
      "_id": "64b1f2a1234abcd",
      "title": "Cool Socks",
      "vendor": "MyBrand",
      "product_type": "Accessories",
      "status": "active",
      "tags": ["cotton", "socks"],
      "options": [
        { "name": "Color", "values": ["Black", "White"] },
        { "name": "Size", "values": ["M", "L"] }
      ],
      "variants": [
        {
          "option1": "Black",
          "option2": "M",
          "price": "12.99",
          "sku": "CSK-BL-M"
        }
      ],
      "categories": ["Footwear", "Men"],
      "userId": "abc123",
      "email": "user@example.com",
      "username": "John Doe"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalProducts": 45
}`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "getProductByUserId" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /product/getProduct/:userId
                  </code>
                  <p className="mt-1 text-xs text-gray-500">
                    This endpoint returns all products created by a specific
                    user. You must pass the{" "}
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      userId
                    </code>{" "}
                    as a path parameter.
                  </p>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  Use this endpoint to fetch all products associated with a
                  single user. The{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    userId
                  </code>{" "}
                  must be provided in the URL path. You can obtain the user's ID
                  at the time of{" "}
                  <span className="text-purple-600 font-semibold">sign in</span>{" "}
                  or from your database.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Path Parameter:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>userId</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    The unique ID of the user whose products you want to
                    retrieve.
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) Your API access key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) Your API secret key
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Response:
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  A successful response will return a JSON object containing:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code>success</code>: <code>true</code> or{" "}
                    <code>false</code>
                  </li>
                  <li>
                    <code>products</code>: an array of product objects
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> If the user has no products, this
                  endpoint will return a
                  <code className="bg-gray-100 mx-1 px-1 rounded text-xs">
                    404
                  </code>{" "}
                  response.
                </div>
              </div>

              {/* RIGHT  */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/getProduct/687b...`}
                  </pre>
                </div>
                {/* Response Example */}
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "products": [
    {
      "_id": "64b1f2a1234abcd",
      "title": "Cool Socks",
      "vendor": "MyBrand",
      "product_type": "Accessories",
      "status": "active",
      "tags": ["cotton", "socks", "user_abc123"],
      "options": [
        { "name": "Color", "values": ["Black", "White"] },
        { "name": "Size", "values": ["M", "L"] }
      ],
      "variants": [
        {
          "option1": "Black",
          "option2": "M",
          "price": "12.99",
          "sku": "CSK-BL-M"
        }
      ],
      "categories": ["Footwear", "Men"],
      "userId": "abc123",
      "email": "user@example.com",
      "username": "John Doe"
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalProducts": 25
}`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "createProduct" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                {/* Endpoint Title */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    POST /product/createProduct
                  </code>
                </div>

                {/* Access Permissions */}
                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers to access this endpoint.
                </div>

                {/* Instruction */}
                <p className="text-gray-700 text-sm mb-4">
                  To hit this endpoint, send a <strong>POST</strong> request
                  with the headers and required body fields listed below.
                </p>

                {/* Headers Required */}
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) API access token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) API secret key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>
                    : <code>application/json</code>
                  </li>
                </ul>

                {/* Body Schema */}
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Request Body Parameters:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>title</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    Product title
                  </li>
                  <li>
                    <strong>description</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    Product description
                  </li>
                  <li>
                    <strong>price</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    Default price
                  </li>
                  <li>
                    <strong>compare_at_price</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    MRP or original price
                  </li>
                  <li>
                    <strong>track_quantity</strong>{" "}
                    <span className="text-gray-500">(boolean, required)</span> –
                    Whether inventory is tracked
                  </li>
                  <li>
                    <strong>quantity</strong>{" "}
                    <span className="text-gray-500">(number, required)</span> –
                    Available quantity
                  </li>
                  <li>
                    <strong>continue_selling</strong>{" "}
                    <span className="text-gray-500">(boolean)</span> – Allow to
                    sell when out of stock
                  </li>
                  <li>
                    <strong>has_sku</strong>{" "}
                    <span className="text-gray-500">(boolean)</span> – Whether
                    product has SKUs
                  </li>
                  <li>
                    <strong>sku</strong>{" "}
                    <span className="text-gray-500">(string)</span> – Default
                    product SKU
                  </li>
                  <li>
                    <strong>barcode</strong>{" "}
                    <span className="text-gray-500">(string)</span> – Product
                    barcode
                  </li>
                  <li>
                    <strong>track_shipping</strong>{" "}
                    <span className="text-gray-500">(boolean)</span> – Requires
                    shipping
                  </li>
                  <li>
                    <strong>weight</strong>{" "}
                    <span className="text-gray-500">(number)</span> – Weight
                    value
                  </li>
                  <li>
                    <strong>weight_unit</strong>{" "}
                    <span className="text-gray-500">(string)</span> – e.g.,
                    "kg", "g", etc.
                  </li>
                  <li>
                    <strong>status</strong>{" "}
                    <span className="text-gray-500">(string)</span> – "draft" or
                    "publish"
                  </li>
                  <li>
                    <strong>userId</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    Your user ID
                  </li>
                  <li>
                    <strong>productType</strong>{" "}
                    <span className="text-gray-500">(string)</span> – Product
                    category/type
                  </li>
                  <li>
                    <strong>vendor</strong>{" "}
                    <span className="text-gray-500">(string)</span> – Vendor
                    name
                  </li>
                  <li>
                    <strong>keyWord</strong>{" "}
                    <span className="text-gray-500">(string)</span> –
                    Comma-separated keywords
                  </li>
                  <li>
                    <strong>options</strong>{" "}
                    <span className="text-gray-500">(array)</span> – e.g. [
                    {`{ name: "Color", values: ["Red"] }`}]
                  </li>
                  <li>
                    <strong>variantPrices</strong>{" "}
                    <span className="text-gray-500">(array of strings)</span> –
                    Price for each variant
                  </li>
                  <li>
                    <strong>variantQuantites</strong>{" "}
                    <span className="text-gray-500">(array of numbers)</span> –
                    Quantity per variant
                  </li>
                  <li>
                    <strong>variantSku</strong>{" "}
                    <span className="text-gray-500">(array of strings)</span> –
                    SKU per variant
                  </li>
                  <li>
                    <strong>categories</strong>{" "}
                    <span className="text-gray-500">(array of strings)</span> –
                    Tags/categories for filtering
                  </li>
                </ul>

                {/* Note */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> Missing required headers will result in{" "}
                  <code>401 Unauthorized</code> response.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      POST
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/createProduct`}
                  </pre>
                </div>
                {/* Request Body */}
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Body</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`{
  "title": "Cool Socks",
  "description": "Premium quality cotton socks",
  "price": "10.99",
  "compare_at_price": "14.99",
  "track_quantity": true,
  "quantity": 20,
  "continue_selling": true,
  "has_sku": true,
  "sku": "CSK1001",
  "barcode": "1234567890",
  "track_shipping": true,
  "weight": 0.2,
  "weight_unit": "kg",
  "status": "publish",
  "userId": "abc123",
  "productType": "Accessories",
  "vendor": "MyBrand",
  "keyWord": "cotton,socks,men",
  "options": [
    { "name": "Color", "values": ["Red", "Blue"] },
    { "name": "Size", "values": ["Small", "Large"] }
  ],
  "variantPrices": ["10.99", "12.99", "11.99", "13.99"],
  "variantQuantites": [5, 5, 5, 5],
  "variantSku": ["CSK1001-RS", "CSK1001-RL", "CSK1001-BS", "CSK1001-BL"],
  "categories": ["Footwear", "Men"]
}`}
                  </pre>
                </div>

                {/* Response */}
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">
                    {`{
  "message": "Product successfully created.",
  "product": {
    "id": 8675309,
    "title": "Cool Socks",
    "vendor": "MyBrand",
    "product_type": "Accessories",
    "status": "active",
    "tags": ["cotton", "socks", "men", "user_abc123", "vendor_MyBrand"],
    "variants": [
      { "option1": "Red", "option2": "Small", "price": "10.99", "sku": "CSK1001-RS" },
      { "option1": "Red", "option2": "Large", "price": "12.99", "sku": "CSK1001-RL" },
      { "option1": "Blue", "option2": "Small", "price": "11.99", "sku": "CSK1001-BS" },
      { "option1": "Blue", "option2": "Large", "price": "13.99", "sku": "CSK1001-BL" }
    ]
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "updateProduct" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    PATCH /product/updateProducts/:productId
                  </code>
                  {/* <p className="mt-1 text-xs text-gray-500">
                  e.g.{" "}
                  <code className="text-gray-700">
                    /product/updateProducts/687b28f5f49468ad34534cc8
                  </code>
                </p> */}
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  Send a <strong>PUT</strong> request with the following headers
                  and request body:
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string)
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string)
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>
                    : <code>application/json</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Body params:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>title</strong>{" "}
                    <span className="text-gray-500">(string, required)</span>
                  </li>
                  <li>
                    <strong>description</strong>{" "}
                    <span className="text-gray-500">(string, required)</span>
                  </li>
                  <li>
                    <strong>price</strong>{" "}
                    <span className="text-gray-500">(string, required)</span>
                  </li>
                  <li>
                    <strong>compare_at_price</strong>{" "}
                    <span className="text-gray-500">(string)</span>
                  </li>
                  <li>
                    <strong>track_quantity</strong>{" "}
                    <span className="text-gray-500">(boolean)</span>
                  </li>
                  <li>
                    <strong>quantity</strong>{" "}
                    <span className="text-gray-500">(number)</span>
                  </li>
                  <li>
                    <strong>continue_selling</strong>{" "}
                    <span className="text-gray-500">(boolean)</span>
                  </li>
                  <li>
                    <strong>has_sku</strong>{" "}
                    <span className="text-gray-500">(boolean)</span>
                  </li>
                  <li>
                    <strong>sku</strong>{" "}
                    <span className="text-gray-500">(string)</span>
                  </li>
                  <li>
                    <strong>barcode</strong>{" "}
                    <span className="text-gray-500">(string)</span>
                  </li>
                  <li>
                    <strong>track_shipping</strong>{" "}
                    <span className="text-gray-500">(boolean)</span>
                  </li>
                  <li>
                    <strong>weight</strong>{" "}
                    <span className="text-gray-500">(number)</span>
                  </li>
                  <li>
                    <strong>weight_unit</strong>{" "}
                    <span className="text-gray-500">(string)</span>
                  </li>
                  <li>
                    <strong>status</strong>{" "}
                    <span className="text-gray-500">(string)</span> – "draft" or
                    "publish"
                  </li>
                  <li>
                    <strong>userId</strong>{" "}
                    <span className="text-gray-500">(string, required)</span>
                  </li>
                  <li>
                    <strong>productType</strong>{" "}
                    <span className="text-gray-500">(string)</span>
                  </li>
                  <li>
                    <strong>vendor</strong>{" "}
                    <span className="text-gray-500">(string)</span>
                  </li>
                  <li>
                    <strong>keyWord</strong>{" "}
                    <span className="text-gray-500">(string)</span>
                  </li>
                  <li>
                    <strong>options</strong>{" "}
                    <span className="text-gray-500">(array)</span>
                  </li>
                  <li>
                    <strong>variantPrices</strong>{" "}
                    <span className="text-gray-500">(array of strings)</span>
                  </li>
                  <li>
                    <strong>variantCompareAtPrices</strong>{" "}
                    <span className="text-gray-500">(array of strings)</span>
                  </li>
                  <li>
                    <strong>variantQuantities</strong>{" "}
                    <span className="text-gray-500">(array of numbers)</span>
                  </li>
                  <li>
                    <strong>variantSku</strong>{" "}
                    <span className="text-gray-500">(array of strings)</span>
                  </li>
                  <li>
                    <strong>categories</strong>{" "}
                    <span className="text-gray-500">(array of strings)</span>
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> Returns <code>401</code> if auth
                  headers are missing.
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      PATCH
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app//product/updateProducts/687b....`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Body</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">{`{
  "title": "Cool Socks",
  "description": "Premium cotton socks",
  "price": "12.99",
  "compare_at_price": "15.99",
  "track_quantity": true,
  "quantity": 50,
  "continue_selling": false,
  "has_sku": true,
  "sku": "CSK-UPDATED",
  "barcode": "0987654321",
  "track_shipping": true,
  "weight": 0.25,
  "weight_unit": "kg",
  "status": "publish",
  "userId": "abc123",
  "productType": "Accessories",
  "vendor": "MyBrand",
  "keyWord": "cotton,socks,updated",
  "options": [
    { "name": "Color", "values": ["Black", "White"] },
    { "name": "Size", "values": ["M", "L"] }
  ],
  "variantPrices": ["12.99", "14.99", "13.99", "15.99"],
  "variantCompareAtPrices": ["15.99", "17.99", "16.99", "18.99"],
  "variantQuantities": [10, 10, 10, 10],
  "variantSku": ["CSK-BL-M", "CSK-BL-L", "CSK-WH-M", "CSK-WH-L"],
  "categories": ["Footwear", "Men"]
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Product and images updated successfully!",
  "product": {
    "_id": "64b1f2a1234abcd",
    "title": "Cool Socks",
    "body_html": "Premium cotton socks",
    "vendor": "MyBrand",
    "product_type": "Accessories",
    "status": "active",
    "tags": ["user_abc123","vendor_MyBrand","cotton","socks","updated"],
    "options": [
      { "name": "Color","values": ["Black","White"] },
      { "name": "Size","values": ["M","L"] }
    ],
    "variants": [
      { "id": 111, "option1": "Black", "option2": "M", "price": "12.99", "compare_at_price": "15.99", "inventory_quantity": 10, "sku": "CSK-BL-M", "barcode": "0987654321-1", "weight": 0.25, "weight_unit": "kg" },
      { "id": 112, "option1": "Black", "option2": "L", "price": "14.99", "compare_at_price": "17.99", "inventory_quantity": 10, "sku": "CSK-BL-L", "barcode": "0987654321-2", "weight": 0.25, "weight_unit": "kg" },
      { "id": 113, "option1": "White", "option2": "M", "price": "13.99", "compare_at_price": "16.99", "inventory_quantity": 10, "sku": "CSK-WH-M", "barcode": "0987654321-3", "weight": 0.25, "weight_unit": "kg" },
      { "id": 114, "option1": "White", "option2": "L", "price": "15.99", "compare_at_price": "18.99", "inventory_quantity": 10, "sku": "CSK-WH-L", "barcode": "0987654321-4", "weight": 0.25, "weight_unit": "kg" }
    ],
    "categories": ["Footwear","Men"],
    "userId": "abc123",
    "updated_at": "2025-07-19T10:15:30.000Z"
  }
}`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "publishedProduct" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    PUT /product/publishedProduct/:productId
                  </code>
                  <p className="mt-1 text-xs text-gray-500">
                    This endpoint is used to publish a product to the live store
                    by updating its status.
                  </p>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint performs the following actions:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  <li>
                    Sets the product status to{" "}
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      active
                    </code>{" "}
                    and its visibility scope to{" "}
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      global
                    </code>
                    .
                  </li>
                  <li>
                    Updates the product record in the local database to reflect
                    that it has been published.
                  </li>
                  <li>
                    Adds an expiration date to the product that is 30 days from
                    the current date.
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Path Parameter:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>productId</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    The internal
                    <code className="bg-gray-100 mx-1 px-1 rounded text-xs">
                      _id
                    </code>{" "}
                    of the product you want to publish.
                    <br />
                    <span className="text-yellow-700 italic">
                      You should first fetch the product from your system and
                      pass its database ID.
                    </span>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) Your API access key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) Your API secret key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>
                    : <code>application/json</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Successful Response:
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 mb-6 list-disc list-inside">
                  <li>
                    <code>success: true</code>
                  </li>
                  <li>
                    <code>publishedId</code>: ID of the newly published product
                  </li>
                  <li>
                    <code>message</code>: Status confirmation message
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong>
                  <br />- Returns <code>404</code> if the product or store
                  configuration is missing.
                  <br />- Returns <code>400</code> if the product publish
                  process fails.
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      PUT
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/publishedProduct/64acbe...`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Product successfully published.",
  "product": {
    "_id": "64b1f2a1234abcd",
    "title": "Cool Socks",
    "status": "active",
    "vendor": "MyBrand",
    "product_type": "Accessories",
    "tags": ["cotton", "socks"],
    "variants": [
      {
        "option1": "Black",
        "option2": "M",
        "price": "12.99",
        "sku": "CSK-BL-M"
      }
    ],
    "categories": ["Footwear", "Men"],
    "userId": "abc123"
  },
  "expiresAt": "2025-08-18T11:20:00.000Z"
}`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "unpublished" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    PUT /product/unpublished/:productId
                  </code>
                  <p className="mt-1 text-xs text-gray-500">
                    Example usage:{" "}
                    <code className="text-gray-700">
                      /product/unpublished/687b28f5f49468ad34534cc8
                    </code>
                  </p>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint unpublishes a product by:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  <li>
                    Setting its status to{" "}
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      draft
                    </code>{" "}
                    to make it no longer visible on the storefront.
                  </li>
                  <li>
                    Updating the corresponding product record in the local
                    database to reflect the change.
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Path Parameter:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>productId</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    The internal{" "}
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      _id
                    </code>{" "}
                    of the product you want to unpublish.
                    <br />
                    <span className="text-yellow-700 italic">
                      This ID should be fetched from your database or previous
                      product query.
                    </span>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) API access key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) API secret key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>
                    : <code>application/json</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Successful Response:
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 mb-6 list-disc list-inside">
                  <li>
                    <code>success: true</code>
                  </li>
                  <li>
                    <code>message</code>: Confirmation that the product has been
                    unpublished
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong>
                  <br />- Returns <code>404</code> if the product or its
                  configuration is not found.
                  <br />- Returns <code>400</code> if the unpublish operation
                  fails or is blocked due to invalid state or data.
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      PUT
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/unpublished/64acbe...`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Product successfully unpublished.",
  "product": {
    "_id": "64b1f2a1234abcd",
    "title": "Cool Socks",
    "status": "draft",
    "vendor": "MyBrand",
    "product_type": "Accessories",
    "tags": ["cotton", "socks"],
    "variants": [
      {
        "option1": "Black",
        "option2": "M",
        "price": "12.99",
        "sku": "CSK-BL-M"
      }
    ],
    "categories": ["Footwear", "Men"],
    "userId": "abc123"
  }
}`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "updateImages" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    PUT /product/updateImages/:id
                  </code>
                  <p className="mt-1 text-xs text-gray-500">
                    This endpoint updates product and variant images by using
                    externally hosted image URLs.
                  </p>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint performs the following:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  <li>
                    Accepts a list of publicly accessible image URLs for the
                    product.
                  </li>
                  <li>
                    Optionally, allows assigning specific images to individual
                    variants.
                  </li>
                  <li>
                    Uploads and links the images to the product record in your
                    local system.
                  </li>
                  <li>
                    All existing image references will be updated with the new
                    ones.
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Path Parameter:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 mb-4">
                  <li>
                    <strong>id</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    The internal
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      productId
                    </code>{" "}
                    of the product whose images are being updated.
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Request Body:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>images</strong>{" "}
                    <span className="text-gray-500">
                      (array of strings, required)
                    </span>{" "}
                    – A list of public image URLs to be used as main product
                    images.
                  </li>
                  <li>
                    <strong>variantImages</strong>{" "}
                    <span className="text-gray-500">
                      (array of objects, optional)
                    </span>{" "}
                    – Use this to assign images to specific variants. Each
                    object should contain:
                    <ul className="ml-4 list-disc list-inside mt-1">
                      <li>
                        <code>variantId</code> – The internal ID of the variant
                      </li>
                      <li>
                        <code>url</code> – The image URL to assign to this
                        variant
                      </li>
                    </ul>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) API access key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) API secret key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>
                    : <code>application/json</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Successful Response:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code>success: true</code>
                  </li>
                  <li>
                    <code>message</code>: "Images updated successfully"
                  </li>
                  <li>
                    <code>updatedProduct</code>: Updated product object with new
                    image URLs
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> Image URLs can be hosted on any public
                  platform (e.g., CDN, S3, your server) — as long as they are
                  accessible via direct link. Duplicate images or broken URLs
                  will be skipped.
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      PUT
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/updateImages/98755`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Body</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "images": [
    "https://i.imgur.com/2nCt3Sbl.jpg",
    "https://i.imgur.com/UePbdphl.jpg",
    "https://i.imgur.com/3g7nmJC.jpg"
  ],
  "variantImages": [
    { "url": "https://i.imgur.com/A6XfKzK.jpg" },
    { "url": "https://i.imgur.com/KzP4L9W.jpg" }
  ]
}`}</pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Product and variant images successfully updated.",
  "product": {
    "_id": "64b1f2a1234abcd",
    "title": "Cool Socks",
    "images": [
      {
        "src": "https://cdn.shopify.com/s/files/1/image-abc.jpg",
        "alt": "Image 1",
        "position": 1
      }
    ],
    "variantImages": [
      {
        "id": 1111111,
        "src": "https://cdn.shopify.com/s/files/1/variant-xyz.jpg"
      }
    ],
    "variants": [
      {
        "id": 1111111,
        "title": "Black / M",
        "price": "12.99",
        "image_id": 1111111
      }
    ]
  },
  "shopifyImages": [
    {
      "src": "https://cdn.shopify.com/s/files/1/image-abc.jpg",
      "alt": "Image 1",
      "position": 1
    }
  ],
  "variantImages": [
    {
      "id": 1111111,
      "src": "https://cdn.shopify.com/s/files/1/variant-xyz.jpg"
    }
  ]
}`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "deleteProduct" ? (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    DELETE /product/deleteProduct/:id
                  </code>
                  <p className="mt-1 text-xs text-gray-500">
                    This endpoint permanently removes a product from the system
                    using its internal ID.
                  </p>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint is used to permanently delete a product from
                  your local database:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  <li>The product is completely removed from your system.</li>
                  <li>There is no recovery once the deletion is complete.</li>
                  <li>
                    You must pass the valid internal database <code>_id</code>{" "}
                    of the product in the URL.
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Path Parameter:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>id</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    The internal
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      _id
                    </code>{" "}
                    of the product you want to delete.
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) API access key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) API secret key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>
                    : <code>application/json</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Successful Response:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code>success: true</code>
                  </li>
                  <li>
                    <code>message</code>: "Product deleted successfully"
                  </li>
                  <li>
                    <code>deletedProduct</code>: The deleted product data
                    (optional, for confirmation)
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong>
                  <br />- Returns <code>404</code> if the product with the
                  specified ID is not found.
                  <br />- Returns <code>400</code> if the ID is missing or
                  invalid.
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      DELETE
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/deleteProduct/687b...`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Product deleted successfully"
}`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "addImageGallery" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-md shadow-md p-6">
                {/* Endpoint Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    POST /product/addImageGallery
                  </code>
                  <p className="mt-1 text-xs text-gray-500">
                    This endpoint is used to add image URLs to a user's image
                    gallery. If the gallery already exists, the new images will
                    be appended.
                  </p>
                </div>

                {/* Authentication */}
                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4">
                  This endpoint allows adding one or more image URLs to a user’s
                  image gallery:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  <li>
                    If the user already has a gallery, the new images are added
                    to it.
                  </li>
                  <li>
                    If any of the submitted image URLs already exist in the
                    gallery, they will be skipped (no duplication).
                  </li>
                  <li>
                    If the user does not have a gallery yet, a new one is
                    created.
                  </li>
                </ul>

                {/* Request Body */}
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Request Body:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>userId</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    The unique ID of the user whose gallery you want to update
                    or create.
                  </li>
                  <li>
                    <strong>images</strong>{" "}
                    <span className="text-gray-500">
                      (array of strings, required)
                    </span>{" "}
                    – An array of image URLs to be added to the gallery.
                    <br />
                    <span className="text-yellow-700 italic">
                      Each URL must be a valid string and point to an accessible
                      image file.
                    </span>
                  </li>
                </ul>

                {/* Required Headers */}
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) API access key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) API secret key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>
                    : <code>application/json</code>
                  </li>
                </ul>

                {/* Success Response */}
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Success Response:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code>success: true</code>
                  </li>
                  <li>
                    <code>message</code>: A confirmation message indicating that
                    images were added
                  </li>
                  <li>
                    <code>updatedGallery</code>: The updated array of all images
                    in the gallery
                  </li>
                </ul>

                {/* Note */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> Duplicate image URLs in the request
                  will be ignored automatically. The gallery will not contain
                  repeated entries.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      POST
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/addImageGallery`}
                  </pre>
                </div>
                {/* Request Example */}
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Body</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "userId": "65a3f0e7c2f11b001e123abc",
  "images": [
    "https://cdn.shopify.com/s/files/1/abc/image1.jpg",
    "https://cdn.shopify.com/s/files/1/abc/image2.jpg"
  ]
}`}</pre>
                </div>

                {/* Response Example */}
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Images updated for user.",
  "product": {
    "_id": "65b0ffabf0c123001e456def",
    "userId": "65a3f0e7c2f11b001e123abc",
    "images": [
      {
        "src": "https://cdn.shopify.com/s/files/1/abc/image1.jpg",
        "position": 1,
        "alt": "Image 1"
      },
      ...
    ]
  }
}`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "getImageGallery" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                {/* Endpoint Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /product/getImageGallery/:userId/:productId
                  </code>
                  <p className="mt-1 text-xs text-gray-500">
                    Optional param <code>productId</code> filters images by
                    product. If not available, you must explicitly pass{" "}
                    <code>null</code> as the productId in the path.
                  </p>
                </div>

                {/* Auth */}
                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4">
                  Fetches the user's image gallery. If a <code>productId</code>{" "}
                  is provided, it filters to images assigned to that product. If
                  no product ID is relevant, you must pass the string{" "}
                  <code>null</code> in the path to fetch unassigned
                  (Cloudinary/Shopify) images.
                </p>

                {/* Path Params */}
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Path Parameters:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>userId</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    User ID whose gallery to fetch.
                  </li>
                  <li>
                    <strong>productId</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    Product ID to filter images.
                    <br />
                    <span className="text-yellow-700 italic">
                      If not applicable, manually pass <code>null</code> in the
                      URL, like:
                      <br />
                      <code className="text-xs bg-gray-100 px-1 rounded">
                        /product/getImageGallery/:userId/null
                      </code>
                    </span>
                  </li>
                </ul>

                {/* Note */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> This endpoint does not auto-handle
                  missing productId. You must pass <code>null</code> if no
                  product is assigned.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/getImageGallery/65b1.../65b431....`}
                  </pre>
                </div>
                {/* Example Response */}
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`[
  {
    "id": "65b1234f0e7f456001e456abc",
    "images": [
      {
        "src": "https://cdn.shopify.com/s/files/1/example/image1.jpg",
        "alt": "Image 1",
        "position": 1
      },
      {
        "src": "https://res.cloudinary.com/demo/image2.png",
        "alt": "Image 2",
        "position": 2
      }
    ]
  }
]`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "productBulkUpload" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                {/* Endpoint Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    POST /product/upload-product-csv/:userId
                  </code>
                  <p className="mt-1 text-xs text-gray-500">
                    Upload a CSV file to bulk create or update products along
                    with their variants, images, options, tags, and metafields.
                  </p>
                </div>

                {/* Authentication */}
                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4">
                  This endpoint allows uploading a CSV file that contains
                  product data. Products are grouped by their{" "}
                  <code>Handle</code> value:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  <li>
                    If a product with the same handle already exists, it will be
                    updated.
                  </li>
                  <li>If not, a new product will be created and stored.</li>
                  <li>
                    Variants, images, options, tags, categories, and metafields
                    are all supported and applied per row.
                  </li>
                </ul>

                {/* Path Params */}
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Path Parameter:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 mb-4">
                  <li>
                    <strong>userId</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    The internal user ID for whom the products are being
                    uploaded.
                  </li>
                </ul>

                {/* Form Data */}
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Form Data:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 mb-6">
                  <li>
                    <strong>file</strong>{" "}
                    <span className="text-gray-500">(CSV, required)</span> – A
                    properly formatted CSV file containing product data. Headers
                    should include fields like:
                    <br />
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Handle, Title, Body, Option1 Name, Option1 Value, Variant
                      SKU, Variant Price, Variant Image, Image Src, Category,
                      global.title_tag, global.description_tag
                    </code>
                  </li>
                </ul>

                {/* Response */}
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Success Response:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code>success: true</code>
                  </li>
                  <li>
                    <code>created</code>: Number of products created
                  </li>
                  <li>
                    <code>updated</code>: Number of products updated
                  </li>
                  <li>
                    <code>errors</code>: List of any rows that failed (with
                    reasons)
                  </li>
                </ul>

                {/* Notes */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong>
                  <br />- The <code>Category</code> column is used to assign
                  category tags and create nested category paths via{" "}
                  <code>catNo</code> mapping.
                  <br />
                  - SEO fields are supported using metafields:
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<code>global.title_tag</code> → SEO
                  Title
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<code>global.description_tag</code> →
                  SEO Description
                  <br />- Images must be accessible via public URLs for
                  successful upload.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      POST
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/upload-product-csv/64acbe...`}
                  </pre>
                </div>
                {/* Example Response */}
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Products processed.",
  "results": [
    {
      "success": true,
      "productId": "123456789",
      "title": "My Product"
    }
  ]
}`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "getVariant" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                {/* Endpoint Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /product/getVariant/:productId/variants/:variantId
                  </code>
                  <p className="mt-1 text-xs text-gray-500">
                    Fetches complete details of a single variant from your
                    database, including pricing, SKU, options, inventory, and
                    linked images.
                  </p>
                </div>

                {/* Authentication */}
                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4">
                  This endpoint performs a MongoDB aggregation on your{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    listingModel
                  </code>{" "}
                  to:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  <li>
                    Find the product by <code>productId</code>
                  </li>
                  <li>
                    Locate the exact variant using <code>variantId</code>
                  </li>
                  <li>
                    Return the complete variant object including:
                    <ul className="ml-4 mt-1 list-disc">
                      <li>Variant price, SKU, and barcode</li>
                      <li>Selected option values (e.g., Size, Color)</li>
                      <li>Inventory quantity & inventory policy</li>
                      <li>Associated product images (if mapped)</li>
                    </ul>
                  </li>
                </ul>

                {/* Path Parameters */}
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Path Parameters:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 mb-4">
                  <li>
                    <strong>productId</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    The internal product ID that owns the variant.
                  </li>
                  <li>
                    <strong>variantId</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    The internal ID of the variant to retrieve.
                  </li>
                </ul>

                {/* Success Response */}
                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Success Response:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code>success: true</code>
                  </li>
                  <li>
                    <code>variant</code>: Full variant object
                  </li>
                  <li>
                    <code>productOptions</code>: Array of available option names
                    (e.g., [ "Color", "Size" ])
                  </li>
                  <li>
                    <code>images</code>: Any images associated with the variant
                    or product
                  </li>
                </ul>

                {/* Note */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong>
                  <br />
                  This endpoint only reads from your MongoDB database and does
                  not connect to any external services. It's best used for
                  internal tools like admin dashboards, variant managers, and
                  editors.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/getVariant/987645/variants/34643809`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "id": "456789123456",
  "title": "Red / Large",
  "option1": "Red",
  "option2": "Large",
  "price": "49.99",
  "compare_at_price": "69.99",
  "inventory_quantity": 20,
  "sku": "RED-L-001",
  "barcode": "1234567890123",
  "weight": 300,
  "weight_unit": "g",
  "options": ["Color", "Size"],
  "images": [
    {
      "src": "https://cdn.shopify.com/s/files/1/.../image1.jpg",
      "alt": "Red variant",
      "position": 1
    }
  ]
}`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "updateVariant" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-md shadow-md p-6">
                {/* Endpoint Title */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    PUT /product/updateVariant/:productId/:variantId
                  </code>
                  <p className="mt-1 text-xs text-gray-500">
                    This endpoint updates a specific variant belonging to a
                    product.
                    <br />
                    <span className="text-yellow-700 italic">
                      First, fetch the product using your internal product
                      listing API. You will receive the <code>productId</code>{" "}
                      and each <code>variantId</code> — use those in this
                      request path to apply updates to the target variant.
                    </span>
                  </p>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint performs an update to the selected variant. You
                  must include all editable fields within the request body. It
                  can update fields such as pricing, inventory, options,
                  identifiers, and weight.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) API access key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) API secret key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>
                    : <code>application/json</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Request Body Parameters:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>price</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    Selling price for the variant
                  </li>
                  <li>
                    <strong>compare_at_price</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    Original or MRP value (used for showing discounts)
                  </li>
                  <li>
                    <strong>inventory_quantity</strong>{" "}
                    <span className="text-gray-500">(number, optional)</span> –
                    Quantity available in stock
                  </li>
                  <li>
                    <strong>sku</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    Stock Keeping Unit identifier
                  </li>
                  <li>
                    <strong>barcode</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    Barcode or UPC
                  </li>
                  <li>
                    <strong>option1</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    First variant option (e.g., "Red")
                  </li>
                  <li>
                    <strong>option2</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    Second variant option (e.g., "Medium")
                  </li>
                  <li>
                    <strong>option3</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    Third option (used in rare cases)
                  </li>
                  <li>
                    <strong>weight</strong>{" "}
                    <span className="text-gray-500">(number, optional)</span> –
                    Variant weight for shipping calculations
                  </li>
                  <li>
                    <strong>inventory_policy</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    Inventory policy when stock is 0. Accepts:{" "}
                    <code>"deny"</code> or <code>"continue"</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mt-6 mb-2">
                  Success Response:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code>success: true</code>
                  </li>
                  <li>
                    <code>message</code>: Variant updated successfully
                  </li>
                  <li>
                    <code>updatedVariant</code>: The updated variant object
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> Inventory adjustments should be handled
                  separately if your system uses a dedicated inventory API or
                  logic. This endpoint focuses only on variant data fields.
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      PUT
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/updateVariant/987654321/98765423`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Body</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">{`{
  "variant": {
    "price": "49.99",
    "compare_at_price": "59.99",
    "inventory_quantity": 10,
    "sku": "SKU-RED-L",
    "barcode": "1234567890123",
    "option1": "Red",
    "option2": "Large",
    "option3": null,
    "weight": 0.5,
    "inventory_policy": "deny"
  }
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "success": true,
  "message": "Variant and inventory updated successfully in Shopify and database.",
  "shopifyResponse": {
    "variant": {
      "id": "987654321",
      "price": "49.99",
      "sku": "SKU-RED-L",
      "option1": "Red",
      "option2": "Large",
      "weight": 0.5
    }
  },
  "dbResponse": {
    "acknowledged": true,
    "modifiedCount": 1
  }
}`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "updateInventoryPrice" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    PUT /product/updateInventoryPrice/:id
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint updates the <strong>price</strong> and{" "}
                  <strong>compare_at_price</strong> of a product variant both in
                  your local database and on your connected Shopify store.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API Access Token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API Secret Key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>{" "}
                    – <code>application/json</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  URL Parameter:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <strong>:id</strong> – Shopify Variant ID to be updated
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Request Body Parameters:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>price</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    New price of the variant
                  </li>
                  <li>
                    <strong>compareAtPrice</strong>{" "}
                    <span className="text-gray-500">(string)</span> – Old price
                    (optional)
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> This endpoint only updates{" "}
                  <code>price</code> and <code>compare_at_price</code>. To
                  update inventory quantity, use the{" "}
                  <code>/updateInventoryQuantity</code> endpoint.
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      PUT
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/updateInventoryPrice/87856567`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Body</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">{`{
  "price": "29.99",
  "compareAtPrice": "49.99"
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Variant price and compare_at_price updated successfully."
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Product with this variant not found."
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "updateInventoryQuantity" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    PUT /product/updateInventoryQuantity/:id
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint updates the <strong>inventory quantity</strong>{" "}
                  of a Shopify product variant both in your local database and
                  Shopify via the Inventory Levels API.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API Access Token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API Secret Key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>{" "}
                    – <code>application/json</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  URL Parameter:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <strong>:id</strong> – Shopify Variant ID whose quantity is
                    to be updated
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Request Body Parameters:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>quantity</strong>{" "}
                    <span className="text-gray-500">(number, required)</span> –
                    New available quantity
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> The Shopify Inventory API requires an{" "}
                  <code>inventory_item_id</code> and <code>location_id</code>,
                  which are fetched automatically by this endpoint before
                  updating.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      PUT
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/updateInventoryQuantity/5678653889`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Body</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">{`{
  "quantity": 12
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Inventory quantity updated successfully.",
  "shopifyResponse": {
    "inventory_level": {
      "inventory_item_id": 123456789,
      "location_id": 87654321,
      "available": 12
    }
  }
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "No inventory level found for this item."
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "bulkUploadForInventory" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    POST /product/upload-csv-for-inventory
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint processes a CSV file and updates{" "}
                  <strong>inventory quantity</strong>,<strong>price</strong>,{" "}
                  <strong>compare_at_price</strong>, and
                  <strong>product status</strong> on Shopify. It also updates
                  your local MongoDB database based on the given Variant SKUs.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API Access Token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API Secret Key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>{" "}
                    – multipart/form-data
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Form Data Fields:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>file</strong>{" "}
                    <span className="text-gray-500">(CSV file, required)</span>{" "}
                    – Inventory and price data
                  </li>
                  <li>
                    <strong>userId</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    ID of the user performing the update
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mt-6 mb-2">
                  Required CSV Columns:
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    <code>Variant SKU</code> – SKU of the product variant
                  </li>
                  <li>
                    <code>Variant Inventory Qty</code> – Inventory quantity
                  </li>
                  <li>
                    <code>Variant Price</code> – Selling price (optional)
                  </li>
                  <li>
                    <code>Variant Compare At Price</code> – MRP or old price
                    (optional)
                  </li>
                  <li>
                    <code>Status</code> – Product status: <code>active</code>,{" "}
                    <code>draft</code>, or <code>archived</code> (optional)
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> Only variants with matching SKUs in
                  your product database will be updated. Products with unmatched
                  SKUs are skipped and logged in the response.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      POST
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/product/upload-csv-for-inventory`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Sample CSV Content</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      CSV
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">{`Variant SKU,Variant Inventory Qty,Variant Price,Variant Compare At Price,Status
SKU-RED-M,15,19.99,29.99,active
SKU-BLUE-L,0,21.50,28.50,draft
SKU-GREEN-S,5,,,archived`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "CSV processing completed.",
  "results": [
    {
      "sku": "SKU-RED-M",
      "variantId": 123456789,
      "status": "quantity_updated",
      "updatedAt": "2025-07-21T08:40:15.123Z"
    },
    {
      "sku": "SKU-RED-M",
      "variantId": 123456789,
      "status": "price_updated",
      "newPrice": "19.99",
      "newCompareAtPrice": "29.99",
      "updatedAt": "2025-07-21T08:40:15.456Z"
    },
    {
      "sku": "SKU-RED-M",
      "productId": 987654321,
      "status": "status_updated",
      "newStatus": "active",
      "updatedAt": "2025-07-21T08:40:15.987Z"
    }
  ]
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "success": false,
  "message": "Unexpected error during CSV update.",
  "error": "No file uploaded"
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "createCategory" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    POST /category/createCategory
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint allows you to create hierarchical categories
                  (level1, level2, level3) in your system and automatically
                  create a Shopify collection based on the generated{" "}
                  <code>catNo</code> tags. These tags are used as rules in the
                  collection's auto-tagging logic.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API secret
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>{" "}
                    – <code>application/json</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Request Body Parameters:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>title</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    Collection title
                  </li>
                  <li>
                    <strong>description</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    Collection description
                  </li>
                  <li>
                    <strong>handle</strong>{" "}
                    <span className="text-gray-500">(string, optional)</span> –
                    Shopify collection handle override
                  </li>
                  <li>
                    <strong>categories</strong>{" "}
                    <span className="text-gray-500">(array, required)</span> –
                    List of category objects
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> Each category will automatically be
                  assigned a unique <code>catNo</code> (e.g.,{" "}
                  <code>cat_101</code>), which is used to tag products and apply
                  Shopify collection rules.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      POST
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/category/createCategory`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Body</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">{`{
  "title": "Women's Accessories",
  "description": "All women's category-based auto collection",
  "handle": "womens-accessories",
  "userId": "67d2b1be821a3d8288sac",
  "categories": [
    {
      "title": "Women's Accessories",
       "description": "All women's category-based auto collection",
      "level": "level1",
      "parentCatNo": ""
    }
  ]
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Categories saved successfully and Shopify collection created",
  "collections": "gid://shopify/Collection/512939127264"
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "error": "Categories are required"
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "getCategory" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /category/getCategory
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint fetches all existing categories stored in the
                  system, including level1, level2, and level3 entries. These
                  are useful for mapping product categories or creating filters.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API secret
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/category/getCategory`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`[
  {
    "_id": "665a7775df...",
    "title": "Scarves",
    "description": "Silk and wool scarves",
    "level": "level1",
    "catNo": "cat_101",
    ...
  },
  {
    "_id": "665a77fa52...",
    "title": "Printed Scarves",
    "description": "Colorful prints",
    "level": "level2",
    "catNo": "cat_102",
    ...
  }
]`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "No categories found"
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "getCategoryById" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /category/category/:categoryId
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint fetches a single category by its{" "}
                  <code>catNo</code>. If the category is of level 2 or 3, its
                  parent categories (level 1 or 2) will also be fetched
                  internally to ensure the full hierarchy is known. The final
                  response will only return the category matching the requested
                  <code>catNo</code>.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Path Parameter:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <strong>categoryId</strong> – The category{" "}
                    <code>catNo</code> to retrieve
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API secret
                  </li>
                </ul>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/category/category/64acb...`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "_id": "66a9f75e423d53f7e7f39d11",
  "title": "Floral Scarves",
  "description": "Floral patterns",
  "level": "level3",
  "catNo": "cat_303",
  "parentCatNo": "cat_202"
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Category not found"
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "deleteCategories" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    DELETE /category/deleteCategory
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint deletes one or more categories by their internal
                  MongoDB <code>_id</code>s and also removes the linked Shopify
                  collections (if they exist), using the GraphQL{" "}
                  <code>collectionDelete</code> mutation. You must pass an array
                  of category IDs in the request body.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Body Parameters:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <strong>categoryIds</strong> –{" "}
                    <code>Array of category _id</code> to be deleted
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API secret
                  </li>
                </ul>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      DELETE
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/category/deleteCategory`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "success": true,
  "message": "Selected categories are deleted successfully."
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "error": "No category IDs provided."
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "getOrderByUserId" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /order/order/:userId
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint returns all orders that contain products
                  uploaded by the specified <code>userId</code>. It filters line
                  items by comparing their variant IDs with the authenticated
                  user's products. Only matched items are returned in the
                  response.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Path Parameter:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <strong>userId</strong> – MongoDB ID of the user whose
                    products you want to filter orders by
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API secret
                  </li>
                </ul>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/order/order/64acbe...`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Orders found for user",
  "data": [
    {
      "_id": "66a123...",
      "orderId": "1234567890",
      "lineItems": [
        {
          "variant_id": "4216...",
          "title": "Wireless Headphones",
          "image": {
            "src": "https://cdn.shopify.com/image.jpg",
            "alt": "Side view",
            "width": 800,
            "height": 800
          }
        }
      ],
      ...
    }
  ]
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "No orders found for this user's products"
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "getOrderByOrderId" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /order/getOrderByOrderId/:id
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint returns a single order by its{" "}
                  <code>orderId</code>. It is useful for retrieving full details
                  of one specific order, including its line items.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Path Parameter:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <strong>id</strong> – Order ID (e.g. Shopify order ID or
                    internal orderId)
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API secret
                  </li>
                </ul>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/getOrderByOrderId/1234567890`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "data": {
    "_id": "66a123...",
    "orderId": "1234567890",
    "lineItems": [
      {
        "variant_id": "4216...",
        "title": "Wireless Headphones",
        "quantity": 1
      }
    ],
    ...
  }
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "error": "Order not found"
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "getAllOrders" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /order/getAllOrder
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint fetches all orders from the system and groups
                  them by order. Each order object contains line items grouped
                  by merchant. Each merchant includes basic details, total order
                  value, and count.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API secret
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/order/getAllOrder`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Orders grouped per order (not merged by merchant)",
  "data": [
    {
      "serialNo": 20250721001,
      "merchants": [
        {
          "id": "merchant_id_1",
          "info": {
            "_id": "merchant_id_1",
            "name": "John Doe",
            "email": "john@example.com",
            "role": "Merchant",
            "dispatchAddress": "123 Street",
            "dispatchCountry": "USA"
          },
          "totalOrdersCount": 5,
          "totalOrderValue": 189.99
        }
      ],
      "lineItemsByMerchant": {
        "merchant_id_1": [
          {
            "variant_id": "123",
            "title": "Product Name",
            "quantity": 2,
            "price": 45,
            "image": {
              "id": "img123",
              "src": "https://cdn.example.com/image.jpg",
              "alt": "Product Image"
            },
            "customer": [
              {
                "first_name": "Jane",
                "last_name": "Smith",
                "email": "jane@example.com",
                "phone": "+123456789",
                "created_at": "2024-12-01T12:34:56Z",
                "default_address": {}
              }
            ],
            "orderId": "20250721001"
          }
        ]
      }
    }
  ]
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "No orders found across merchants"
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "getCancellationRequests" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /order/getCancellationRequests
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint retrieves all order cancellation requests and
                  groups them by user. Each user entry includes their basic
                  details, number of requests made, and an array of their
                  submitted requests with product names, order IDs, and
                  timestamps.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API secret
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/order/getCancellationRequests`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "success": true,
  "totalUsers": 2,
  "data": [
    {
      "_id": "userId1",
      "firstName": "Ali",
      "lastName": "Khan",
      "email": "ali@example.com",
      "requestCount": 3,
      "requests": [
        {
          "_id": "reqId1",
          "orderId": "123456789",
          "orderNo": "ORD1001",
          "request": "Cancel due to wrong item",
          "productNames": ["Product A", "Product B"],
          "createdAt": "2025-07-20T14:35:00.000Z"
        },
        {
          "_id": "reqId2",
          "orderId": "123456790",
          "orderNo": "ORD1002",
          "request": "Duplicate order placed",
          "productNames": ["Product C"],
          "createdAt": "2025-07-19T11:00:00.000Z"
        }
      ]
    }
  ]
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Internal server error."
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "cancelOrder" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    POST /order/cancelOrder
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint cancels an order in Shopify using its order ID.
                  You can also provide specific line item IDs to mark only
                  certain items as "cancelled" in your database. Shopify will
                  cancel the full order, and your system will update internal
                  status for the specified line items.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Request Body:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      orderId
                    </code>{" "}
                    (string) – Shopify Order ID (required)
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      reason
                    </code>{" "}
                    (string) – Cancellation reason (optional, defaults to{" "}
                    <code>customer</code>)
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      lineItemIds
                    </code>{" "}
                    (array) – Line item IDs to mark as cancelled in DB
                    (required)
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      POST
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/order/cancelOrder`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Order cancelled successfully. Selected line items marked as cancelled.",
  "Status": "refunded",
  "updatedLineItems": ["447210849", "447210850"],
  "orderId": "5467890123",
  "cancelledAt": "2025-07-21T10:12:45.200Z"
}`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "error": "Failed to cancel order in Shopify",
  "details": {
    "errors": "Order cannot be canceled because it has already been fulfilled."
  }
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "exportOrders" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /order/exportOrders
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint exports Shopify order data in CSV format. It
                  groups order line items per order and includes customer info,
                  item details, fulfillment status, and payout info. You can
                  filter the line items by status (e.g. <code>fulfilled</code>,{" "}
                  <code>unfulfilled</code>, <code>cancelled</code>) using a
                  query parameter.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Query Parameters:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      status
                    </code>{" "}
                    (optional) – Filters items by fulfillment status. Valid
                    values: <code>fulfilled</code>, <code>unfulfilled</code>,{" "}
                    <code>cancelled</code>.
                  </li>
                </ul>

                <p className="text-xs text-gray-500 italic">
                  ⚠️ For large exports (e.g. 50k+ orders), the system
                  auto-generates the CSV and returns it as a downloadable file.
                </p>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel./order/exportOrders`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      CSV File
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`File will download directly:
Filename format: orders-export-<timestamp>.csv

Each CSV row includes:
- OrderID
- ShopifyOrderNo
- SerialNumber
- PayoutStatus
- ScheduledPayoutDate
- CustomerEmail
- LineItemID
- ProductName
- FulfillmentStatus
...and more
`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "No matching orders found for the selected filter"
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}

          {selected === "addPayouts" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    POST /order/addPayOutDates
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers to access this endpoint.
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  To hit this endpoint, send a <strong>POST</strong> request
                  with the headers and required body fields listed below.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) API access token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) API secret key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>
                    : <code>application/json</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Request Body Parameters:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>payoutFrequency</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    One of: <code>daily</code>, <code>weekly</code>,{" "}
                    <code>once</code>, <code>twice</code>
                  </li>
                  <li>
                    <strong>graceTime</strong>{" "}
                    <span className="text-gray-500">(number, optional)</span> –
                    Number of days delay before first payout
                  </li>
                  <li>
                    <strong>firstDate</strong>{" "}
                    <span className="text-gray-500">(number)</span> – Day of
                    month for 1st payout (1-28) [used in <code>once</code> or{" "}
                    <code>twice</code>]
                  </li>
                  <li>
                    <strong>secondDate</strong>{" "}
                    <span className="text-gray-500">(number)</span> – Day of
                    month for 2nd payout (1-28) [only for <code>twice</code>]
                  </li>
                  <li>
                    <strong>weeklyDay</strong>{" "}
                    <span className="text-gray-500">(string)</span> – Day of
                    week (e.g. "Monday") [only for <code>weekly</code>]
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> If you miss required values like{" "}
                  <code>weeklyDay</code> or <code>firstDate</code>, you'll get a{" "}
                  <code>400 Bad Request</code>.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      POST
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/order/addPayOutDates`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Body</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`{
  "payoutFrequency": "twice",
  "graceTime": 7,
  "firstDate": 5,
  "secondDate": 20
}`}
                  </pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">
                    {`{
  "message": "Payout config saved successfully."
}`}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "addReferenceNumber" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    POST /orders/addReferenceNumber
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers to access this endpoint.
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  To hit this endpoint, send a <strong>POST</strong> request
                  with the headers and required body fields listed below.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) API access token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) API secret key
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      Content-Type
                    </code>
                    : <code>application/json</code>
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Request Body Parameters:
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>UserIds</strong>{" "}
                    <span className="text-gray-500">(array, required)</span> –
                    An array of MongoDB user IDs to update
                  </li>
                  <li>
                    <strong>referenceNo</strong>{" "}
                    <span className="text-gray-500">(string, required)</span> –
                    Reference number to assign to each user
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> This will only update users found in
                  the database. If none match, it will return a 404.
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      POST
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/orders/addReferenceNumber`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Body</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`{
  "UserIds": [
    "64cafd1a2f9cbe00123abcd1",
    "64cafd1a2f9cbe00123abcd2"
  ],
  "referenceNo": "REF-2025-JULY"
}`}
                  </pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">
                    {`{
  "message": "Reference number added to all specified users.",
  "modifiedCount": 2
}`}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "getPayout" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /orders/getPayout
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers to access this endpoint.
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This <strong>GET</strong> endpoint fetches calculated payout
                  summaries grouped by payout date and merchant. Includes
                  pagination via query parameters.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : (string) API access token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : (string) API secret key
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Optional Query Parameters:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <strong>page</strong>{" "}
                    <span className="text-gray-500">(number)</span> – Page
                    number (default: 1)
                  </li>
                  <li>
                    <strong>limit</strong>{" "}
                    <span className="text-gray-500">(number)</span> – Results
                    per page (default: 10)
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> Each payout group includes aggregated
                  merchant-specific totals, status, and timeline range.
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request URL</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/order/getPayout?page=1&limit=5`}
                  </pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">
                    {`{
  "message": "Payouts calculated",
  "totalAmount": 442.55,
  "totalPayouts": 3,
  "page": 1,
  "limit": 5,
  "payouts": [
    {
      "payoutDate": "Jul 20, 2025",
      "transactionDates": "Jul 17 – Jul 20, 2025",
      "status": "Pending",
      "amount": "$230.00 AUD",
      "orders": [
        {
          "merchantId": "64b...",
          "merchantName": "John Doe",
          "merchantEmail": "john@example.com",
          "fulfilledCount": 3,
          "unfulfilledCount": 1,
          "totalAmount": 120.00,
          "lineItems": [...]
        }
      ]
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "getPayoutByQuery" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /orders/getPayoutByQuery
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers to access this endpoint.
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This <strong>GET</strong> endpoint retrieves **payout orders
                  grouped by payout date** and **filtered by merchant**.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : API secret
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Query Parameters:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <strong>userId</strong> (required) – Merchant/User ID to
                    filter products
                  </li>
                  <li>
                    <strong>status</strong> (optional) – Filter payouts by{" "}
                    <code>pending</code> or <code>deposited</code>
                  </li>
                  <li>
                    <strong>payoutDate</strong> (optional) – Format:{" "}
                    <code>Jul 21, 2025</code>
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> Only products owned by the given{" "}
                  <code>userId</code> are included.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/orders/getPayoutByQuery?userId=64abf1a12b9...&status=pending`}
                  </pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">
                    {`{
  "message": "Payouts calculated",
  "totalAmount": 265.99,
  "payouts": [
    {
      "payoutDate": "Jul 21, 2025",
      "transactionDates": "Jul 19 – Jul 21, 2025",
      "status": "Pending",
      "amount": "$200.00 AUD",
      "totalRefundAmount": "$65.99 AUD",
      "orders": [
        {
          "orderId": "123456",
          "shopifyOrderNo": "GE1001",
          "amount": 100.00,
          "refund": 35.99,
          "status": "pending",
          "createdAt": "2025-07-19T10:23:00.000Z",
          "referenceNo": "REF-2025-JULY",
          "paypalAccount": "merchant@example.com",
          "products": [
            {
              "title": "Cool Socks",
              "variantTitle": "Red / L",
              "price": 10.99,
              "quantity": 2,
              "total": 21.98,
              "fulfillment_status": "fulfilled",
              "cancelled": false
            }
          ]
        }
      ]
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "getAllPayoutByQuery" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /order/getAllPayouts
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers to access this endpoint.
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This <strong>GET</strong> endpoint retrieves all orders across
                  merchants, grouped by payout date and status. It calculates
                  payout totals, refund amounts, and includes merchant PayPal
                  and reference data.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : API secret
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Query Parameters (optional):
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <strong>payoutDate</strong> – Format:{" "}
                    <code>Jul 21, 2025</code> – Filters payouts for a specific
                    date
                  </li>
                  <li>
                    <strong>status</strong> – <code>pending</code> or{" "}
                    <code>deposited</code>
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> This endpoint automatically calculates
                  payout and refund per merchant per order.
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/order/getAllPayouts?payoutDate=Jul 21, 2025&status=pending`}
                  </pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">
                    {`{
  "message": "Payouts calculated",
  "totalAmount": 1285.00,
  "payouts": [
    {
      "payoutDate": "Jul 21, 2025",
      "transactionDates": "Jul 18 – Jul 21, 2025",
      "status": "Pending",
      "amount": "$1200.00 AUD",
      "totalRefundAmount": "$85.00 AUD",
      "orders": [
        {
          "orderId": "789ABC",
          "shopifyOrderNo": "GE1234",
          "amount": 100.00,
          "refund": 15.00,
          "status": "pending",
          "createdAt": "2025-07-19T10:00:00.000Z",
          "referenceNo": "REF-2025-XYZ",
          "paypalAccount": "vendor@example.com",
          "products": [
            {
              "title": "Wireless Headphones",
              "variantTitle": "Black",
              "price": 50.00,
              "quantity": 2,
              "total": 100.00,
              "fulfillment_status": "fulfilled",
              "cancelled": false,
              "userId": "64abc...",
              "referenceNo": "REF-2025-XYZ",
              "paypalAccount": "vendor@example.com"
            }
          ]
        }
      ]
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "getPayoutByUserId" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /order/getPayoutByUserId
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers to access this endpoint.
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This <strong>GET</strong> endpoint retrieves **payouts for a
                  single merchant** (filtered by <code>userId</code>), grouped
                  by payout date and status.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>
                    : API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>
                    : API secret
                  </li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Query Parameters:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <strong>userId</strong> – (string, required) The ID of the
                    merchant whose payouts you want to fetch
                  </li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                  <strong>Note:</strong> Orders without any line item matching
                  the given user will be excluded from the response.
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/orders/getPayoutByUserId?userId=64acbe...`}
                  </pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">
                    {`{
  "message": "Payouts calculated",
  "totalAmount": 450.00,
  "totalRefundAmount": 25.00,
  "payouts": [
    {
      "payoutDate": "Jul 21, 2025",
      "transactionDates": "Jul 19 – Jul 21, 2025",
      "status": "Pending",
      "amount": "$450.00 AUD",
      "totalRefundAmount": "$25.00 AUD",
      "totalFulfilled": 4,
      "totalUnfulfilled": 1,
      "orders": [
        {
          "orderId": "123456",
          "shopifyOrderId": "456789",
          "shopifyOrderNo": "GE1023",
          "amount": 100.00,
          "refund": 10.00,
          "status": "pending",
          "createdAt": "2025-07-19T10:00:00.000Z",
          "fulfillmentSummary": {
            "fulfilled": 2,
            "unfulfilled": 1
          },
          "lineItems": [
            {
              "title": "Cool T-Shirt",
              "variant_title": "Red / L",
              "price": 25,
              "quantity": 2,
              "merchantId": "64acbe...",
              "merchantName": "John Doe",
              "merchantEmail": "john@example.com",
              "fulfillment_status": "fulfilled",
              "isCancelled": false
            }
          ]
        }
      ]
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {selected === "getPendingPayout" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT COLUMN */}
              <div className="bg-white rounded-md shadow-md p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                  <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                    GET /order/getPendingOrder
                  </code>
                </div>

                <div className="text-red-500 flex items-center text-sm mb-4">
                  <FaLock className="mr-2" />
                  Requires{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                    x-api-key
                  </code>{" "}
                  and{" "}
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    x-api-secret
                  </code>{" "}
                  in headers
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  This endpoint returns a monthly summary of all orders where
                  the <code>payoutStatus</code> is <strong>"pending"</strong>.
                  It groups the orders by month and year, returning total orders
                  and total payout amount for each month.
                </p>

                <h4 className="font-semibold text-sm text-gray-800 mb-2">
                  Required Headers:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-key
                    </code>{" "}
                    – API token
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 rounded text-xs">
                      x-api-secret
                    </code>{" "}
                    – API secret
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Request Example</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      GET
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
                    {`https://multi-vendor-marketplace.vercel.app/order/getPendingOrder`}
                  </pre>
                </div>
                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Success Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`[
  {
    "month": "January",
    "series1": 12,
    "series2": 3500
  },
  {
    "month": "February",
    "series1": 8,
    "series2": 2100
  }
]`}</pre>
                </div>

                <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
                  <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
                    <span>Error Response</span>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
                      JSON
                    </span>
                  </div>
                  <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Server error"
}`}</pre>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

const CodeCard = ({ title, tag, code, theme = "light" }) => {
  return (
    <div
      className={`rounded-md overflow-hidden shadow border ${
        theme === "dark" ? "bg-[#1e1e1e]" : "bg-[#f5f5f5]"
      } border-gray-300`}
    >
      <div
        className={`flex justify-between items-center px-4 py-2 text-xs font-semibold text-white ${
          theme === "dark" ? "bg-[#2e3a4c]" : "bg-[#2e3a4c]"
        }`}
      >
        <span>{title}</span>
        <span className="bg-gray-700 px-2 py-0.5 rounded text-white">
          {tag}
        </span>
      </div>
      <pre
        className={`text-sm p-4 font-mono whitespace-pre-wrap ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        {code}
      </pre>
    </div>
  );
};
