
import React from "react";
import { useLocation } from "react-router-dom";

const PackagingSlip = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <div style={{ padding: 40 }}>No order data found.</div>;
  }


  const merchantKey =
    location.state?.merchantId ||
    (order.lineItemsByMerchant
      ? Object.keys(order.lineItemsByMerchant)[0]
      : null);


  let customer = {};
  let address = {};

  if (order.customer?.default_address) {
    customer = order.customer;
    address = order.customer.default_address;
  }
  else if (
    order.lineItemsByMerchant &&
    merchantKey &&
    order.lineItemsByMerchant[merchantKey]?.[0]?.customer?.[0]
  ) {
    customer = order.lineItemsByMerchant[merchantKey][0].customer[0];
    address = customer.default_address || {};
  }


  let lineItems = [];

  if (Array.isArray(order.lineItems)) {
    lineItems = order.lineItems;
  } else if (
    order.lineItemsByMerchant &&
    merchantKey &&
    Array.isArray(order.lineItemsByMerchant[merchantKey])
  ) {
    lineItems = order.lineItemsByMerchant[merchantKey];
  }

  return (
    <div style={styles.page} className="packing-slip">
      <div style={styles.header}>
        <h1 style={styles.logo}>AYDI ACTIVE</h1>

        <div style={styles.orderInfo}>
          <strong>
            Order #
            {order.shopifyOrderNo || order.name || order.serialNo || "N/A"}
          </strong>
          <div>
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-GB")
              : "N/A"}
          </div>
        </div>
      </div>

      <div style={styles.addressRow}>
        <div>
          <h4 style={styles.sectionTitle}>SHIP TO</h4>
          <p style={styles.text}>
            {address.first_name || ""} {address.last_name || ""}
            <br />
            {address.address1 || ""}
            <br />
            {address.city || ""} {address.province || ""} {address.zip || ""}
            <br />
            {address.country || ""}
          </p>
        </div>

        <div>
          <h4 style={styles.sectionTitle}>BILL TO</h4>
          <p style={styles.text}>
            {address.first_name || ""} {address.last_name || ""}
            <br />
            {address.address1 || ""}
            <br />
            {address.city || ""} {address.province || ""} {address.zip || ""}
            <br />
            {address.country || ""}
          </p>
        </div>
      </div>

      <hr />

      <div style={styles.itemsHeader}>
        <strong>ITEMS</strong>
        <strong>QUANTITY</strong>
      </div>

      {lineItems.map((item, i) => (
        <div key={i} style={styles.itemRow}>
          <div>
            <div>{item.name || item.title}</div>

            {item.variant_title && (
              <div style={styles.muted}>{item.variant_title}</div>
            )}

            <div style={styles.muted}>SKU: {item.sku || "N/A"}</div>
          </div>

          <div>
            {item.quantity} of {item.quantity}
          </div>
        </div>
      ))}

      <hr />

      <div style={styles.footer}>
        <p>Thank you for shopping with us!</p>

        <p>
          Aydi Active
          <br />
          PO Box 241, Doncaster Heights VIC 3109, Australia
          <br />
          contact@aydiactive.com
          <br />
          www.aydiactive.com
        </p>

        <button onClick={() => window.print()} style={styles.printBtn}>
          Print
        </button>
      </div>

      <style>
        {`
          @media print {
            .navbar,
            .topbar,
            header,
            nav {
              display: none !important;
            }

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

/* ================= STYLES ================= */
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
