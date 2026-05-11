import React from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

const InvoicePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return <div style={{ padding: 40 }}>No order data found.</div>;
  }

  const customer = order.customers || order.customer || {};

  const defaultAddress = customer.default_address || {};

  const shipping = {
    ...defaultAddress,
    ...order.shipping_address,
  };

  const billing = {
    ...defaultAddress,
    ...order.billing_address,
  };

  const currency = order.currency || "AUD";

  const getRefundedQtyByLineItemId = (lineItemId) => {
    return (order?.refunds || []).reduce((total, refund) => {
      const matchedRefundItem = refund.refundItems?.find(
        (item) => String(item.lineItemId) === String(lineItemId)
      );

      return total + Number(matchedRefundItem?.quantity || 0);
    }, 0);
  };

  const getRefundedAmountByLineItemId = (lineItemId) => {
    return (order?.refunds || []).reduce((total, refund) => {
      const matchedRefundItem = refund.refundItems?.find(
        (item) => String(item.lineItemId) === String(lineItemId)
      );

      return total + Number(matchedRefundItem?.amount || 0);
    }, 0);
  };

  const items = Array.isArray(order.products)
    ? order.products.map((item) => {
        const originalQty = Number(item.quantity || 0);
        const fulfilledQty = Number(item.fulfilled_quantity || 0);
        const refundedQty = getRefundedQtyByLineItemId(item.lineItemId);

        const remainingQty = Math.max(
          originalQty - fulfilledQty - refundedQty,
          0
        );

        const unitPrice = Number(item.variant?.price || 0);
        const originalTotal = originalQty * unitPrice;
        const fulfilledTotal = fulfilledQty * unitPrice;
        const refundedAmount = getRefundedAmountByLineItemId(item.lineItemId);
        const remainingTotal = remainingQty * unitPrice;

        return {
          ...item,
          originalQty,
          fulfilledQty,
          refundedQty,
          remainingQty,
          unitPrice,
          originalTotal,
          fulfilledTotal,
          refundedAmount,
          remainingTotal,
        };
      })
    : [];

  const visibleItems = items.filter((item) => item.originalQty > 0);

  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.originalTotal || 0);
  }, 0);

  const fulfilledTotal = items.reduce((sum, item) => {
    return sum + Number(item.fulfilledTotal || 0);
  }, 0);

  const refundedTotal = items.reduce((sum, item) => {
    return sum + Number(item.refundedAmount || 0);
  }, 0);

  const remainingTotal = items.reduce((sum, item) => {
    return sum + Number(item.remainingTotal || 0);
  }, 0);

  const shippingRefundedTotal = (order?.refunds || []).reduce(
    (sum, refund) => {
      return (
        sum +
        (refund.shippingRefunded ? Number(refund.shippingAmount || 0) : 0)
      );
    },
    0
  );

  const totalRefunded = refundedTotal + shippingRefundedTotal;

  const orderTotal = Number(order.total_price || subtotal || 0);

  const netPaid = Math.max(orderTotal - totalRefunded, 0);

  const invoiceNo = `INV-${order.serialNumber || order.orderId}`;
  const orderNo = order.shopifyOrderNo || order.orderId;

  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-GB")
    : "N/A";

  return (
    <div style={styles.page} className="invoice">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex mb-5 items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition shadow-sm"
      >
        <HiArrowLeft className="text-lg" />
        Back
      </button>

      <div style={styles.header}>
        <div>
          <h1 style={styles.logo}>AYDI ACTIVE</h1>

          <p style={styles.muted}>
            PO Box 241, Doncaster Heights VIC 3109
            <br />
            Australia
            <br />
            contact@aydiactive.com
            <br />
            www.aydiactive.com
          </p>
        </div>

        <div style={styles.right}>
          <h2>INVOICE</h2>

          <div>
            <strong>Invoice:</strong> {invoiceNo}
          </div>

          <div>
            <strong>Order:</strong> #{orderNo}
          </div>

          <div>
            <strong>Date:</strong> {date}
          </div>

          <div>
            <strong>Status:</strong> {order.financial_status}
          </div>
        </div>
      </div>

      <div style={styles.addressRow}>
        <div style={styles.addressBox}>
          <h4>BILL TO</h4>

          <p>
            {customer.first_name || ""} {customer.last_name || ""}
            <br />
            {billing.address1 || "—"}
            <br />
            {billing.city || ""} {billing.province || ""}
            <br />
            {billing.country || billing.country_name || ""}
          </p>
        </div>

        <div style={styles.addressBox}>
          <h4>SHIP TO</h4>

          <p>
            {customer.first_name || ""} {customer.last_name || ""}
            <br />
            {shipping.address1 || "—"}
            <br />
            {shipping.city || ""} {shipping.province || ""}
            <br />
            {shipping.country || shipping.country_name || ""}
          </p>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thLeft}>Item</th>
            <th style={styles.thLeft}>Variant</th>
            <th style={styles.thRight}>Original Qty</th>
            <th style={styles.thRight}>Fulfilled</th>
            <th style={styles.thRight}>Refunded</th>
            <th style={styles.thRight}>Remaining</th>
            <th style={styles.thRight}>Price</th>
            <th style={styles.thRight}>Total</th>
          </tr>
        </thead>

        <tbody>
          {visibleItems.map((item, i) => (
            <tr key={item.lineItemId || i}>
              <td style={styles.td}>{item.product?.title || "N/A"}</td>

              <td style={styles.td}>{item.variant?.title || "-"}</td>

              <td style={styles.tdRight}>{item.originalQty}</td>

              <td style={styles.tdRight}>{item.fulfilledQty}</td>

              <td style={styles.tdRight}>{item.refundedQty}</td>

              <td style={styles.tdRight}>{item.remainingQty}</td>

              <td style={styles.tdRight}>
                {currency} {item.unitPrice.toFixed(2)}
              </td>

              <td style={styles.tdRight}>
                {currency} {item.originalTotal.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.totalBox}>
        <div style={styles.totalRow}>
          <span>Subtotal:</span>
          <strong>
            {currency} {subtotal.toFixed(2)}
          </strong>
        </div>

        {fulfilledTotal > 0 && (
          <div style={styles.totalRow}>
            <span>Fulfilled value:</span>
            <strong>
              {currency} {fulfilledTotal.toFixed(2)}
            </strong>
          </div>
        )}

        {totalRefunded > 0 && (
          <div style={styles.totalRow}>
            <span>Refunded:</span>
            <strong style={styles.refundText}>
              -{currency} {totalRefunded.toFixed(2)}
            </strong>
          </div>
        )}

        {remainingTotal > 0 && (
          <div style={styles.totalRow}>
            <span>Remaining unfulfilled value:</span>
            <strong>
              {currency} {remainingTotal.toFixed(2)}
            </strong>
          </div>
        )}

        <div style={styles.grandTotal}>
          <span>Order Total:</span>
          <strong>
            {currency} {orderTotal.toFixed(2)}
          </strong>
        </div>

        {totalRefunded > 0 && (
          <div style={styles.grandTotal}>
            <span>Net Paid:</span>
            <strong>
              {currency} {netPaid.toFixed(2)}
            </strong>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <p>
          This invoice is generated electronically and is valid without
          signature.
        </p>

        <button onClick={() => window.print()} style={styles.printBtn}>
          Print Invoice
        </button>
      </div>

      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .invoice, .invoice * { visibility: visible; }
            .invoice { position: absolute; inset: 0; width: 100%; }
            button { display: none !important; }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: 1000,
    margin: "auto",
    padding: 40,
    fontFamily: "Arial",
    fontSize: 12,
    color: "#111",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: {
    fontSize: 24,
    margin: 0,
  },
  right: {
    textAlign: "right",
    lineHeight: 1.6,
  },
  muted: {
    fontSize: 11,
    color: "#555",
    lineHeight: 1.5,
  },
  addressRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 40,
    marginBottom: 30,
  },
  addressBox: {
    width: "50%",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 30,
  },
  thLeft: {
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    padding: "8px 6px",
    fontWeight: "bold",
  },
  thRight: {
    textAlign: "right",
    borderBottom: "1px solid #ddd",
    padding: "8px 6px",
    fontWeight: "bold",
  },
  td: {
    padding: "8px 6px",
    borderBottom: "1px solid #eee",
  },
  tdRight: {
    padding: "8px 6px",
    borderBottom: "1px solid #eee",
    textAlign: "right",
  },
  totalBox: {
    width: 360,
    marginLeft: "auto",
    fontSize: 13,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
  },
  grandTotal: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderTop: "1px solid #ddd",
    fontWeight: "bold",
    fontSize: 14,
  },
  refundText: {
    color: "#b91c1c",
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