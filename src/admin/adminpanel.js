import React, { useState, useEffect, useRef } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePencil,
} from "react-icons/hi"; // Success and error icons
import { FiLoader } from "react-icons/fi"; // Import loader icon
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
const AdminDashboard = () => {
  const [filteredProducts, setFilteredProducts] = useState([
    { _id: "1", title: "Shopify Api key " },
    { _id: "2", title: "Shopify Access Token  " },
  ]);
  const [shopifyAccessToken, setShopifyAccessToken] = useState('');
  const [shopifyApiKey, setShopifyApiKey] = useState('');
  const [shopifyStoreUrl, setShopifyStoreUrl] = useState('');

  const [editing, setEditing] = useState(false)
  const handleSave = async () => {
    try {
      await axios.put('http://localhost:5000/auth/shopifyConfigurations', {
        shopifyAccessToken,
        shopifyApiKey,
        shopifyStoreUrl
      });
      setEditing(false);
    } catch (error) {
      console.error('Error saving credentials', error);
    }
  };
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [toast2, setToast2] = useState({ show: false, type: "", message: "" });
  const [toast3, setToast3] = useState({ show: false, type: "", message: "" });

  const [Price, setPrice] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChangePriceDialogOpen, setIsChangePriceDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const [email, setEmail] = useState("");
  const [GiftQuantity, setGiftQuantity] = useState(null);
  const [productId, setProductId] = useState("");

  const [changePrice, setChangePrice] = useState("");
  const [EditCredit, setEditCredit] = useState(true);

  const [editingProductId, setEditingProductId] = useState(null); // Track the ID of the product being edited
  const fetchPrice = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/product/getPrice/",
        { method: "GET" }
      );
      const json = await response.json();
      if (response.ok) {
        setProductId(json[0].creditId);
        setPrice(json[0].price);
        setChangePrice(json[0].price);
      }
    } catch (error) {
      console.error("Error fetching quantity:", error);
    }
  };

  // Show toast message
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const showToast2 = (type, message) => {
    setToast2({ show: true, type, message });
    setTimeout(() => setToast2({ show: false, type: "", message: "" }), 3000);
  };

  const showToast3 = (type, message) => {
    setToast3({ show: true, type, message });
    setTimeout(() => setToast3({ show: false, type: "", message: "" }), 3000);
  };

  const handleChangePerCreditPrice = () => {
    setEditingPrice(!editingPrice);
    setIsChangePriceDialogOpen(true);
  };

  const handleConfirmChangePrice = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/product/updateId/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            creditId: productId,
            price: Number(changePrice),
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        setEditCredit(!EditCredit);
        fetchPrice();
        showToast2("success", json.message);
        setChangePrice("");
        setProductId("");
        return setEditingProductId(null);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        showToast2("error", errorData.message || "Failed to update price.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      showToast2("error", "Error during the API call.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequiredCredits = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/product/fetchRequireCredits",
        { method: "GET" }
      );
      const data = await response.json();

      const creditsMap = data.data.reduce((map, item) => {
        map[item.product_type] = item.credit_required;
        return map;
      }, {});

      const updatedProducts = filteredProducts.map((product) => {
        const cleanedTitle = product.title.trim();
        let matchedType = "";

        switch (cleanedTitle) {
          case "New Equipments":
            matchedType = "New Equipments";
            break;
          case "Used Equipments":
            matchedType = "Used Equipments";
            break;
          case "SPA Business For Sale":
            matchedType = "Businesses To Purchase";
            break;
          case "Provider Job Offer":
            matchedType = "Provider Needed";
            break;
          case "Provider Job Search":
            matchedType = "Providers Available";
            break;
          case "Room for Rent":
            matchedType = "Spa Room For Rent";
            break;
          case "I am Looking For":
            matchedType = "Looking For";
            break;
          default:
            matchedType = "";
        }

        return {
          ...product,
          requiredCredits: creditsMap[matchedType] || "0",
        };
      });

      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error fetching required credits:", error);
    }
  };

  useEffect(() => {
    fetchRequiredCredits();
    fetchPrice();
  }, []);

  const handleEditPrice = (productId, price) => {
    if (editingProductId === productId) {
      setEditingProductId(null);
    } else {
      setEditingProductId(productId);
      setNewPrice(price);
    }
  };

  const handleClickOutside = (event) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target)) {
      setIsDialogOpen(false);
      setIsChangePriceDialogOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSetPrice = async (productname, price) => {
    setLoading(true);
    setToast({ show: false, type: "", message: "" }); // Reset toast

    let product_type = "";
    switch (productname) {
      case "New Equipments ":
        product_type = "New Equipments";
        break;
      case "Used Equipments ":
        product_type = "Used Equipments";
        break;
      case "SPA Business For Sale":
        product_type = "Businesses To Purchase";
        break;
      case "Provider Job Offer":
        product_type = "Provider Needed";
        break;
      case "Provider Job Search":
        product_type = "Providers Available";
        break;
      case "Room for Rent ":
        product_type = "Spa Room For Rent";
        break;
      case "I am Looking For":
        product_type = "Looking For";
        break;
      default:
        console.error("Unknown product type");
        setLoading(false);
        showToast("error", "Unknown product type");
        return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/product/credits/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newCredit: Number(price), // Ensure it's a number
            productType: product_type,
          }),
        }
      );

      if (response.ok) {
        fetchRequiredCredits();
        const json = await response.json();
        showToast("success", json.message);
        setEditingProductId(null);
      } else {
        showToast("error", "Failed to update price.");
      }
    } catch (error) {
      showToast("error", "Error during the API call.");
    }

    setLoading(false);
    setEditingPrice(null); // Exit edit mode
  };

  const sendCredit = async () => {
    if (!email || !GiftQuantity) {
      showToast("error", "Please enter a valid email and quantity.");
      return;
    }
    setLoading(true);
    setToast({ show: false, type: "", message: "" }); // Reset toast
    try {
      const response = await fetch(
        "http://localhost:5000/auth/updatequantity",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Include content-type
          },
          body: JSON.stringify({
            email: email,
            quantity: Number(GiftQuantity),
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        showToast3("success", json.message || "Credits sent successfully!");
        setGiftQuantity(null);
      } else {
        const errorData = await response.json(); 
        showToast3("error", errorData.error || "Failed to send credits.");
      }
    } catch (error) {
      console.error("Error during the API call:", error); 
      showToast3("error", "Error during the API call.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div
        className={`flex flex-col bg-gray-50 px-3 py-6 ${
          isDialogOpen || isChangePriceDialogOpen ? "blur-background" : ""
        }`}
      >
        {/* Toast Notification */}
        {toast.show && (
          <div
            className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {toast.type === "success" ? (
              <HiOutlineCheckCircle className="w-6 h-6 mr-2" />
            ) : (
              <HiOutlineXCircle className="w-6 h-6 mr-2" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:justify-between  border-b-2 border-gray-200 pb-4 items-center">
          <div className="flex items-center justify-center">
            <div className=" p-2 mr-3 rounded-lg shadow-md max-sm:mb-2 flex items-center justify-center">
              <span className="font-bold text-green-600">
                Dev Configuration
              </span>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="flex flex-1 overflow-hidden py-10">
          <div className="w-full overflow-auto flex justify-center items-center">
          <table className="w-2/4 divide-y divide-gray-200">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Shopify Store Configuration
      </th>
      <th className="px-6 py-3"></th>
      <th className="px-6 py-3"></th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    <tr>
      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
        Shopify Access Token
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          disabled={!editing}
          type="text"
          value={shopifyAccessToken}
          onChange={(e) => setShopifyAccessToken(e.target.value)}
          className={`border rounded-md px-2 py-1 w-[25rem] ${
            editing ? "bg-white" : "bg-gray-200"
          }`}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <HiOutlinePencil className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave} // save handler
              className="bg-green-500 text-white rounded-md px-2 py-1"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)} // cancel edit
              className="bg-red-500 text-white rounded-md px-2 py-1"
            >
              <FaTimes />
            </button>
          </div>
        )}
      </td>
    </tr>

    <tr>
      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
        Shopify API Key
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          disabled={!editing}
          type="text"
          value={shopifyApiKey}
          onChange={(e) => setShopifyApiKey(e.target.value)}
          className={`border rounded-md px-2 py-1 w-[25rem] ${
            editing ? "bg-white" : "bg-gray-200"
          }`}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {/* Same edit buttons not repeated here; handled in the first row */}
      </td>
    </tr>
    <tr>
      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
        Shopify Store Url
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          disabled={!editing}
          type="text"
          value={shopifyStoreUrl}
          onChange={(e) => setShopifyStoreUrl(e.target.value)}
          className={`border rounded-md px-2 py-1 w-[25rem] ${
            editing ? "bg-white" : "bg-gray-200"
          }`}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {/* Same edit buttons not repeated here; handled in the first row */}
      </td>
    </tr>
  </tbody>
</table>

          </div>
        </div>

        {/* Dialog for buying credits */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              ref={dialogRef}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg border border-black relative"
            >
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
              <h2 className="text-xl font-bold mb-4">Gift Credits</h2>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Recipient's email"
                className="border border-gray-300 rounded-md px-4 py-2 w-full mb-4"
              />

              <input
                type="number"
                value={GiftQuantity}
                onChange={(e) => setGiftQuantity(e.target.value)}
                placeholder="Quantity"
                className="border border-gray-300 rounded-md px-4 py-2 w-full mb-4       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={sendCredit}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 rounded-md flex justify-center"
              >
                {loading ? (
                  <FiLoader className="animate-spin text-center" />
                ) : (
                  "Send Gift"
                )}
              </button>
            </div>
          </div>
          {toast3.show && (
            <div
              className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
                toast3.type === "success" ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {toast3.type === "success" ? (
                <HiOutlineCheckCircle className="w-6 h-6 mr-2" />
              ) : (
                <HiOutlineXCircle className="w-6 h-6 mr-2" />
              )}
              <span>{toast3.message}</span>
            </div>
          )}
        </Dialog>

        {/* Dialog for changing price */}
        <Dialog
          open={isChangePriceDialogOpen}
          onClose={() => setIsChangePriceDialogOpen(false)}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              ref={dialogRef}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg border border-black relative"
            >
              <button
                onClick={() => setIsChangePriceDialogOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
              <h2 className="text-xl font-bold mb-4">Change Credit Price</h2>
              <div className=" ">
                <label htmlFor="#id">Product ID</label>
                <input
                  id="id"
                  type="text"
                  value={productId}
                  disabled={EditCredit}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Product ID"
                  className={`border border-gray-300 rounded-md px-4 py-2 w-full mb-4     ${
                    EditCredit ? "bg-gray-300" : "bg-white"
                  }  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
                <button
                  onClick={(e) => setEditCredit(!EditCredit)}
                  className="absolute right-10 my-3 "
                >
                  {" "}
                  <HiOutlinePencil className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <label>Per Cerdit Price $$</label>
                <span className="absolute left-4 top-2/4 transform -translate-y-1/2 text-gray-500 my-1">
                  $
                </span>
                <input
                  type="number"
                  value={changePrice}
                  onChange={(e) => setChangePrice(e.target.value)}
                  placeholder="New Price"
                  className="border border-gray-300 rounded-md px-8 py-2 w-full mb-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <button
                onClick={handleConfirmChangePrice}
                className="w-full flex justify-center  bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 rounded-md"
              >
                {loading ? (
                  <FiLoader className="animate-spin text-center" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
          {toast2.show && (
            <div
              className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
                toast2.type === "success" ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {toast2.type === "success" ? (
                <HiOutlineCheckCircle className="w-6 h-6 mr-2" />
              ) : (
                <HiOutlineXCircle className="w-6 h-6 mr-2" />
              )}
              <span>{toast2.message}</span>
            </div>
          )}
        </Dialog>
      </div>
    </>
  );
};

export default AdminDashboard;
