// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { HiOutlineCheckCircle, HiOutlineXCircle, HiPlus } from "react-icons/hi";
// import { Link, useNavigate } from "react-router-dom";
// import UseFetchUserData from "../component/fetchUser";
// import { useAuthContext } from "../Hooks/useAuthContext";
// import { CreateCheckoutUrl } from "../component/Checkout";
// import { HiOutlineRefresh } from "react-icons/hi";
// import { jwtDecode } from "jwt-decode";
// import { MdModeEdit } from "react-icons/md";
// import { RxCross1 } from "react-icons/rx";

// const Inventory = () => {
//   let admin;

//   const isAdmin = () => {
//     const token = localStorage.getItem("usertoken");
//     if (token) {
//       const decoded = jwtDecode(token);
//       if (
//         (decoded.payLoad.isAdmin || decoded.payLoad.role === "DevAdmin") &&
//         decoded.exp * 1000 > Date.now()
//       ) {
//         return true;
//       }
//     }
//     return false;
//   };

//   admin = isAdmin();

//   const limit = 20;

//   const navigate = useNavigate();
//   const { userData, loading, error, variantId } = UseFetchUserData();
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchVal, setSearchVal] = useState("");
//   const [loadingId, setLoadingId] = useState(null);
//   const [message, setMessage] = useState("");
//   const { user } = useAuthContext();
//   const [showPromoFields, setShowPromoFields] = useState(false);

//   const [errorMessage, setErrorMessage] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [Loading, setLoading] = useState(false);
//   const [toast, setToast] = useState({ show: false, type: "", message: "" });
//   const [Price, setPrice] = useState();
//   let buyCreditUrl = "";
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(false);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showPromoPopup, setShowPromoPopup] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const toggleSelection = (productId) => {
//     setSelectedProducts((prevSelected) =>
//       prevSelected.includes(productId)
//         ? prevSelected.filter((id) => id !== productId)
//         : [...prevSelected, productId]
//     );
//   };

//   const showToast = (type, message) => {
//     setToast({ show: true, type, message });
//     setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
//   };

//   const fetchProductData = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("usertoken");
//     const isAdmin = () => {
//       if (token) {
//         const decoded = jwtDecode(token);
//         console.log("token decodeddd", decoded);
//         if (
//           (decoded.payLoad.isAdmin || decoded.payLoad.role === "Dev Admin") &&
//           decoded.exp * 1000 > Date.now()
//         ) {
//           return true;
//         }
//       }
//       return false;
//     };

//     const admin = isAdmin();

//     try {
//       const id = localStorage.getItem("userid");
//       const response = await fetch(
//         admin
//           ? `https://multi-vendor-marketplace.vercel.app/product/getAllData/?page=${page}&limit=${limit}`
//           : `https://multi-vendor-marketplace.vercel.app/product/getProduct/${id}/?page=${page}&limit=${limit}`,
//         { method: "GET" }
//       );

//       if (response.ok) {
//         const data = await response.json();

//         const sortedProducts = data.products.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );

//         setProducts(sortedProducts);
//         setFilteredProducts((prev) => [
//           ...prev,
//           ...sortedProducts.filter(
//             (newProduct) =>
//               !prev.some((prevProduct) => prevProduct.id === newProduct.id)
//           ),
//         ]);

//         setHasMore(page < data.totalPages);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     let filtered =
//       searchVal === ""
//         ? products
//         : products.filter(
//             (product) =>
//               product.title.includes(searchVal) ||
//               product.product_type.includes(searchVal)
//           );
//     setFilteredProducts(filtered);
//   };

//   useEffect(() => {
//     handleSearch();
//   }, [searchVal]);

//   useEffect(() => {
//     fetchProductData();
//   }, []);

//   const handleScroll = async () => {
//     if (
//       window.innerHeight + document.documentElement.scrollTop + 400 >=
//       document.documentElement.scrollHeight
//     ) {
//       if (hasMore && !loading) {
//         setPage((prevPage) => prevPage + 1);
//       }
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [handleScroll]);

//   return user ? (
//     <main className="w-full p-4 md:p-8">
//       <div className="flex flex-col md:flex-row md:justify-between items-start border-b-2 border-gray-200 pb-4">
//         <div className="flex-1">
//           <h1 className="text-2xl font-semibold mb-1">Inventory</h1>
//           <p className="text-gray-600">
//             Here are your total Collection in Inventory.
//           </p>
//           <div className="w-2/4 max-sm:w-full mt-2">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchVal}
//               onChange={(e) => setSearchVal(e.target.value)}
//               className="md:w-2/4 p-2 max-sm:w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//         <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
//           <Link
//             to="/add-product"
//             className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
//           >
//             <HiPlus className="w-5 h-5" />
//             <span>Add Products</span>
//           </Link>
//         </div>

//         {toast.show && (
//           <div
//             className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg transition-all ${
//               toast.type === "success" ? "bg-green-500" : "bg-red-500"
//             } text-white`}
//           >
//             {toast.type === "success" ? (
//               <HiOutlineCheckCircle className="w-6 h-6 mr-2" />
//             ) : (
//               <HiOutlineXCircle className="w-6 h-6 mr-2" />
//             )}
//             <span>{toast.message}</span>
//           </div>
//         )}
//       </div>
//       {selectedProducts.length > 0 && (
//         <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
//           <div className="flex gap-2 items-center w-2/4 max-sm:w-full md:ml-auto justify-end">
//             <button
//               onClick={() => setShowPopup(true)}
//               className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
//             >
//               Update Inventory
//             </button>
//           </div>
//         </div>
//       )}
//       {Loading ? (
//         <div className="flex justify-center items-center py-10">
//           <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
//           loading...
//         </div>
//       ) : (
//         <div className="p-4">
//           {filteredProducts.length === 0 ? (
//             <div className="text-center py-10 text-gray-500">
//               <h2>No products available.</h2>
//             </div>
//           ) : (
//             <div className=" max-sm:overflow-auto border rounded-lg">
//               <table className="w-full border-collapse bg-white">
//                 <thead className="bg-gray-100 text-left text-gray-600 text-sm">
//                   <tr>
//                     <th className="p-3">Action</th>
//                     <th className="p-3">Status</th>
//                     <th className="p-3">Sku</th>
//                     <th className="p-3">Price</th>
//                     <th className="p-3">Compare_at_price</th>
//                     <th className="p-3">Promo_price</th>
//                     <th className="p-3">Inventory</th>
//                     <th className="p-3">Update</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filteredProducts.map((product, index) => (
//                     <tr key={product._id} className="border-b hover:bg-gray-50">
//                       <td className="p-3">
//                         <input
//                           type="checkbox"
//                           className="w-4 h-4 cursor-pointer"
//                           checked={selectedProducts.includes(product._id)}
//                           onChange={() => toggleSelection(product._id)}
//                         />
//                       </td>
//                       <td className="p-3">
//                         {" "}
//                         <div
//                           className={`w-2 h-2 rounded-full ${
//                             product.status === "active"
//                               ? "bg-green-500"
//                               : "bg-red-500"
//                           }`}
//                           title={product.status}
//                         />
//                       </td>
//                       <td className="p-3"> {product.variants[0].sku}</td>
//                       <td className="p-3">
//                         <div className="relative w-32">
//                           <input
//                             type="text"
//                             value={product.variants[0].price || "N/A"}
//                             readOnly={!product.variants[0]._editablePrice}
//                             onChange={(e) => {
//                               const updated = [...filteredProducts];
//                               const index = updated.findIndex(
//                                 (p) => p._id === product._id
//                               );
//                               if (index !== -1) {
//                                 updated[index].variants[0].price =
//                                   e.target.value;
//                                 setFilteredProducts(updated);
//                               }
//                             }}
//                             className={`w-full text-sm pr-6 pl-2 py-1 rounde-md border border-gray-300 transition-all duration-200 ${
//                               product.variants[0]._editablePrice
//                                 ? "bg-white text-black rounded-md"
//                                 : "bg-gray-200 text-gray-200 blur-sm cursor-not-allowed"
//                             }`}
//                           />
//                           <span
//                             onClick={() => {
//                               const updated = [...filteredProducts];
//                               const index = updated.findIndex(
//                                 (p) => p._id === product._id
//                               );
//                               if (index !== -1) {
//                                 const currentEditable =
//                                   updated[index].variants[0]._editablePrice ||
//                                   false;
//                                 updated[index].variants[0]._editablePrice =
//                                   !currentEditable;
//                                 setFilteredProducts(updated);
//                               }
//                             }}
//                             className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-blue-500 text-sm cursor-pointer"
//                             title={
//                               product.variants[0]._editablePrice
//                                 ? "Cancel Edit"
//                                 : "Edit"
//                             }
//                           >
//                             {product.variants[0]._editablePrice ? (
//                               <RxCross1 />
//                             ) : (
//                               <MdModeEdit />
//                             )}
//                           </span>
//                         </div>
//                       </td>{" "}
//                       <td className="p-3">
//                         <div className="relative w-32">
//                           <input
//                             type="text"
//                             value={
//                               product.variants[0].compare_at_price || "N/A"
//                             }
//                             readOnly={!product.variants[0]._editableCompare}
//                             onChange={(e) => {
//                               const updated = [...filteredProducts];
//                               const index = updated.findIndex(
//                                 (p) => p._id === product._id
//                               );
//                               if (index !== -1) {
//                                 updated[index].variants[0].compare_at_price =
//                                   e.target.value;
//                                 setFilteredProducts(updated);
//                               }
//                             }}
//                             className={`w-full text-sm pr-6 pl-2 py-1 rounde-md border border-gray-300 transition-all duration-200 ${
//                               product.variants[0]._editableCompare
//                                 ? "bg-white text-black rounded-md"
//                                 : "bg-gray-200 text-gray-200 blur-sm cursor-not-allowed"
//                             }`}
//                           />
//                           <span
//                             onClick={() => {
//                               const updated = [...filteredProducts];
//                               const index = updated.findIndex(
//                                 (p) => p._id === product._id
//                               );
//                               if (index !== -1) {
//                                 const currentEditable =
//                                   updated[index].variants[0]._editableCompare ||
//                                   false;
//                                 updated[index].variants[0]._editableCompare =
//                                   !currentEditable;
//                                 setFilteredProducts(updated);
//                               }
//                             }}
//                             className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-blue-500 text-sm cursor-pointer"
//                             title={
//                               product.variants[0]._editableCompare
//                                 ? "Cancel Edit"
//                                 : "Edit"
//                             }
//                           >
//                             {product.variants[0]._editableCompare ? (
//                               <RxCross1 />
//                             ) : (
//                               <MdModeEdit />
//                             )}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="p-3">
//                         <div className="relative w-32">
//                           <input
//                             type="text"
//                             value={product.promo_price || "N/A"}
//                             readOnly={!product._editable}
//                             onChange={(e) => {
//                               const updated = [...filteredProducts];
//                               const index = updated.findIndex(
//                                 (p) => p._id === product._id
//                               );
//                               if (index !== -1) {
//                                 updated[index].promo_price = e.target.value;
//                                 setFilteredProducts(updated);
//                               }
//                             }}
//                             className={`w-full text-sm pr-6 pl-2 py-1 rounded-md border border-gray-300 transition-all duration-200
//                             ${
//                               product._editable
//                                 ? "bg-white text-black"
//                                 : "bg-gray-200 text-gray-200 blur-sm cursor-not-allowed rounded-md"
//                             }`}
//                           />

//                           <span
//                             onClick={() => {
//                               const updated = [...filteredProducts];
//                               const index = updated.findIndex(
//                                 (p) => p._id === product._id
//                               );
//                               if (index !== -1) {
//                                 updated[index]._editable =
//                                   !updated[index]._editable;
//                                 setFilteredProducts(updated);
//                               }
//                             }}
//                             className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-blue-500 text-sm cursor-pointer"
//                             title={product._editable ? "Cancel Edit" : "Edit"}
//                           >
//                             {product._editable ? <RxCross1 /> : <MdModeEdit />}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="p-3">
//                         <div className="relative w-32">
//                           <input
//                             type="text"
//                             value={
//                               product.variants[0].inventory_quantity || "N/A"
//                             }
//                             readOnly={!product.variants[0]._editableQuantity}
//                             onChange={(e) => {
//                               const updated = [...filteredProducts];
//                               const index = updated.findIndex(
//                                 (p) => p._id === product._id
//                               );
//                               if (index !== -1) {
//                                 updated[index].variants[0]._editableQuantity =
//                                   e.target.value;
//                                 setFilteredProducts(updated);
//                               }
//                             }}
//                             className={`w-full text-sm pr-6 pl-2 py-1 rounde-md border border-gray-300 transition-all duration-200 ${
//                               product.variants[0]._editableQuantity
//                                 ? "bg-white text-black rounded-md"
//                                 : "bg-gray-200 text-gray-200 blur-sm cursor-not-allowed"
//                             }`}
//                           />
//                           <span
//                             onClick={() => {
//                               const updated = [...filteredProducts];
//                               const index = updated.findIndex(
//                                 (p) => p._id === product._id
//                               );
//                               if (index !== -1) {
//                                 const currentEditable =
//                                   updated[index].variants[0]
//                                     ._editableQuantity || false;
//                                 updated[index].variants[0]._editableQuantity =
//                                   !currentEditable;
//                                 setFilteredProducts(updated);
//                               }
//                             }}
//                             className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-blue-500 text-sm cursor-pointer"
//                             title={
//                               product.variants[0]._editableQuantity
//                                 ? "Cancel Edit"
//                                 : "Edit"
//                             }
//                           >
//                             {product.variants[0]._editableQuantity ? (
//                               <RxCross1 />
//                             ) : (
//                               <MdModeEdit />
//                             )}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="p-3 text-blue-600 hover:underline cursor-pointer">
//                         {" "}
//                         Update
//                       </td>
//                       {admin && `#${product.shopifyId}`}
//                       {/* <td className="p-3"> {product.email} </td> */}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//       {showPopup && (
//         <div onClick={() => setShowPopup(false)} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div onClick={(e)=>e.stopPropagation()} className="bg-white w-[95%] max-w-lg rounded-xl shadow-xl p-6 relative animate-zoomIn">
//             <button
//               onClick={() => setShowPopup(false)}
//               className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl"
//               title="Close"
//             >
//               ✕
//             </button>

//             <h2 className="text-xl border-b border-gray-300 p-1 font-semibold mb-4 text-gray-800">
//               Update Product Inventory
//             </h2>

//             <form className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   placeholder="Enter price"
//                   className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 no-spinner"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Quantity
//                 </label>
//                 <input
//                   type="number"
//                   placeholder="Enter quantity"
//                   className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 no-spinner"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Compare at Price
//                 </label>
//                 <input
//                   type="number"
//                   placeholder="Enter compare at price"
//                   className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 no-spinner"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-700">
//                   Add Promo Price?
//                 </label>
//                 <select
//                   className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   onChange={(e) => setShowPromoFields(e.target.value !== "")}
//                 >
//                   <option value="">No Promo</option>
//                   <option value="percentage">Percentage</option>
//                   <option value="fixed">Fixed Price</option>
//                 </select>
//               </div>

//               {showPromoFields && (
//                 <div className="grid grid-cols-1 gap-4 mt-2">
//                   <div>
//                     <label className="text-sm font-medium text-gray-700">
//                       Promo Price
//                     </label>
//                     <input
//                       type="number"
//                       placeholder="Enter promo price"
//                       className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 no-spinner"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-700">
//                         Start Date
//                       </label>
//                       <input
//                         type="date"
//                         className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium text-gray-700">
//                         End Date
//                       </label>
//                       <input
//                         type="date"
//                         className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-700">
//                         Start Time
//                       </label>
//                       <input
//                         type="time"
//                         className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
//                       />
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium text-gray-700">
//                         End Time
//                       </label>
//                       <input
//                         type="time"
//                         className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 className="mt-6 w-full bg-gradient-to-r bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
//               >
//                 Update
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </main>
//   ) : null;
// };

// export default Inventory;
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineCheckCircle, HiOutlineXCircle, HiPlus } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import UseFetchUserData from "../component/fetchUser";
import { useAuthContext } from "../Hooks/useAuthContext";
import { CreateCheckoutUrl } from "../component/Checkout";
import { HiOutlineRefresh } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import { MdModeEdit } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";

const Inventory = () => {
  let admin;

  const isAdmin = () => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      const decoded = jwtDecode(token);
      if (
        (decoded.payLoad.isAdmin || decoded.payLoad.role === "DevAdmin") &&
        decoded.exp * 1000 > Date.now()
      ) {
        return true;
      }
    }
    return false;
  };

  admin = isAdmin();

  const limit = 20;

  const navigate = useNavigate();
  const { userData, loading, error, variantId } = UseFetchUserData();
  const [products, setProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useAuthContext();
  const [showPromoFields, setShowPromoFields] = useState(false);
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [Loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [activeTab, setActiveTab] = useState("price");

  let buyCreditUrl = "";
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const toggleSelection = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProductData = async () => {
    setLoading(true);
    const token = localStorage.getItem("usertoken");
    const isAdmin = () => {
      if (token) {
        const decoded = jwtDecode(token);
        console.log("token decodeddd", decoded);
        if (
          (decoded.payLoad.isAdmin || decoded.payLoad.role === "Dev Admin") &&
          decoded.exp * 1000 > Date.now()
        ) {
          return true;
        }
      }
      return false;
    };

    const admin = isAdmin();

    try {
      const id = localStorage.getItem("userid");
      const response = await fetch(
        admin
          ? `https://multi-vendor-marketplace.vercel.app/product/getProduct/${id}/?page=${page}&limit=${limit}`
          : `https://multi-vendor-marketplace.vercel.app/product/getAllData/?page=${page}&limit=${limit}`,
        { method: "GET" }
      );

      if (response.ok) {
        const data = await response.json();

        const sortedProducts = data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProducts(sortedProducts);
        setFilteredProducts((prev) => [
          ...prev,
          ...sortedProducts.filter(
            (newProduct) =>
              !prev.some((prevProduct) => prevProduct.id === newProduct.id)
          ),
        ]);

        setHasMore(page < data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered =
      searchVal === ""
        ? products
        : products.filter(
            (product) =>
              product.title.includes(searchVal) ||
              product.product_type.includes(searchVal)
          );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchVal]);

  useEffect(() => {
    fetchProductData();
  }, []);

  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 400 >=
      document.documentElement.scrollHeight
    ) {
      if (hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userid");
  
    if (selectedProducts.length === 0) {
      alert("Please select at least one product.");
      return;
    }
  
    const payload =
      activeTab === "price"
        ? {
            price,
            compareAtPrice,
            userId,
          }
        : {
            quantity,
            userId,
          };
  
    const endpoint =
      activeTab === "price"
        ? "updateInventoryPrice"
        : "updateInventoryQuantity";
  
    try {
      const updatePromises = selectedProducts.map(async (productId) => {
        const response = await fetch(
          ` https://multi-vendor-marketplace.vercel.app/product/${endpoint}/${productId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const result = await response.json();
  
        if (!response.ok) {
          console.error(`Error updating product ${productId}:`, result.message);
        }
  
        return { productId, success: response.ok, message: result.message };
      });
  
      const results = await Promise.all(updatePromises);
  
      const failedUpdates = results.filter((r) => !r.success);
      if (failedUpdates.length > 0) {
        alert(
          `${failedUpdates.length} product(s) failed to update.\n` +
            failedUpdates.map((r) => `• ${r.productId}: ${r.message}`).join("\n")
        );
      } else {
        alert("All selected products updated successfully.");
      }
  
      setShowPopup(false);
      fetchProductData();
    } catch (error) {
      console.error("Error during product update:", error);
      alert("Unexpected error occurred while updating products.");
    }
  };
  

  const handlePriceUpdate = async (productId) => {
    const userId = localStorage.getItem("userid");

    const productToUpdate = filteredProducts.find((p) => p._id === productId);
    if (!productToUpdate) return alert("Product not found.");

    const payload = {
      price: productToUpdate.variants[0].price,
      compareAtPrice: productToUpdate.variants[0].compare_at_price,
      userId,
    };

    try {
      const response = await fetch(
        `https://multi-vendor-marketplace.vercel.app/product/updateInventoryPrice/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(`Price updated for ${productToUpdate.title}`);
        fetchProductData();
      } else {
        alert(result.message || "Price update failed");
      }
    } catch (error) {
      console.error("Error updating price:", error);
      alert("An error occurred while updating price.");
    }
  };

  const handleQuantityUpdate = async (productId) => {
    const userId = localStorage.getItem("userid");

    const productToUpdate = filteredProducts.find((p) => p._id === productId);
    if (!productToUpdate) return alert("Product not found.");

    const payload = {
      quantity: productToUpdate.variants[0].inventory_quantity,
      userId,
    };

    try {
      const response = await fetch(
        `https://multi-vendor-marketplace.vercel.app/product/updateInventoryQuantity/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(`Quantity updated for ${productToUpdate.title}`);
        fetchProductData();
      } else {
        alert(result.message || "Quantity update failed");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("An error occurred while updating quantity.");
    }
  };

  const [popupProductId, setPopupProductId] = useState(null);

  return user ? (
    <main className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between items-start border-gray-200 pb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">Inventory</h1>
          <p className="text-gray-600">
            Here are your total Collection in Inventory.
          </p>
          <div className="w-2/4 max-sm:w-full mt-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="md:w-2/4 p-2 max-sm:w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
          <Link
            to="/add-product"
            className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
          >
            <HiPlus className="w-5 h-5" />
            <span>Add Products</span>
          </Link>
        </div>

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
      </div>
      <div className="flex items-center space-x-6 border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("price")}
          className={`pb-2 border-b-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === "price"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
        >
          Update Price
        </button>
        <button
          onClick={() => setActiveTab("quantity")}
          className={`pb-2 border-b-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === "quantity"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-blue-600"
          }`}
        >
          Update Quantity
        </button>
      </div>
      {selectedProducts.length > 0 && (
        <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 space-y-4 md:space-y-0">
          <div className="flex gap-2 items-center w-2/4 max-sm:w-full md:ml-auto justify-end">
            <button
              onClick={() => {
                const selectedId = selectedProducts[0];
                const product = filteredProducts.find(
                  (p) => p._id === selectedId
                );

                if (product) {
                  setSelectedProduct(product);
                  setPrice(product.variants[0].price || "");
                  setCompareAtPrice(product.variants[0].compare_at_price || "");
                  setQuantity(product.variants[0].inventory_quantity || "");
                  setShowPopup(true);
                }
              }}
              className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out flex items-center space-x-2"
            >
              Update Inventory
            </button>
          </div>
        </div>
      )}

      {activeTab === "price" &&
        (Loading ? (
          <div className="flex justify-center items-center py-10">
            <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
            loading...
          </div>
        ) : (
          <div className="p-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <h2>No products available.</h2>
              </div>
            ) : (
              <div className=" max-sm:overflow-auto border rounded-lg">
                <table className="w-full border-collapse bg-white">
                  <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                    <tr>
                      <th className="p-3">Action</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Sku</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Compare_at_price</th>
                      <th className="p-3">Inventory</th>
                      <th className="p-3">Update</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr
                        key={product._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 cursor-pointer"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => toggleSelection(product._id)}
                          />
                        </td>
                        <td className="p-3">
                          {" "}
                          <div
                            className={`w-2 h-2 rounded-full ${
                              product.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                            title={product.status}
                          />
                        </td>
                        <td className="p-3"> {product.variants[0].sku}</td>
                        <td className="p-3">
                          <div className="relative w-32">
                            <input
                              type="text"
                              value={product.variants[0].price || ""}
                              onChange={(e) => {
                                const updated = [...filteredProducts];
                                const index = updated.findIndex(
                                  (p) => p._id === product._id
                                );
                                if (index !== -1) {
                                  updated[index].variants[0].price =
                                    e.target.value;
                                  setFilteredProducts(updated);
                                }
                              }}
                              className="w-full text-sm px-2 py-1 border border-gray-300 rounded-md bg-white text-black"
                            />
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="relative w-32">
                            <input
                              type="text"
                              value={product.variants[0].compare_at_price || ""}
                              onChange={(e) => {
                                const updated = [...filteredProducts];
                                const index = updated.findIndex(
                                  (p) => p._id === product._id
                                );
                                if (index !== -1) {
                                  updated[index].variants[0].compare_at_price =
                                    e.target.value;
                                  setFilteredProducts(updated);
                                }
                              }}
                              className="w-full text-sm px-2 py-1 border border-gray-300 rounded-md bg-white text-black"
                            />
                          </div>
                        </td>

                        <td className="p-3">
                          {product.variants[0].inventory_quantity}
                        </td>
                        <td
                          onClick={() => {
                            setPopupProductId(product._id);
                            setIsPopupOpen(true);
                          }}
                          className="p-3 text-blue-600 hover:underline cursor-pointer"
                        >
                          Update
                        </td>
                        {admin && `#${product.shopifyId}`}
                        {/* <td className="p-3"> {product.email} </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

      {activeTab === "quantity" &&
        (Loading ? (
          <div className="flex justify-center items-center py-10">
            <HiOutlineRefresh className="animate-spin text-xl text-gray-500" />
            loading...
          </div>
        ) : (
          <div className="p-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <h2>No products available.</h2>
              </div>
            ) : (
              <div className=" max-sm:overflow-auto border rounded-lg">
                <table className="w-full border-collapse bg-white">
                  <thead className="bg-gray-100 text-left text-gray-600 text-sm">
                    <tr>
                      <th className="p-3">Action</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Sku</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Compare_at_price</th>
                      <th className="p-3">Inventory</th>
                      <th className="p-3">Update</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr
                        key={product._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 cursor-pointer"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => toggleSelection(product._id)}
                          />
                        </td>
                        <td className="p-3">
                          {" "}
                          <div
                            className={`w-2 h-2 rounded-full ${
                              product.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                            title={product.status}
                          />
                        </td>
                        <td className="p-3"> {product.variants[0].sku}</td>
                        <td className="p-3">
                          {product.variants[0].price}
                        </td>{" "}
                        <td className="p-3">
                          {product.variants[0].compare_at_price}
                        </td>
                        <td className="p-3">
                          <div className="relative w-32">
                            <input
                              type="text"
                              value={
                                product.variants[0].inventory_quantity || "0.00"
                              }
                              onChange={(e) => {
                                const updated = [...filteredProducts];
                                const index = updated.findIndex(
                                  (p) => p._id === product._id
                                );
                                if (index !== -1) {
                                  updated[
                                    index
                                  ].variants[0].inventory_quantity =
                                    e.target.value;
                                  setFilteredProducts(updated);
                                }
                              }}
                              className="w-full text-sm px-2 py-1 border border-gray-300 rounded-md bg-white text-black"
                            />
                          </div>
                        </td>
                        <td
                          onClick={() => {
                            setPopupProductId(product._id);
                            setIsPopupOpen(true);
                          }}
                          className="p-3 text-blue-600 hover:underline cursor-pointer"
                        >
                          Update
                        </td>
                        {admin && `#${product.shopifyId}`}
                        {/* <td className="p-3"> {product.email} </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[95%] max-w-lg rounded-xl shadow-xl p-6 relative animate-zoomIn"
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl"
              title="Close"
            >
              ✕
            </button>

            <h2 className="text-xl border-b border-gray-300 p-1 font-semibold mb-4 text-gray-800">
              Update Product Inventory
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* SKU - always read-only */}
              <div>
                <label className="text-sm font-medium text-gray-700">SKU</label>
                <input
                  type="text"
                  value={selectedProduct?.variants?.[0]?.sku || ""}
                  readOnly
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-700"
                />
              </div>

              {/* Price - editable only on price tab */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  readOnly={activeTab !== "price"}
                  className={`mt-1 w-full border border-gray-300 rounded-md px-3 py-2 no-spinner ${
                    activeTab !== "price"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-white"
                  }`}
                />
              </div>

              {/* Compare at Price - editable only on price tab */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Compare at Price
                </label>
                <input
                  type="number"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="Enter compare at price"
                  readOnly={activeTab !== "price"}
                  className={`mt-1 w-full border border-gray-300 rounded-md px-3 py-2 no-spinner ${
                    activeTab !== "price"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-white"
                  }`}
                />
              </div>

              {/* Quantity - editable only on quantity tab */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  readOnly={activeTab !== "quantity"}
                  className={`mt-1 w-full border border-gray-300 rounded-md px-3 py-2 ${
                    activeTab !== "quantity"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-white"
                  }`}
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
      {isPopupOpen && (
        <div
          onClick={() => setIsPopupOpen(false)}
          className="fixed inset-0 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeInUp p-8 relative border border-gray-200"
          >
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
            >
              ✕
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Approval
              </h2>
              <p className="text-gray-600">
                Are you sure you want to update inventory?
              </p>

              <button
                onClick={() => {
                  if (activeTab === "quantity") {
                    handleQuantityUpdate(popupProductId);
                  } else if (activeTab === "price") {
                    handlePriceUpdate(popupProductId);
                  }
                  setIsPopupOpen(false);
                }}
                className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-full hover:opacity-90 transition"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  ) : null;
};

export default Inventory;
