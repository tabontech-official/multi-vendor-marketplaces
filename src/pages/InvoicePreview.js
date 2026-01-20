// import React from "react";
// import { useLocation } from "react-router-dom";

// const InvoicePreview = () => {
//   const location = useLocation();
//   const order = location.state?.order;

//   if (!order) {
//     return (
//       <div className="p-10 text-center text-red-500">No order data found.</div>
//     );
//   }

//   const customer = order.customer || {};
//   const address = customer.default_address || {};
//   const lineItems = order.lineItems || [];

//   return (
//     <div
//       className="invoice-page"
//       style={{
//         fontFamily: "Arial, sans-serif",
//         padding: "40px",
//         maxWidth: "800px",
//         margin: "0 auto",
//         color: "#222",
//         backgroundColor: "white",
//       }}
//     >
//       {/* HEADER */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "40px",
//         }}
//       >
//         <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>AYDI ACTIVE</h1>
//         <div style={{ textAlign: "right" }}>
//           <p style={{ margin: 0, fontSize: "12px" }}>
//             Order #{order.shopifyOrderNo || "N/A"}
//           </p>
//           <p style={{ margin: 0, fontSize: "12px" }}>
//             {new Date(order.createdAt).toLocaleDateString("en-GB", {
//               day: "2-digit",
//               month: "long",
//               year: "numeric",
//             })}
//           </p>
//         </div>
//       </div>

//       {/* ADDRESS SECTION */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginBottom: "30px",
//         }}
//       >
//         <div>
//           <h3 style={{ fontSize: "14px", marginBottom: "5px" }}>SHIP TO</h3>
//           <p style={{ fontSize: "12px", lineHeight: "1.4" }}>
//             {address.first_name || customer.first_name || ""}{" "}
//             {address.last_name || customer.last_name || ""}
//             <br />
//             {address.address1 || ""}
//             <br />
//             {address.city || ""} {address.province || ""} {address.zip || ""}
//             <br />
//             {address.country || ""}
//           </p>
//         </div>

//         <div>
//           <h3 style={{ fontSize: "14px", marginBottom: "5px" }}>BILL TO</h3>
//           <p style={{ fontSize: "12px", lineHeight: "1.4" }}>
//             {address.first_name || customer.first_name || ""}{" "}
//             {address.last_name || customer.last_name || ""}
//             <br />
//             {address.address1 || ""}
//             <br />
//             {address.city || ""} {address.province || ""} {address.zip || ""}
//             <br />
//             {address.country || ""}
//           </p>
//         </div>
//       </div>

//       {/* LINE ITEMS */}
//       <table
//         style={{
//           width: "100%",
//           borderCollapse: "collapse",
//           marginBottom: "30px",
//         }}
//       >
//         <thead>
//           <tr style={{ background: "#f4f4f4" }}>
//             <th
//               style={{
//                 textAlign: "left",
//                 padding: "8px",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               IMAGE
//             </th>
//             <th
//               style={{
//                 textAlign: "left",
//                 padding: "8px",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               PRODUCT
//             </th>
//             <th
//               style={{
//                 textAlign: "right",
//                 padding: "8px",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               QUANTITY
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {lineItems.map((item, index) => (
//             <tr key={index}>
//               <td style={{ padding: "8px" }}>
//                 {item.image?.src ? (
//                   <img
//                     src={item.image.src}
//                     alt={item.name}
//                     style={{
//                       width: "60px",
//                       height: "60px",
//                       objectFit: "contain",
//                       borderRadius: "4px",
//                     }}
//                   />
//                 ) : (
//                   <span style={{ fontSize: "12px", color: "#777" }}>
//                     No image
//                   </span>
//                 )}
//               </td>
//               <td style={{ padding: "8px", fontSize: "12px" }}>{item.name}</td>
//               <td
//                 style={{
//                   padding: "8px",
//                   textAlign: "right",
//                   fontSize: "12px",
//                 }}
//               >
//                 {item.quantity || 1}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* FOOTER */}
//       <div style={{ textAlign: "center", fontSize: "12px", marginTop: "40px" }}>
//         <p>Thank you for shopping with us!</p>
//         <p>
//           Aydi Active <br />
//           PO Box 241, Doncaster Heights VIC 3109, Australia <br />
//           contact@aydiactive.com | www.aydiactive.com
//         </p>
//         <button
//           onClick={() => window.print()}
//           style={{
//             marginTop: "20px",
//             padding: "8px 16px",
//             backgroundColor: "black",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           🖨️ Print Invoice
//         </button>
//       </div>

//       {/* ✅ Print-only CSS */}
//       <style>
//         {`
//           @media print {
//             body * {
//               visibility: hidden !important;
//             }
//             .invoice-page, .invoice-page * {
//               visibility: visible !important;
//             }
//             .invoice-page {
//               position: absolute;
//               left: 0;
//               top: 0;
//               width: 100%;
//               background: white;
//             }
//             button {
//               display: none !important;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default InvoicePreview;
import React from "react";
import { useLocation } from "react-router-dom";

const PackagingSlip = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <div style={{ padding: 40 }}>No order data found.</div>;
  }

  const customer = order.customer || {};
  const address = customer.default_address || {};
  const lineItems = order.lineItems || [];

  return (
    <div style={styles.page} className="packing-slip">
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.logo}>AYDI ACTIVE</h1>

        <div style={styles.orderInfo}>
          <div><strong>Order #{order.shopifyOrderNo}</strong></div>
          <div>{new Date(order.createdAt).toLocaleDateString("en-GB")}</div>
        </div>
      </div>

      {/* ADDRESSES */}
      <div style={styles.addressRow}>
        <div>
          <h4 style={styles.sectionTitle}>SHIP TO</h4>
          <p style={styles.text}>
            {address.first_name} {address.last_name}<br />
            {address.address1}<br />
            {address.city} {address.province} {address.zip}<br />
            {address.country}
          </p>
        </div>

        <div>
          <h4 style={styles.sectionTitle}>BILL TO</h4>
          <p style={styles.text}>
            {address.first_name} {address.last_name}<br />
            {address.address1}<br />
            {address.city} {address.province} {address.zip}<br />
            {address.country}
          </p>
        </div>
      </div>

      <hr />

      {/* ITEMS */}
      <div style={styles.itemsHeader}>
        <strong>ITEMS</strong>
        <strong>QUANTITY</strong>
      </div>

      {lineItems.map((item, i) => (
        <div key={i} style={styles.itemRow}>
          <div>
            <div>{item.name}</div>
            {item.variant_title && (
              <div style={styles.muted}>{item.variant_title}</div>
            )}
            <div style={styles.muted}>{item.sku}</div>
          </div>

          <div>{item.quantity} of {item.quantity}</div>
        </div>
      ))}

      <hr />

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>Thank you for shopping with us!</p>

        <p>
          Aydi Active<br />
          PO Box 241, Doncaster Heights VIC 3109, Australia<br />
          contact@aydiactive.com<br />
          www.aydiactive.com
        </p>

        <button onClick={() => window.print()} style={styles.printBtn}>
          Print
        </button>
      </div>

      {/* PRINT */}
      <style>
{`
  @media print {

    /* NAVBAR HIDE */
    .navbar,
    .topbar,
    header,
    nav {
      display: none !important;
    }

    /* Sirf packing slip visible */
    body * {
      visibility: hidden;
    }

    .packing-slip,
    .packing-slip * {
      visibility: visible;
    }

    .packing-slip {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }

    button {
      display: none !important;
    }
  }
`}
</style>

    </div>
  );
};

const styles = {
  page: {
    maxWidth: 800,
    margin: "auto",
    padding: 40,
    fontFamily: "Arial, sans-serif",
    color: "#000",
    background: "#fff",
    fontSize: 12,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: {
    fontSize: 22,
    margin: 0,
  },
  orderInfo: {
    textAlign: "right",
  },
  addressRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 6,
  },
  text: {
    lineHeight: 1.5,
  },
  itemsHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
  },
  muted: {
    color: "#555",
    fontSize: 11,
  },
  footer: {
    marginTop: 40,
    textAlign: "center",
  },
  printBtn: {
    marginTop: 20,
    padding: "8px 16px",
    background: "#000",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default PackagingSlip;
