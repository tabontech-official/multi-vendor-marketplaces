import React from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

const PackagingSlip = () => {
  const location = useLocation();
  const order = location.state?.order;
  const navigate = useNavigate();

  if (!order) {
    return <div style={{ padding: 40 }}>No order data found.</div>;
  }

  /* ================= CUSTOMER ================= */
  const customer = order.customers || order.customer || {};

  /* ================= SHIPPING ADDRESS ================= */
  const shipping = order.shipping_address?.address1
    ? order.shipping_address
    : customer.default_address || {};

  /* ================= BILLING ADDRESS ================= */
  const billing = order.billing_address?.address1
    ? order.billing_address
    : customer.default_address || {};

  /* ================= LINE ITEMS ================= */
  const lineItems = Array.isArray(order.products) ? order.products : [];

  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-GB")
    : "N/A";

  return (
    <div style={styles.page} className="packing-slip">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex mb-5 items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition shadow-sm"
      >
        <HiArrowLeft className="text-lg" />
        Back
      </button>
      <div style={styles.header}>
        <h1 style={styles.logo}>AYDI ACTIVE</h1>

        <div style={styles.orderInfo}>
          <strong>
            Packing Slip – Order #
            {order.shopifyOrderNo || order.serialNumber || "N/A"}
          </strong>
          <div>{formattedDate}</div>
        </div>
      </div>

      <div style={styles.addressRow}>
        <div>
          <h4 style={styles.sectionTitle}>SHIP TO</h4>
          <p style={styles.text}>
            {customer.first_name} {customer.last_name}
            <br />
            {shipping.address1}
            {shipping.address2 && <>, {shipping.address2}</>}
            <br />
            {shipping.city} {shipping.province} {shipping.zip}
            <br />
            {shipping.country}
          </p>
        </div>

        <div>
          <h4 style={styles.sectionTitle}>BILL TO</h4>
          <p style={styles.text}>
            {customer.first_name} {customer.last_name}
            <br />
            {billing.address1}
            {billing.address2 && <>, {billing.address2}</>}
            <br />
            {billing.city} {billing.province} {billing.zip}
            <br />
            {billing.country}
          </p>
        </div>
      </div>

      <hr />

      <div style={styles.itemsHeader}>
        <span style={styles.sectionTitle}>ITEM</span>
        <span style={styles.sectionTitle}>QTY</span>
      </div>

      {lineItems.map((item, i) => (
        <div key={i} style={styles.itemRow}>
          <div>
            <div>{item.product?.title || "N/A"}</div>

            {item.variant?.title && (
              <div style={styles.muted}>{item.variant.title}</div>
            )}

            <div style={styles.muted}>SKU: {item.variant?.sku || "N/A"}</div>
          </div>

          <div>{item.quantity}</div>
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
          Print Packing Slip
        </button>
      </div>

      <style>
        {`
          @media print {
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
    fontSize: 12,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: {
    fontSize: 22,
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
    fontWeight: "bold",
    marginBottom: 8,
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
  },
  muted: {
    fontSize: 11,
    color: "#555",
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
