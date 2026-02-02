import React from "react";
import { useLocation } from "react-router-dom";

const InvoicePage = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return <div style={{ padding: 40 }}>No order data found.</div>;
  }

  /* ================= CUSTOMER ================= */
  const customer = order.customers || order.customer || {};

  const defaultAddress = customer.default_address || {};

  /* ================= ADDRESSES (SAFE) ================= */
  const shipping = {
    ...defaultAddress,
    ...order.shipping_address,
  };

  const billing = {
    ...defaultAddress,
    ...order.billing_address,
  };

  /* ================= LINE ITEMS ================= */
  const items = Array.isArray(order.products) ? order.products : [];

  /* ================= PRICES ================= */
  const currency = order.currency || "AUD";
  const totalPrice = Number(order.total_price || 0);

  const totalQty = items.reduce(
    (sum, i) => sum + (i.quantity || 0),
    0
  );

  const unitPrice =
    totalQty > 0 ? totalPrice / totalQty : 0;

  /* ================= META ================= */
  const invoiceNo = `INV-${order.serialNumber}`;
  const orderNo = order.shopifyOrderNo || order.orderId;
  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-GB")
    : "N/A";

  return (
    <div style={styles.page} className="invoice">
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.logo}>AYDI ACTIVE</h1>
          <p style={styles.muted}>
            PO Box 241, Doncaster Heights VIC 3109<br />
            Australia<br />
            contact@aydiactive.com<br />
            www.aydiactive.com
          </p>
        </div>

        <div style={styles.right}>
          <h2>INVOICE</h2>
          <div><strong>Invoice:</strong> {invoiceNo}</div>
          <div><strong>Order:</strong> #{orderNo}</div>
          <div><strong>Date:</strong> {date}</div>
          <div><strong>Status:</strong> {order.financial_status}</div>
        </div>
      </div>

      {/* ADDRESSES */}
      <div style={styles.addressRow}>
        <div>
          <h4>BILL TO</h4>
          <p>
            {customer.first_name} {customer.last_name}<br />
            {billing.address1 || "—"}<br />
            {billing.city || billing.province}<br />
            {billing.country}
          </p>
        </div>

        <div>
          <h4>SHIP TO</h4>
          <p>
            {customer.first_name} {customer.last_name}<br />
            {shipping.address1 || "—"}<br />
            {shipping.city || shipping.province}<br />
            {shipping.country}
          </p>
        </div>
      </div>

      {/* ITEMS */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th align="left">Item</th>
            <th align="left">Variant</th>
            <th align="right">Qty</th>
            <th align="right">Price</th>
            <th align="right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.product?.title}</td>
              <td>{item.variant?.title || "-"}</td>
              <td align="right">{item.quantity}</td>
              <td align="right">
                {currency} {unitPrice.toFixed(2)}
              </td>
              <td align="right">
                {currency} {(unitPrice * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAL */}
      <div style={styles.totalBox}>
        <div>
          <strong>Total:</strong>{" "}
          {currency} {totalPrice.toFixed(2)}
        </div>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>
          This invoice is generated electronically and is valid without
          signature.
        </p>

        <button onClick={() => window.print()} style={styles.printBtn}>
          Print Invoice
        </button>
      </div>

      {/* PRINT */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .invoice, .invoice * { visibility: visible; }
            .invoice { position: absolute; inset: 0; }
            button { display: none !important; }
          }
        `}
      </style>
    </div>
  );
};

/* ================= STYLES ================= */
const styles = {
  page: {
    maxWidth: 900,
    margin: "auto",
    padding: 40,
    fontFamily: "Arial",
    fontSize: 12,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: { fontSize: 24 },
  right: { textAlign: "right" },
  muted: { fontSize: 11, color: "#555" },
  addressRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 30,
  },
  totalBox: {
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
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

export default InvoicePage;
