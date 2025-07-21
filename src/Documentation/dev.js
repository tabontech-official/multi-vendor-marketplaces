import React, { useState } from "react";
import ApiSidebar from "./DevSideBar";
import { FaLock, FaFlag } from "react-icons/fa";

export default function ApiDocsPage() {
  const [selected, setSelected] = useState("createProduct");

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-[260px] border-r bg-white shadow-sm">
        <ApiSidebar onSelect={(route) => setSelected(route)} />
      </div>

      {/* Main content */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
         <span className="text-purple-600">{selected}</span>
        </h1>

        {selected === "createProduct" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT COLUMN */}
            <div className="bg-white rounded-md shadow-md p-6">
              {/* Endpoint Title */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                POST  /product/addEquipment
                </code>
              </div>

              {/* Access Permissions */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                in headers to access this endpoint.
              </div>

              {/* Instruction */}
              <p className="text-gray-700 text-sm mb-4">
                To hit this endpoint, send a <strong>POST</strong> request with
                the headers and required body fields listed below.
              </p>

              {/* Headers Required */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Required Headers:
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                <li>
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    access-token
                  </code>
                  : (string) API access token
                </li>
                <li>
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    secret-key
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
                  <span className="text-gray-500">(number)</span> – Weight value
                </li>
                <li>
                  <strong>weight_unit</strong>{" "}
                  <span className="text-gray-500">(string)</span> – e.g., "kg",
                  "g", etc.
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
                  <span className="text-gray-500">(string)</span> – Vendor name
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
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">POST</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/addEquipment`}
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
            {/* LEFT COLUMN: API Documentation */}
            <div className="bg-white rounded-md shadow-md p-6">
              {/* Endpoint Title */}
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

              {/* Access Permissions */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                headers
              </div>

              {/* Instruction */}
              <p className="text-gray-700 text-sm mb-4">
                Send a <strong>PUT</strong> request with the following headers
                and request body:
              </p>

              {/* Request Headers */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Headers:
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                <li>
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    access-token
                  </code>
                  : (string)
                </li>
                <li>
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    secret-key
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

              {/* Request Body Params */}
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

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> Returns <code>401</code> if auth headers
                are missing.
              </div>
            </div>

            {/* RIGHT COLUMN: Example Payload & Response */}
            <div className="space-y-6">
               <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">PATCH</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app//product/updateProducts/687b....`}
        </pre>
      </div>
              {/* Request Body Example */}
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

              {/* Response Example */}
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
          /* alternative view... */
          <></>
        )}

        {selected === "getProductByUserId" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT COLUMN */}
            <div className="bg-white rounded-md shadow-md p-6">
              {/* Endpoint Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                  GET /product/getProduct/:userId?page=1&amp;limit=10
                </code>
                {/* <p className="mt-1 text-xs text-gray-500">
                  e.g.{" "}
                  <code className="text-gray-700">
                    /product/getProduct/687b28f5f49468ad34534cc8?page=1&amp;limit=10
                  </code>
                </p> */}
              </div>

              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                headers
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">
                Retrieves paginated products created by a specific user. You
                must pass{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">userId</code>{" "}
                as a path parameter and optional{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">page</code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">limit</code>{" "}
                query parameters.
              </p>

              {/* Query Params */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Query Parameters:
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                <li>
                  <strong>page</strong>{" "}
                  <span className="text-gray-500">(number, optional)</span> –
                  Default is 1
                </li>
                <li>
                  <strong>limit</strong>{" "}
                  <span className="text-gray-500">(number, optional)</span> –
                  Default is 10
                </li>
              </ul>

              {/* Path Param */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Path Param:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li>
                  <strong>userId</strong>{" "}
                  <span className="text-gray-500">(string, required)</span> –
                  The user ID whose products you want to fetch
                </li>
              </ul>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> If no products are found for this user, a{" "}
                <code>404</code> response will be returned.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
               <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/getProduct/687b...?page=1&limit=10`}
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

        {selected === "getAllProduct" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT COLUMN */}
            <div className="bg-white rounded-md shadow-md p-6">
              {/* Endpoint Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                  GET /product/getAllData?page=1&amp;limit=10
                </code>
                {/* <p className="mt-1 text-xs text-gray-500">
                  e.g.{" "}
                  <code className="text-gray-700">
                    /product/getAllData?page=2&amp;limit=20
                  </code>
                </p> */}
              </div>

              {/* Authentication */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                headers
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">
                Retrieves paginated products across all users. Returns product
                details including user info.
              </p>

              {/* Query Params */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Query Parameters:
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                <li>
                  <strong>page</strong>{" "}
                  <span className="text-gray-500">(number, optional)</span> –
                  Default is 1
                </li>
                <li>
                  <strong>limit</strong>{" "}
                  <span className="text-gray-500">(number, optional)</span> –
                  Default is 10
                </li>
              </ul>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> Returns <code>400</code> if no products
                are found and <code>500</code> on aggregation error.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
               <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/getAllData?page=1&limit=10`}
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

        {selected === "publishedProduct" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT COLUMN */}
            <div className="bg-white rounded-md shadow-md p-6">
              {/* Endpoint Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                  PUT /product/publishedProduct/:productId
                </code>
                {/* <p className="mt-1 text-xs text-gray-500">
                  e.g.{" "}
                  <code className="text-gray-700">
                    /product/publishedProduct/687b28f5f49468ad34534cc8
                  </code>
                </p> */}
              </div>

              {/* Auth */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                headers
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">
                Publishes a single product to Shopify by setting its status to{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">active</code>{" "}
                and scope to{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">global</code>
                . It also updates the local DB record and sets an expiration
                date 30 days ahead.
              </p>

              {/* Path Param */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Path Param:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li>
                  <strong>productId</strong>{" "}
                  <span className="text-gray-500">(string, required)</span> –
                  The MongoDB `_id` of the product to publish
                </li>
              </ul>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> Returns <code>404</code> if the product
                or Shopify config is not found. Returns <code>400</code> if
                Shopify update fails.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
               <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">PUT</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/publishedProduct/64acbe...`}
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
            {/* LEFT COLUMN */}
            <div className="bg-white rounded-md shadow-md p-6">
              {/* Endpoint Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                  PUT /product/unpublished/:productId
                </code>
                <p className="mt-1 text-xs text-gray-500">
                  e.g.{" "}
                  <code className="text-gray-700">
                    /product/unpublish/687b28f5f49468ad34534cc8
                  </code>
                </p>
              </div>

              {/* Auth */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                headers
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">
                Unpublishes a product on Shopify by setting its status to{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">draft</code>{" "}
                and also updates the product status in the local database.
              </p>

              {/* Path Param */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Path Param:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li>
                  <strong>productId</strong>{" "}
                  <span className="text-gray-500">(string, required)</span> –
                  MongoDB `_id` of the product to unpublish
                </li>
              </ul>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> Returns <code>404</code> if the product
                or config is missing. Returns <code>400</code> if Shopify update
                fails.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
                  <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">PUT</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/unpublished/64acbe...`}
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
              {/* Endpoint Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                  PUT /product/updateImages/:id
                </code>
                {/* <p className="mt-1 text-xs text-gray-500">
                  e.g.{" "}
                  <code className="text-gray-700">
                    /product/updateImages/687b28f5f49468ad34534cc8
                  </code>
                </p> */}
              </div>

              {/* Auth */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                headers
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">
                Uploads product and variant images to Shopify and updates them
                in your local database. You may pass any publicly accessible
                image URLs—Shopify will download and host them.
              </p>

              {/* Path Param */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Path Param:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>id</strong>{" "}
                  <span className="text-gray-500">(string, required)</span> –
                  Shopify Product ID
                </li>
              </ul>

              {/* Request Body */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Request Body:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <strong>images</strong>{" "}
                  <span className="text-gray-500">
                    (array of strings, required)
                  </span>{" "}
                  – List of image URLs
                </li>
                <li>
                  <strong>variantImages</strong>{" "}
                  <span className="text-gray-500">
                    (array of objects, optional)
                  </span>{" "}
                  – Each object should have a <code>url</code> key pointing to
                  the image
                </li>
              </ul>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> The image URLs can be hosted on any
                platform (e.g., AWS, Shopify, or CDN), as long as they are
                publicly accessible. Shopify will download and rehost them on
                its CDN.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
                    <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">PUT</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/updateImages/98755`}
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
            {/* LEFT COLUMN */}
            <div className="bg-white rounded-md shadow-md p-6">
              {/* Endpoint Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                  DELETE /product/deleteProduct/:id
                </code>
                {/* <p className="mt-1 text-xs text-gray-500">
                  e.g.{" "}
                  <code className="text-gray-700">
                    /product/delete/687b28f5f49468ad34534cc8
                  </code>
                </p> */}
              </div>

              {/* Auth */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                headers
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">
                Permanently deletes a product from your local database. The
                product must have a valid internal ID.
              </p>

              {/* Path Param */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Path Param:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li>
                  <strong>id</strong>{" "}
                  <span className="text-gray-500">(string, required)</span> –
                  MongoDB `_id` of the product
                </li>
              </ul>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> If the product is not found, the API will
                return a <code>404</code> error.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
               <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">DELETE</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/delete/687b...`}
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
            {/* LEFT COLUMN */}
            <div className="bg-white rounded-md shadow-md p-6">
              {/* Endpoint Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                  POST /product/addImageGallery
                </code>
                {/* <p className="mt-1 text-xs text-gray-500">
                  e.g.{" "}
                  <code className="text-gray-700">
                    /product/addImageGallery
                  </code>
                </p> */}
              </div>

              {/* Auth */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                headers
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">
                Adds one or more image URLs to the user's image gallery. If the
                gallery already exists, new images are appended (excluding
                duplicates).
              </p>

              {/* Body Params */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Request Body:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li>
                  <strong>userId</strong>{" "}
                  <span className="text-gray-500">(string, required)</span> –
                  The unique ID of the user.
                </li>
                <li>
                  <strong>images</strong>{" "}
                  <span className="text-gray-500">
                    (array of strings, required)
                  </span>{" "}
                  – Image URLs to add.
                </li>
              </ul>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> Duplicate image URLs will be ignored
                automatically.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
               <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">POST</span>
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
                  product (or returns cloud/shopify images if omitted).
                </p>
              </div>

              {/* Auth */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                headers
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">
                Fetches the user's image gallery. If a <code>productId</code> is
                provided, it filters to images assigned to that product or
                global (no productId). Otherwise, it filters for
                Cloudinary/Shopify-hosted images.
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
                </li>
              </ul>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> If no productId is passed, only
                Cloudinary or Shopify-hosted images will be returned.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
               <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
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
                  POST /product/upload-csv-body/:userId
                </code>
                <p className="mt-1 text-xs text-gray-500">
                  Upload CSV to bulk add or update Shopify products with
                  variants, options, images, and metafields.
                </p>
              </div>

              {/* Auth */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                headers
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">
                Accepts a CSV file with product details. Products are grouped by{" "}
                <code>Handle</code>. If the product exists, it's updated;
                otherwise, it's created. Variant images are uploaded and linked.
                Tags and metafields are applied.
              </p>

              {/* Path Params */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Path Parameters:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>userId</strong>{" "}
                  <span className="text-gray-500">(string, required)</span> –
                  User ID for whom the products are uploaded.
                </li>
              </ul>

              {/* File Upload */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Form Data:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <strong>file</strong>{" "}
                  <span className="text-gray-500">(CSV, required)</span> – CSV
                  file containing product rows.
                </li>
              </ul>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> Category column is used to assign smart
                tags (catNo) and nested category paths.
                <br />
                SEO Title & Description are saved as metafields{" "}
                <code>global.title_tag</code> and{" "}
                <code>global.description_tag</code>.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
               <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">POST</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/upload-csv-body/64acbe...`}
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

        {selected === "getSingleVariant" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT COLUMN */}
            <div className="bg-white rounded-md shadow-md p-6">
              {/* Endpoint Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                  GET /product/getSingleVariant/:productId/variants/:variantId
                </code>
                <p className="mt-1 text-xs text-gray-500">
                  Returns a specific variant's full information from the listing
                  model, including price, SKU, options, and inventory.
                </p>
              </div>

              {/* Auth */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                headers
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">
                This endpoint performs a MongoDB aggregation on{" "}
                <code>listingModel</code> to locate the exact variant using
                <code>productId</code> and <code>variantId</code>, and returns
                its detailed data including variant fields, all product options,
                and associated product images.
              </p>

              {/* Path Params */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Path Parameters:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>productId</strong>{" "}
                  <span className="text-gray-500">(string, required)</span> – ID
                  of the product that owns the variant.
                </li>
                <li>
                  <strong>variantId</strong>{" "}
                  <span className="text-gray-500">(string, required)</span> – ID
                  of the specific variant to fetch.
                </li>
              </ul>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> This endpoint reads from MongoDB only and
                does not fetch from Shopify directly. Useful for local
                dashboards, variant editors, and admin panels.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
               <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/getSingleVariant/987645/variants/34643809`}
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

        {selected === "updateSingleVariant" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT COLUMN */}
            <div className="bg-white rounded-md shadow-md p-6">
              {/* Endpoint Title */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                  PUT /product/updateVariant/:productId/:variantId
                </code>
              </div>

              {/* Access Permissions */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                in headers
              </div>

              {/* Instruction */}
              <p className="text-gray-700 text-sm mb-4">
                To hit this endpoint, send a <strong>PUT</strong> request with
                the headers and required body fields listed below.
              </p>

              {/* Headers Required */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Required Headers:
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                <li>
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    access-token
                  </code>
                  : (string) API access token
                </li>
                <li>
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    secret-key
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

              {/* Body Params */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Request Body Parameters:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <strong>price</strong>{" "}
                  <span className="text-gray-500">(string, required)</span> –
                  Updated variant price
                </li>
                <li>
                  <strong>compare_at_price</strong>{" "}
                  <span className="text-gray-500">(string)</span> – MRP or old
                  price
                </li>
                <li>
                  <strong>inventory_quantity</strong>{" "}
                  <span className="text-gray-500">(number)</span> – Available
                  inventory
                </li>
                <li>
                  <strong>sku</strong>{" "}
                  <span className="text-gray-500">(string)</span> – SKU code
                </li>
                <li>
                  <strong>barcode</strong>{" "}
                  <span className="text-gray-500">(string)</span> – Barcode
                </li>
                <li>
                  <strong>option1</strong>{" "}
                  <span className="text-gray-500">(string)</span> – First option
                  (e.g. Color)
                </li>
                <li>
                  <strong>option2</strong>{" "}
                  <span className="text-gray-500">(string)</span> – Second
                  option (e.g. Size)
                </li>
                <li>
                  <strong>option3</strong>{" "}
                  <span className="text-gray-500">(string)</span> – Third option
                  (optional)
                </li>
                <li>
                  <strong>weight</strong>{" "}
                  <span className="text-gray-500">(number)</span> – Weight value
                </li>
                <li>
                  <strong>inventory_policy</strong>{" "}
                  <span className="text-gray-500">(string)</span> – Shopify
                  policy ("deny", "continue")
                </li>
              </ul>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> Inventory is updated separately using the
                Shopify Inventory API after variant update.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
               <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">PUT</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/upload-csv-body/64acbe...`}
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

              {/* Response */}
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
              {/* Endpoint Title */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
                <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
                  PUT /product/updateInventoryPrice/:id
                </code>
              </div>

              {/* Access Permissions */}
              <div className="text-red-500 flex items-center text-sm mb-4">
                <FaLock className="mr-2" />
                Requires{" "}
                <code className="bg-gray-100 px-1 rounded text-xs mx-1">
                  access-token
                </code>{" "}
                and{" "}
                <code className="bg-gray-100 px-1 rounded text-xs">
                  secret-key
                </code>{" "}
                in headers
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4">
                This endpoint updates the <strong>price</strong> and{" "}
                <strong>compare_at_price</strong> of a product variant both in
                your local database and on your connected Shopify store.
              </p>

              {/* Headers */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                Required Headers:
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                <li>
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    access-token
                  </code>{" "}
                  – API Access Token
                </li>
                <li>
                  <code className="bg-gray-100 px-1 rounded text-xs">
                    secret-key
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

              {/* Request Params */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                URL Parameter:
              </h4>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
                <li>
                  <strong>:id</strong> – Shopify Variant ID to be updated
                </li>
              </ul>

              {/* Body Params */}
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

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
                <strong>Note:</strong> This endpoint only updates{" "}
                <code>price</code> and <code>compare_at_price</code>. To update
                inventory quantity, use the{" "}
                <code>/updateInventoryQuantity</code> endpoint.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
               <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">PUT</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/updateInventoryPrice/87856567`}
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
                <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">{`{
  "price": "29.99",
  "compareAtPrice": "49.99"
}`}</pre>
              </div>

              {/* Example Success Response */}
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

              {/* Example Error Response */}
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          PUT /product/updateInventoryQuantity/:id
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">
          access-token
        </code>{" "}
        and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">
          secret-key
        </code>{" "}
        in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint updates the <strong>inventory quantity</strong> of a
        Shopify product variant both in your local database and Shopify via the
        Inventory Levels API.
      </p>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">
        Required Headers:
      </h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li>
          <code className="bg-gray-100 px-1 rounded text-xs">
            access-token
          </code>{" "}
          – API Access Token
        </li>
        <li>
          <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> –
          API Secret Key
        </li>
        <li>
          <code className="bg-gray-100 px-1 rounded text-xs">Content-Type</code>{" "}
          – <code>application/json</code>
        </li>
      </ul>

      {/* Request Params */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">
        URL Parameter:
      </h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li>
          <strong>:id</strong> – Shopify Variant ID whose quantity is to be
          updated
        </li>
      </ul>

      {/* Body Params */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">
        Request Body Parameters:
      </h4>
      <ul className="text-sm text-gray-700 space-y-2">
        <li>
          <strong>quantity</strong>{" "}
          <span className="text-gray-500">(number, required)</span> – New
          available quantity
        </li>
      </ul>

      {/* Note */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
        <strong>Note:</strong> The Shopify Inventory API requires an{" "}
        <code>inventory_item_id</code> and <code>location_id</code>, which are
        fetched automatically by this endpoint before updating.
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">PUT</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/updateInventoryQuantity/5678653889`}
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
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">{`{
  "quantity": 12
}`}</pre>
      </div>

      {/* Example Success Response */}
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

      {/* Example Error Response */}
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          POST /product/bulkUpload/inventory
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code>{" "}
        and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code>{" "}
        in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint processes a CSV file and updates <strong>inventory quantity</strong>,
        <strong>price</strong>, <strong>compare_at_price</strong>, and
        <strong>product status</strong> on Shopify. It also updates your local MongoDB database
        based on the given Variant SKUs.
      </p>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code> – API Access Token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> – API Secret Key</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">Content-Type</code> – multipart/form-data</li>
      </ul>

      {/* Body Fields */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Form Data Fields:</h4>
      <ul className="text-sm text-gray-700 space-y-2">
        <li><strong>file</strong> <span className="text-gray-500">(CSV file, required)</span> – Inventory and price data</li>
        <li><strong>userId</strong> <span className="text-gray-500">(string, required)</span> – ID of the user performing the update</li>
      </ul>

      {/* Required CSV Columns */}
      <h4 className="font-semibold text-sm text-gray-800 mt-6 mb-2">Required CSV Columns:</h4>
      <ul className="text-sm text-gray-700 space-y-1">
        <li><code>Variant SKU</code> – SKU of the product variant</li>
        <li><code>Variant Inventory Qty</code> – Inventory quantity</li>
        <li><code>Variant Price</code> – Selling price (optional)</li>
        <li><code>Variant Compare At Price</code> – MRP or old price (optional)</li>
        <li><code>Status</code> – Product status: <code>active</code>, <code>draft</code>, or <code>archived</code> (optional)</li>
      </ul>

      {/* Note */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
        <strong>Note:</strong> Only variants with matching SKUs in your product database will be updated.
        Products with unmatched SKUs are skipped and logged in the response.
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">POST</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/product/bulkUpload/inventory`}
        </pre>
      </div>
      {/* Sample CSV */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Sample CSV Content</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">CSV</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">{`Variant SKU,Variant Inventory Qty,Variant Price,Variant Compare At Price,Status
SKU-RED-M,15,19.99,29.99,active
SKU-BLUE-L,0,21.50,28.50,draft
SKU-GREEN-S,5,,,archived`}</pre>
      </div>

      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          POST /category/createCategory
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code> and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint allows you to create hierarchical categories (level1, level2, level3) in your system and automatically create a Shopify collection based on the generated <code>catNo</code> tags. These tags are used as rules in the collection's auto-tagging logic.
      </p>

      {/* Required Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code> – API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> – API secret</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">Content-Type</code> – <code>application/json</code></li>
      </ul>

      {/* Request Body */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Request Body Parameters:</h4>
      <ul className="text-sm text-gray-700 space-y-2">
        <li><strong>title</strong> <span className="text-gray-500">(string, optional)</span> – Collection title</li>
        <li><strong>description</strong> <span className="text-gray-500">(string, optional)</span> – Collection description</li>
        <li><strong>handle</strong> <span className="text-gray-500">(string, optional)</span> – Shopify collection handle override</li>
        <li><strong>categories</strong> <span className="text-gray-500">(array, required)</span> – List of category objects</li>
      </ul>

      {/* Note */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
        <strong>Note:</strong> Each category will automatically be assigned a unique <code>catNo</code> (e.g., <code>cat_101</code>), which is used to tag products and apply Shopify collection rules.
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">POST</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/category/createCategory`}
        </pre>
      </div>
      {/* Request Example */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Body</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">{`{
  "title": "Women's Accessories",
  "description": "All women's category-based auto collection",
  "handle": "womens-accessories",
  "categories": [
    {
      "title": "Scarves",
      "description": "Silk and wool scarves",
      "level": "level1"
    },
    {
      "title": "Printed Scarves",
      "description": "Colorful prints",
      "level": "level2"
    },
    {
      "title": "Floral Scarves",
      "description": "Floral patterns",
      "level": "level3"
    }
  ]
}`}</pre>
      </div>

      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
        </div>
        <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Categories saved successfully and Shopify collection created",
  "collections": "gid://shopify/Collection/512939127264"
}`}</pre>
      </div>

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          GET /category/getCategory
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code> and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint fetches all existing categories stored in the system, including level1,
        level2, and level3 entries. These are useful for mapping product categories or creating
        filters.
      </p>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code> – API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> – API secret</li>
      </ul>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/category/getCategory`}
        </pre>
      </div>
      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          GET /category/category/:categoryId
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code> and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint fetches a single category by its <code>catNo</code>. If the category is of level 2 or 3,
        its parent categories (level 1 or 2) will also be fetched internally to ensure the full
        hierarchy is known. The final response will only return the category matching the requested
        <code>catNo</code>.
      </p>

      {/* Path Params */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Path Parameter:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><strong>categoryId</strong> – The category <code>catNo</code> to retrieve</li>
      </ul>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code> – API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> – API secret</li>
      </ul>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/category/category/64acb...`}
        </pre>
      </div>
      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          DELETE /category/deleteCollection
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code> and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint deletes one or more categories by their internal MongoDB <code>_id</code>s and also removes the linked Shopify collections (if they exist), using the GraphQL <code>collectionDelete</code> mutation. You must pass an array of category IDs in the request body.
      </p>

      {/* Body Params */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Body Parameters:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><strong>categoryIds</strong> – <code>Array of category _id</code> to be deleted</li>
      </ul>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code> – API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> – API secret</li>
      </ul>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">DELETE</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/category/deleteCollection`}
        </pre>
      </div>
      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
        </div>
        <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "success": true,
  "message": "Selected categories are deleted successfully."
}`}</pre>
      </div>

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          GET /order/order/:userId
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code> and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint returns all orders that contain products uploaded by the specified <code>userId</code>. It filters line items by comparing their variant IDs with the authenticated user's products. Only matched items are returned in the response.
      </p>

      {/* Path Params */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Path Parameter:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><strong>userId</strong> – MongoDB ID of the user whose products you want to filter orders by</li>
      </ul>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code> – API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> – API secret</li>
      </ul>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/order/order/64acbe...`}
        </pre>
      </div>
      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          GET /order/getOrderByOrderId/:id
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code> and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint returns a single order by its <code>orderId</code>. It is useful for retrieving full details of one specific order, including its line items.
      </p>

      {/* Path Params */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Path Parameter:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><strong>id</strong> – Order ID (e.g. Shopify order ID or internal orderId)</li>
      </ul>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code> – API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> – API secret</li>
      </ul>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/getOrderByOrderId/1234567890`}
        </pre>
      </div>
      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          GET /order/getAllOrderForMerchants
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code> and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint fetches all orders from the system and groups them by order. Each order object contains line items grouped by merchant. Each merchant includes basic details, total order value, and count.
      </p>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code> – API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> – API secret</li>
      </ul>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/order/getAllOrderForMerchants`}
        </pre>
      </div>
      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          GET /order/getCancellationRequests
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code> and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint retrieves all order cancellation requests and groups them by user. Each user entry includes their basic details, number of requests made, and an array of their submitted requests with product names, order IDs, and timestamps.
      </p>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code> – API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> – API secret</li>
      </ul>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/order/getCancellationRequests`}
        </pre>
      </div>
      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          POST /order/cancelShopifyOrder
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code> and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint cancels an order in Shopify using its order ID. You can also provide specific line item IDs to mark only certain items as "cancelled" in your database. Shopify will cancel the full order, and your system will update internal status for the specified line items.
      </p>

      {/* Request Body */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Request Body:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">orderId</code> (string) – Shopify Order ID (required)</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">reason</code> (string) – Cancellation reason (optional, defaults to <code>customer</code>)</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">lineItemIds</code> (array) – Line item IDs to mark as cancelled in DB (required)</li>
      </ul>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">POST</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/order/cancelShopifyOrder`}
        </pre>
      </div>
      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
        </div>
        <pre className="text-sm p-4 font-mono text-white bg-[#1e1e1e] whitespace-pre-wrap">{`{
  "message": "Order cancelled successfully. Selected line items marked as cancelled.",
  "Status": "refunded",
  "updatedLineItems": ["447210849", "447210850"],
  "orderId": "5467890123",
  "cancelledAt": "2025-07-21T10:12:45.200Z"
}`}</pre>
      </div>

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          GET /order/exportOrders
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code> and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint exports Shopify order data in CSV format. It groups order line items per order and includes customer info, item details, fulfillment status, and payout info. You can filter the line items by status (e.g. <code>fulfilled</code>, <code>unfulfilled</code>, <code>cancelled</code>) using a query parameter.
      </p>

      {/* Query Parameters */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Query Parameters:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li>
          <code className="bg-gray-100 px-1 rounded text-xs">status</code> (optional) – Filters items by fulfillment status. Valid values: <code>fulfilled</code>, <code>unfulfilled</code>, <code>cancelled</code>.
        </li>
      </ul>

      {/* Notes */}
      <p className="text-xs text-gray-500 italic">
        ⚠️ For large exports (e.g. 50k+ orders), the system auto-generates the CSV and returns it as a downloadable file.
      </p>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel./order/exportOrders`}
        </pre>
      </div>
      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">CSV File</span>
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

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          POST  /order/addPayOutDates
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">
          access-token
        </code>{" "}
        and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">
          secret-key
        </code>{" "}
        in headers to access this endpoint.
      </div>

      {/* Instruction */}
      <p className="text-gray-700 text-sm mb-4">
        To hit this endpoint, send a <strong>POST</strong> request with the
        headers and required body fields listed below.
      </p>

      {/* Headers Required */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">
        Required Headers:
      </h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li>
          <code className="bg-gray-100 px-1 rounded text-xs">
            access-token
          </code>
          : (string) API access token
        </li>
        <li>
          <code className="bg-gray-100 px-1 rounded text-xs">
            secret-key
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
          <strong>payoutFrequency</strong>{" "}
          <span className="text-gray-500">(string, required)</span> – One of: <code>daily</code>, <code>weekly</code>, <code>once</code>, <code>twice</code>
        </li>
        <li>
          <strong>graceTime</strong>{" "}
          <span className="text-gray-500">(number, optional)</span> – Number of days delay before first payout
        </li>
        <li>
          <strong>firstDate</strong>{" "}
          <span className="text-gray-500">(number)</span> – Day of month for 1st payout (1-28) [used in <code>once</code> or <code>twice</code>]
        </li>
        <li>
          <strong>secondDate</strong>{" "}
          <span className="text-gray-500">(number)</span> – Day of month for 2nd payout (1-28) [only for <code>twice</code>]
        </li>
        <li>
          <strong>weeklyDay</strong>{" "}
          <span className="text-gray-500">(string)</span> – Day of week (e.g. "Monday") [only for <code>weekly</code>]
        </li>
      </ul>

      {/* Note */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
        <strong>Note:</strong> If you miss required values like <code>weeklyDay</code> or <code>firstDate</code>, you'll get a <code>400 Bad Request</code>.
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">POST</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/order/addPayOutDates`}
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
  "payoutFrequency": "twice",
  "graceTime": 7,
  "firstDate": 5,
  "secondDate": 20
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          POST  /orders/addReferenceNumber
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">
          access-token
        </code>{" "}
        and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">
          secret-key
        </code>{" "}
        in headers to access this endpoint.
      </div>

      {/* Instruction */}
      <p className="text-gray-700 text-sm mb-4">
        To hit this endpoint, send a <strong>POST</strong> request with the
        headers and required body fields listed below.
      </p>

      {/* Headers Required */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">
        Required Headers:
      </h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li>
          <code className="bg-gray-100 px-1 rounded text-xs">
            access-token
          </code>
          : (string) API access token
        </li>
        <li>
          <code className="bg-gray-100 px-1 rounded text-xs">
            secret-key
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
          <strong>UserIds</strong>{" "}
          <span className="text-gray-500">(array, required)</span> – An array of MongoDB user IDs to update
        </li>
        <li>
          <strong>referenceNo</strong>{" "}
          <span className="text-gray-500">(string, required)</span> – Reference number to assign to each user
        </li>
      </ul>

      {/* Note */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
        <strong>Note:</strong> This will only update users found in the database. If none match, it will return a 404.
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">POST</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/orders/addReferenceNumber`}
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
  "UserIds": [
    "64cafd1a2f9cbe00123abcd1",
    "64cafd1a2f9cbe00123abcd2"
  ],
  "referenceNo": "REF-2025-JULY"
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          GET  /orders/getPayout
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">
          access-token
        </code>{" "}
        and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">
          secret-key
        </code>{" "}
        in headers to access this endpoint.
      </div>

      {/* Instruction */}
      <p className="text-gray-700 text-sm mb-4">
        This <strong>GET</strong> endpoint fetches calculated payout summaries grouped by payout date and merchant. Includes pagination via query parameters.
      </p>

      {/* Headers Required */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code>: (string) API access token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code>: (string) API secret key</li>
      </ul>

      {/* Query Params */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Optional Query Parameters:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><strong>page</strong> <span className="text-gray-500">(number)</span> – Page number (default: 1)</li>
        <li><strong>limit</strong> <span className="text-gray-500">(number)</span> – Results per page (default: 10)</li>
      </ul>

      {/* Note */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
        <strong>Note:</strong> Each payout group includes aggregated merchant-specific totals, status, and timeline range.
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
      {/* Sample Request */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request URL</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/orders/getPayout?page=1&limit=5`}
        </pre>
      </div>

      {/* Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          GET  /orders/getPayoutOrders
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">
          access-token
        </code>{" "}
        and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">
          secret-key
        </code>{" "}
        in headers to access this endpoint.
      </div>

      {/* Instruction */}
      <p className="text-gray-700 text-sm mb-4">
        This <strong>GET</strong> endpoint retrieves **payout orders grouped by payout date** and **filtered by merchant**.
      </p>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code>: API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code>: API secret</li>
      </ul>

      {/* Query Params */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Query Parameters:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><strong>userId</strong> (required) – Merchant/User ID to filter products</li>
        <li><strong>status</strong> (optional) – Filter payouts by <code>pending</code> or <code>deposited</code></li>
        <li><strong>payoutDate</strong> (optional) – Format: <code>Jul 21, 2025</code></li>
      </ul>

      {/* Note */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
        <strong>Note:</strong> Only products owned by the given <code>userId</code> are included.
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
      {/* Request Example */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/orders/getPayoutOrders?userId=64abf1a12b9...&status=pending`}
        </pre>
      </div>

      {/* Sample Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          GET  /order/getPayoutForAllOrders
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">
          access-token
        </code>{" "}
        and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">
          secret-key
        </code>{" "}
        in headers to access this endpoint.
      </div>

      {/* Instruction */}
      <p className="text-gray-700 text-sm mb-4">
        This <strong>GET</strong> endpoint retrieves all orders across merchants, grouped by payout date and status. It calculates payout totals, refund amounts, and includes merchant PayPal and reference data.
      </p>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code>: API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code>: API secret</li>
      </ul>

      {/* Query Params */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Query Parameters (optional):</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><strong>payoutDate</strong> – Format: <code>Jul 21, 2025</code> – Filters payouts for a specific date</li>
        <li><strong>status</strong> – <code>pending</code> or <code>deposited</code></li>
      </ul>

      {/* Note */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
        <strong>Note:</strong> This endpoint automatically calculates payout and refund per merchant per order.
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
      {/* Request Example */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/order/getPayoutForAllOrders?payoutDate=Jul 21, 2025&status=pending`}
        </pre>
      </div>

      {/* Sample Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
        GET  /order/getPayoutByUserId
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">
          access-token
        </code>{" "}
        and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">
          secret-key
        </code>{" "}
        in headers to access this endpoint.
      </div>

      {/* Instruction */}
      <p className="text-gray-700 text-sm mb-4">
        This <strong>GET</strong> endpoint retrieves **payouts for a single merchant** (filtered by <code>userId</code>), grouped by payout date and status.
      </p>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code>: API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code>: API secret</li>
      </ul>

      {/* Query Params */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Query Parameters:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><strong>userId</strong> – (string, required) The ID of the merchant whose payouts you want to fetch</li>
      </ul>

      {/* Note */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-800 rounded-md mt-6">
        <strong>Note:</strong> Orders without any line item matching the given user will be excluded from the response.
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
      {/* Request Example */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/orders/getPayoutByUserId?userId=64acbe...`}
        </pre>
      </div>

      {/* Sample Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
      {/* Endpoint Title */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Endpoint:</p>
        <code className="text-purple-700 font-medium break-words text-xs sm:text-sm">
          GET /order/getPendingOrder
        </code>
      </div>

      {/* Access Permissions */}
      <div className="text-red-500 flex items-center text-sm mb-4">
        <FaLock className="mr-2" />
        Requires{" "}
        <code className="bg-gray-100 px-1 rounded text-xs mx-1">access-token</code> and{" "}
        <code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> in headers
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4">
        This endpoint returns a monthly summary of all orders where the <code>payoutStatus</code> is <strong>"pending"</strong>. It groups the orders by month and year, returning total orders and total payout amount for each month.
      </p>

      {/* Headers */}
      <h4 className="font-semibold text-sm text-gray-800 mb-2">Required Headers:</h4>
      <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
        <li><code className="bg-gray-100 px-1 rounded text-xs">access-token</code> – API token</li>
        <li><code className="bg-gray-100 px-1 rounded text-xs">secret-key</code> – API secret</li>
      </ul>
    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-6">
       <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#f5f5f5]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Request Example</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">GET</span>
        </div>
        <pre className="text-sm p-4 font-mono text-gray-800 whitespace-pre-wrap">
{`https://multi-vendor-marketplace.vercel.app/order/getPendingOrder`}
        </pre>
      </div>
      {/* Success Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Success Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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

      {/* Error Response */}
      <div className="rounded-md overflow-hidden shadow border border-gray-300 bg-[#1e1e1e]">
        <div className="flex justify-between items-center bg-[#2e3a4c] px-4 py-2 text-xs font-semibold text-white">
          <span>Error Response</span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-white">JSON</span>
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
  );
}
