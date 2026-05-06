import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const sendEmail = async (email, type, otp = null, orderData = null) => {

  try {
    // ✅ FIXED TRANSPORTER
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject = "";
    let html = "";

/* ================= OTP EMAIL ================= */
   if (type === "otp") {
  const now = new Date().toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  subject = `VARESSO OTP ${otp} - ${now}`;

  html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <style>
        @media (prefers-color-scheme: dark) {
          .email-bg,
          .email-card {
            background:#ffffff !important;
          }
          .main-text {
            color:#111111 !important;
          }
          .sub-text {
            color:#666666 !important;
          }
          .otp-box {
            background:#ffffff !important;
            color:#111111 !important;
            border-color:#e5e5e5 !important;
          }
        }
      </style>
    </head>

    <body style="margin:0;padding:0;background:#ffffff !important;">
      <div class="email-bg" style="margin:0;padding:0;background:#ffffff !important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
        
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff !important;">
          <tr>
            <td align="center" style="padding:0;margin:0;">

              <table class="email-card" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;padding:40px 20px;background:#ffffff !important;">
                
                <tr>
                  <td style="text-align:center;padding-bottom:30px;">
                    <h1 class="main-text" style="margin:0;font-size:24px;letter-spacing:4px;color:#111111 !important;font-weight:600;">
                      VARESSO
                    </h1>

                    <p class="sub-text" style="margin:8px 0 0;font-size:11px;letter-spacing:2px;color:#666666 !important;">
                      DEFINE YOUR FRAGRANCE
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="text-align:center;">
                    <h2 class="main-text" style="margin:0 0 10px;font-size:22px;font-weight:500;color:#111111 !important;">
                      Verify your email
                    </h2>

                    <p class="sub-text" style="margin:0 0 30px;font-size:14px;color:#666666 !important;">
                      Enter the verification code below to continue.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center">
                    <div class="otp-box" style="display:inline-block;padding:16px 34px;border:1px solid #e5e5e5;border-radius:10px;font-size:28px;letter-spacing:8px;color:#111111 !important;font-weight:600;background:#ffffff !important;">
                      ${otp}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="text-align:center;">
                    <p class="sub-text" style="margin:25px 0 0;font-size:13px;color:#777777 !important;">
                      This code will expire in 5 minutes.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="text-align:center;padding-top:40px;">
                    
                    <div style="height:1px;background:#eeeeee;width:60%;margin:0 auto 20px;"></div>

                    <p class="sub-text" style="font-size:12px;color:#777777 !important;margin:0;">
                      If you didn’t request this, you can safely ignore it.
                    </p>

                    <p class="sub-text" style="font-size:12px;color:#999999 !important;margin-top:6px;">
                      © 2026 VARESSO — All Rights Reserved
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </div>
    </body>
  </html>
  `;
}

/* ================= WELCOME EMAIL ================= */

if (type === "welcome") {
  const now = new Date().toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  subject = `Welcome to VARESSO • ${now}`;

  html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
    </head>

    <body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr>
          <td align="center">

            <!-- MAIN CARD -->
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;padding:40px 20px;">
              
              <!-- BRAND -->
              <tr>
                <td style="text-align:center;padding-bottom:30px;">
                  <h1 style="
                    margin:0;
                    font-size:24px;
                    letter-spacing:4px;
                    color:#111;
                    font-weight:600;
                  ">
                    VARESSO
                  </h1>

                  <p style="
                    margin:8px 0 0;
                    font-size:11px;
                    letter-spacing:2px;
                    color:#666;
                  ">
                    DEFINE YOUR PRESENCE — LEAVE A MARK
                  </p>
                </td>
              </tr>

              <!-- TITLE -->
              <tr>
                <td style="text-align:center;">
                  <h2 style="
                    margin:0 0 12px;
                    font-size:22px;
                    font-weight:500;
                    color:#111;
                  ">
                    Welcome to VARESSO ✨
                  </h2>

                  <p style="
                    color:#555;
                    font-size:14px;
                    line-height:1.7;
                    margin:0 0 30px;
                    max-width:420px;
                    margin-left:auto;
                    margin-right:auto;
                  ">
                    Your account has been successfully created.  
                    You are now part of the VARESSO experience.
                  </p>
                </td>
              </tr>

              <!-- BUTTON -->
              <tr>
                <td align="center">
                  <a href="http://localhost:5173" target="_blank" style="
                    display:inline-block;
                    padding:14px 30px;
                    background:#000;
                    border-radius:8px;
                    color:#fff;
                    font-size:14px;
                    letter-spacing:1px;
                    text-decoration:none;
                    font-weight:600;
                  ">
                    EXPLORE VARESSO
                  </a>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="text-align:center;padding-top:40px;">
                  
                  <div style="
                    height:1px;
                    background:#eee;
                    width:60%;
                    margin:0 auto 20px;
                  "></div>

                  <p style="
                    font-size:12px;
                    color:#777;
                    margin:0;
                  ">
                    Luxury begins with presence.
                  </p>

                  <p style="
                    font-size:12px;
                    color:#999;
                    margin-top:6px;
                  ">
                    © 2026 VARESSO — All Rights Reserved
                  </p>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
}

/* ================= LOGIN EMAIL ================= */

if (type === "login") {
  const now = new Date().toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  subject = `Login Successful • ${now}`;

  html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
    </head>

    <body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr>
          <td align="center">

            <!-- MAIN CARD -->
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;padding:40px 20px;">
              
              <!-- BRAND -->
              <tr>
                <td style="text-align:center;padding-bottom:30px;">
                  <h1 style="
                    margin:0;
                    font-size:24px;
                    letter-spacing:4px;
                    color:#111;
                    font-weight:600;
                  ">
                    VARESSO
                  </h1>

                  <p style="
                    margin:8px 0 0;
                    font-size:11px;
                    letter-spacing:2px;
                    color:#666;
                  ">
                    DEFINE YOUR PRESENCE — LEAVE A MARK
                  </p>
                </td>
              </tr>

              <!-- TITLE -->
              <tr>
                <td style="text-align:center;">
                  <h2 style="
                    margin:0 0 12px;
                    font-size:22px;
                    font-weight:500;
                    color:#111;
                  ">
                    Welcome Back to VARESSO ✨
                  </h2>

                  <p style="
                    color:#555;
                    font-size:14px;
                    line-height:1.7;
                    margin:0 0 30px;
                    max-width:420px;
                    margin-left:auto;
                    margin-right:auto;
                  ">
                    You’ve successfully signed in to VARESSO.
                    <br />
                    Your journey with premium fragrance experiences continues — explore, express, and define your presence with every moment.
                  </p>
                </td>
              </tr>

              <!-- BUTTON -->
              <tr>
                <td align="center">
                  <a href="https://www.varesso.in" target="_blank" style="
                    display:inline-block;
                    padding:14px 30px;
                    background:#000;
                    border-radius:8px;
                    color:#fff;
                    font-size:14px;
                    letter-spacing:1px;
                    text-decoration:none;
                    font-weight:600;
                  ">
                    GO TO VARESSO
                  </a>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="text-align:center;padding-top:40px;">
                  
                  <div style="
                    height:1px;
                    background:#eee;
                    width:60%;
                    margin:0 auto 20px;
                  "></div>

                  <p style="
                    font-size:12px;
                    color:#777;
                    margin:0;
                  ">
                    Your security is our priority.
                  </p>

                  <p style="
                    font-size:12px;
                    color:#999;
                    margin-top:6px;
                  ">
                    © 2026 VARESSO — All Rights Reserved
                  </p>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
}

/* ================= PASSWORD RESET EMAIL ================= */

if (type === "reset") {
  const now = new Date().toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  subject = `Password Changed Successfully 🔒 • ${now}`;

  html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
    </head>

    <body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr>
          <td align="center">

            <!-- MAIN CARD -->
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;padding:40px 20px;">
              
              <!-- BRAND -->
              <tr>
                <td style="text-align:center;padding-bottom:30px;">
                  <h1 style="
                    margin:0;
                    font-size:24px;
                    letter-spacing:4px;
                    color:#111;
                    font-weight:600;
                  ">
                    VARESSO
                  </h1>

                  <p style="
                    margin:8px 0 0;
                    font-size:11px;
                    letter-spacing:2px;
                    color:#666;
                  ">
                    DEFINE YOUR PRESENCE — LEAVE A MARK
                  </p>
                </td>
              </tr>

              <!-- TITLE -->
              <tr>
                <td style="text-align:center;">
                  <h2 style="
                    margin:0 0 12px;
                    font-size:22px;
                    font-weight:500;
                    color:#111;
                  ">
                    Password Updated 
                  </h2>

                  <p style="
                    color:#444;
                    font-size:15px;
                    line-height:1.8;
                    margin:0 0 30px;
                    max-width:520px;
                    margin-left:auto;
                    margin-right:auto;
                  ">
                    Your password has been successfully changed.  
                    Your account is now secure with your new credentials.
                  </p>
                </td>
              </tr>

              <!-- ALERT BOX -->
              <tr>
                <td align="center">
                  <div style="
                    background:#ffffff;
                    border:1px solid #000;
                    padding:14px;
                    border-radius:10px;
                    color:#444;
                    font-size:13px;
                    margin-bottom:30px;
                    max-width:380px;
                  ">
                    If you did not make this change, please reset your password immediately.
                  </div>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="text-align:center;padding-top:40px;">
                  
                  <div style="
                    height:1px;
                    background:#eee;
                    width:60%;
                    margin:0 auto 20px;
                  "></div>

                  <p style="
                    font-size:12px;
                    color:#777;
                    margin:0;
                  ">
                    Your security is our priority.
                  </p>

                  <p style="
                    font-size:12px;
                    color:#999;
                    margin-top:6px;
                  ">
                    © 2026 VARESSO — All Rights Reserved
                  </p>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
}
/* ================= CART REMINDER EMAIL ================= */

if (type === "cart-reminder") {
  const now = new Date().toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  subject = `Your VARESSO cart is waiting ✨ • ${now}`;

  html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
    </head>

    <body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr>
          <td align="center">

            <!-- MAIN CARD -->
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;padding:40px 20px;">
              
              <!-- BRAND -->
              <tr>
                <td style="text-align:center;padding-bottom:30px;">
                  <h1 style="
                    margin:0;
                    font-size:24px;
                    letter-spacing:4px;
                    color:#111;
                    font-weight:600;
                  ">
                    VARESSO
                  </h1>

                  <p style="
                    margin:8px 0 0;
                    font-size:11px;
                    letter-spacing:2px;
                    color:#666;
                  ">
                    DEFINE YOUR PRESENCE — LEAVE A MARK
                  </p>
                </td>
              </tr>

              <!-- TITLE -->
              <tr>
                <td style="text-align:center;">
                  <h2 style="
                    margin:0 0 12px;
                    font-size:22px;
                    font-weight:500;
                    color:#111;
                  ">
                    Your Cart is Waiting
                  </h2>

                  <p style="
                    color:#444;
                    font-size:15px;
                    line-height:1.8;
                    margin:0 0 30px;
                    max-width:520px;
                    margin-left:auto;
                    margin-right:auto;
                  ">
                    Your selected fragrance is still waiting.  
                    Complete your purchase before it’s gone.
                  </p>
                </td>
              </tr>

              <!-- BUTTON 1 -->
              <tr>
                <td align="center">
                  <a href="https://www.varesso.in/cart" target="_blank" style="
                    display:inline-block;
                    padding:14px 30px;
                    background:#000;
                    border-radius:8px;
                    color:#fff;
                    font-size:14px;
                    letter-spacing:1px;
                    text-decoration:none;
                    font-weight:600;
                    margin-bottom:14px;
                  ">
                    COMPLETE YOUR ORDER
                  </a>
                </td>
              </tr>

              <!-- TEXT -->
              <tr>
                <td style="text-align:center;">
                  <p style="
                    color:#777;
                    font-size:13px;
                    margin:0;
                  ">
                    Luxury is one step away.
                  </p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="text-align:center;padding-top:40px;">
                  
                  <div style="
                    height:1px;
                    background:#eee;
                    width:60%;
                    margin:0 auto 20px;
                  "></div>

                  <p style="
                    font-size:12px;
                    color:#999;
                    margin:0;
                  ">
                    © 2026 VARESSO — All Rights Reserved
                  </p>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
}

/* ================= ORDER CONFIRMATION EMAIL ================= */

if (type === "order-confirmation") {
  const orderDate = new Date(orderData.createdAt || Date.now());

  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 6);

  const formatDateTime = (date) =>
    date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

const items = orderData.items || [];

const getQty = (item) => Number(item.quantity || item.quantityCount || 1) || 1;

// ✅ Fixed values
const MRP_PER_ITEM = 5999;
const PRICE_PER_ITEM = 950;

// ✅ Total quantity
const totalItems = items.reduce((sum, item) => sum + getQty(item), 0);

// ✅ Total MRP = 5999 * total items
const totalMrp = MRP_PER_ITEM * totalItems;

// ✅ Total price = 950 * total items
const totalPrice = PRICE_PER_ITEM * totalItems;

// ✅ Discount = MRP - Selling Price
const totalDiscount = totalMrp - totalPrice;

// ✅ Final payable amount
const finalTotal = totalPrice;

  const now = new Date().toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  subject = `VARESSO Order Confirmed - ${orderData.orderNumber} • ${now}`;

  const itemsHtml = items
    .map((item) => {
      const qty = getQty(item);
      const price = Number(item.price || 0);

      return `
        <tr>
          <td style="padding:18px 0;border-bottom:1px solid #eeeeee;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="92" valign="top">
                  <img 
                    src="${item.profileimage || ""}" 
                    width="78" 
                    height="102" 
                    style="display:block;object-fit:cover;border-radius:10px;border:1px solid #e5e5e5;background:#ffffff;" 
                  />
                </td>

                <td valign="top" style="padding-left:14px;">
                  <p style="margin:0 0 5px;font-size:13px;font-weight:700;color:#111;letter-spacing:1.5px;">
                    ${item.brand || "VARESSO"}
                  </p>

                  <p style="margin:0 0 6px;font-size:15px;font-weight:600;color:#222;">
                    ${item.name || "Product"}
                  </p>

                  <p style="margin:0 0 8px;font-size:12px;color:#777;line-height:1.5;">
                    ${item.Fragrance || item.fragrance || item.category || "Premium Fragrance Perfume"}
                  </p>

                  <p style="margin:0;font-size:12px;color:#555;">
                    Qty: ${qty} · ₹${(qty * price).toFixed(2)}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join("");

  html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
    </head>

    <body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr>
          <td align="center">

            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;padding:40px 20px;background:#ffffff;">
              
              <tr>
                <td style="text-align:center;padding-bottom:30px;">
                  <h1 style="margin:0;font-size:24px;letter-spacing:4px;color:#111;font-weight:600;">
                    VARESSO
                  </h1>

                  <p style="margin:8px 0 0;font-size:11px;letter-spacing:2px;color:#666;">
                    DEFINE YOUR PRESENCE — LEAVE A MARK
                  </p>
                </td>
              </tr>

              <tr>
                <td style="text-align:center;">
                  <h2 style="margin:0 0 12px;font-size:22px;font-weight:500;color:#111;">
                    Order Confirmed
                  </h2>

                  <p style="
                    color:#444;
                    font-size:15px;
                    line-height:1.8;
                    margin:0 0 30px;
                    max-width:520px;
                    text-align:left;
                  ">
                    Your order has been successfully placed, <b>${orderData.name || "Customer"}</b>. 
                    Review your order details and payment information below.
                  </p>
                </td>
              </tr>

              <tr>
                <td>
                  <h3 style="margin:0 0 12px;color:#111;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                    Product Details
                  </h3>

                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${itemsHtml}
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding-top:24px;">
                  <div style="background:#ffffff;border:1px solid #eeeeee;padding:22px 20px;border-radius:0;">
                    <h3 style="
                      margin:0 0 24px;
                      color:#000;
                      font-size:22px;
                      letter-spacing:4px;
                      text-transform:uppercase;
                      font-weight:700;
                    ">
                      Order Summary
                    </h3>

                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;color:#111;">
                      <tr>
                        <td style="padding:10px 0;color:#111;letter-spacing:1px;text-transform:uppercase;">ITEMS</td>
                        <td align="right" style="padding:10px 0;color:#111;">${totalItems}</td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;color:#111;letter-spacing:1px;text-transform:uppercase;">TOTAL MRP</td>
                        <td align="right" style="padding:10px 0;color:#111;">₹${totalMrp.toFixed(2)}</td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;color:#111;letter-spacing:1px;text-transform:uppercase;">DISCOUNT</td>
                        <td align="right" style="padding:10px 0;color:#111;">- ₹${totalDiscount.toFixed(2)}</td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;color:#111;letter-spacing:1px;text-transform:uppercase;">SUBTOTAL</td>
                        <td align="right" style="padding:10px 0;color:#111;">₹${totalPrice.toFixed(2)}</td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;color:#111;letter-spacing:1px;text-transform:uppercase;">SHIPPING</td>
                        <td align="right" style="padding:10px 0;color:#111;">FREE</td>
                      </tr>

                      <tr>
                        <td colspan="2" style="border-top:1px solid #dddddd;padding-top:18px;"></td>
                      </tr>

                      <tr>
                        <td style="padding:8px 0;font-size:17px;font-weight:800;color:#000;text-transform:uppercase;">TOTAL</td>
                        <td align="right" style="padding:8px 0;font-size:17px;font-weight:800;color:#000;">₹${finalTotal.toFixed(2)}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding-top:28px;">
                  <a href="https://www.varesso.in/Account" target="_blank" style="
                    display:inline-block;
                    padding:14px 30px;
                    background:#000;
                    border-radius:8px;
                    color:#fff;
                    font-size:14px;
                    letter-spacing:1px;
                    text-decoration:none;
                    font-weight:600;
                  ">
                    VIEW ORDER
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding-top:18px;">
                  <div style="background:#ffffff;border:1px solid #eeeeee;padding:18px;border-radius:12px;font-size:13px;color:#333;">
                    <h3 style="margin:0 0 12px;color:#111;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                      Order Details
                    </h3>

                    <p style="margin:6px 0;">Order Number: <b>${orderData.orderNumber || "-"}</b></p>
                    <p style="margin:6px 0;">Order Date: ${formatDateTime(orderDate)}</p>
                    <p style="margin:6px 0;">Estimated Delivery Date: <b>${formatDate(deliveryDate)}</b></p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding-top:18px;">
                  <div style="background:#ffffff;border:1px solid #eeeeee;padding:18px;border-radius:12px;font-size:13px;color:#333;">
                    <h3 style="margin:0 0 12px;color:#111;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                      Customer Details
                    </h3>

                    <p style="margin:6px 0;"><b>${orderData.name || "-"}</b></p>
                    <p style="margin:6px 0;">Phone: ${orderData.phone || "-"}</p>
                    <p style="margin:6px 0;">Email: ${orderData.email || "-"}</p>
                    <p style="margin:6px 0;line-height:1.6;">
                      Address:
                      ${[
                        orderData.address?.addressLine,
                        orderData.address?.city,
                        orderData.address?.state,
                        orderData.address?.pincode,
                      ]
                        .filter(Boolean)
                        .join(",")}
                    </p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="text-align:center;padding-top:40px;">
                  <div style="height:1px;background:#eee;width:60%;margin:0 auto 20px;"></div>

                  <p style="font-size:12px;color:#777;margin:0;">
                    Thank you for choosing VARESSO.
                  </p>

                  <p style="font-size:12px;color:#999;margin-top:6px;">
                    © 2026 VARESSO — All Rights Reserved
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
}

/* ================= NEW ORDER EMAIL RECEIVED ================= */

if (type === "admin-order") {
  const orderDate = new Date(orderData.createdAt || Date.now());

  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 6);

  const formatDateTime = (date) =>
    date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const items = orderData.items || [];

const getQty = (item) => Number(item.quantity || item.quantityCount || 1) || 1;

// ✅ Fixed values
const MRP_PER_ITEM = 5999;
const PRICE_PER_ITEM = 950;

// ✅ Total quantity
const totalItems = items.reduce((sum, item) => sum + getQty(item), 0);

// ✅ Total MRP = 5999 * total items
const totalMrp = MRP_PER_ITEM * totalItems;

// ✅ Total price = 950 * total items
const totalPrice = PRICE_PER_ITEM * totalItems;

// ✅ Discount = MRP - Selling Price
const totalDiscount = totalMrp - totalPrice;

// ✅ Final payable amount
const finalTotal = totalPrice;


  const now = new Date().toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  subject = `VARESSO - New Order ${orderData.orderNumber} • ${now}`;

  const itemsHtml = items
    .map((item) => {
      const qty = getQty(item);
      const price = Number(item.price || 0);

      return `
        <tr>
          <td style="padding:18px 0;border-bottom:1px solid #eeeeee;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="92" valign="top">
                  <img 
                    src="${item.profileimage || ""}" 
                    width="78" 
                    height="102"
                    style="display:block;object-fit:cover;border-radius:10px;border:1px solid #e5e5e5;background:#ffffff;" 
                  />
                </td>

                <td valign="top" style="padding-left:14px;">
                  <p style="margin:0 0 5px;font-size:13px;font-weight:700;color:#111;letter-spacing:1.5px;">
                    ${item.brand || "VARESSO"}
                  </p>

                  <p style="margin:0 0 6px;font-size:15px;font-weight:600;color:#222;">
                    ${item.name || "Product"}
                  </p>

                  <p style="margin:0 0 8px;font-size:12px;color:#777;line-height:1.5;">
                    ${item.Fragrance || item.fragrance || item.category || "Premium Fragrance"}
                  </p>

                  <p style="margin:0;font-size:12px;color:#555;">
                    Qty: ${qty} · ₹${(qty * price).toFixed(2)}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join("");

  html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
    </head>

    <body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;padding:40px 20px;background:#ffffff;">
              
              <tr>
                <td style="text-align:center;padding-bottom:30px;">
                  <h1 style="margin:0;font-size:24px;letter-spacing:4px;color:#111;font-weight:600;">
                    VARESSO
                  </h1>
                  <p style="margin:8px 0 0;font-size:11px;letter-spacing:2px;color:#666;">
                    DEFINE YOUR PRESENCE — LEAVE A MARK
                  </p>
                </td>
              </tr>

              <tr>
                <td>
                  <h2 style="margin:0 0 12px;font-size:22px;font-weight:500;color:#111;text-align:center;">
                    New Order Received
                  </h2>

                  <p style="color:#444;font-size:15px;line-height:1.8;margin:0 0 30px;text-align:left;">
                    New order received from <b>${orderData.name || "Customer"}</b>. 
                    Review the order and payment information below.
                  </p>
                </td>
              </tr>

              <tr>
                <td>
                  <h3 style="margin:0 0 12px;color:#111;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                    Product Details
                  </h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${itemsHtml}
                  </table>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding-top:28px;">
                  <a href="https://varesso.com/admin" target="_blank" style="
                    display:inline-block;
                    padding:14px 30px;
                    background:#000;
                    border-radius:8px;
                    color:#fff;
                    font-size:14px;
                    letter-spacing:1px;
                    text-decoration:none;
                    font-weight:600;
                  ">
                    VIEW IN ADMIN PANEL
                  </a>
                </td>
              </tr>

              <!-- ORDER SUMMARY -->
              <tr>
                <td style="padding-top:28px;">
                  <div style="background:#ffffff;border:1px solid #eeeeee;padding:22px 20px;border-radius:0;">
                    <h3 style="margin:0 0 24px;color:#000;font-size:22px;letter-spacing:4px;text-transform:uppercase;font-weight:700;">
                      Order Summary
                    </h3>

                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;color:#111;">
                      <tr>
                        <td style="padding:10px 0;letter-spacing:1px;text-transform:uppercase;">ITEMS</td>
                        <td align="right" style="padding:10px 0;">${totalItems}</td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;letter-spacing:1px;text-transform:uppercase;">TOTAL MRP</td>
                        <td align="right" style="padding:10px 0;">₹${totalMrp.toFixed(2)}</td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;letter-spacing:1px;text-transform:uppercase;">DISCOUNT</td>
                        <td align="right" style="padding:10px 0;">- ₹${totalDiscount.toFixed(2)}</td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;letter-spacing:1px;text-transform:uppercase;">SUBTOTAL</td>
                        <td align="right" style="padding:10px 0;">₹${totalPrice.toFixed(2)}</td>
                      </tr>

                      <tr>
                        <td style="padding:10px 0;letter-spacing:1px;text-transform:uppercase;">SHIPPING</td>
                        <td align="right" style="padding:10px 0;">FREE</td>
                      </tr>

                      <tr>
                        <td colspan="2" style="border-top:1px solid #dddddd;padding-top:18px;"></td>
                      </tr>

                      <tr>
                        <td style="padding:8px 0;font-size:17px;font-weight:800;color:#000;text-transform:uppercase;">TOTAL</td>
                        <td align="right" style="padding:8px 0;font-size:17px;font-weight:800;color:#000;">₹${finalTotal.toFixed(2)}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- PAYMENT SUMMARY -->
              <tr>
                <td style="padding-top:18px;">
                  <div style="background:#ffffff;border:1px solid #eeeeee;padding:18px;border-radius:12px;font-size:13px;color:#333;">
                    <h3 style="margin:0 0 12px;color:#111;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                      Payment Summary
                    </h3>

                    <p style="margin:6px 0;">Currency: <b>${orderData.currency || "INR"}</b></p>
                    <p style="margin:6px 0;">Mode: <b>${orderData.method || "-"}</b></p>
                    <p style="margin:6px 0;">Status: <b>${orderData.status || "-"}</b></p>
                    <p style="margin:6px 0;">Payment ID: <b>${orderData.razorpayPaymentId || "-"}</b></p>
                    <p style="margin:6px 0;">QR ID: <b>${orderData.razorpayQrCodeId || "-"}</b></p>
                  </div>
                </td>
              </tr>

              <!-- ORDER DETAILS -->
              <tr>
                <td style="padding-top:18px;">
                  <div style="background:#ffffff;border:1px solid #eeeeee;padding:18px;border-radius:12px;font-size:13px;color:#333;">
                    <h3 style="margin:0 0 12px;color:#111;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                      Order Details
                    </h3>

                    <p style="margin:6px 0;">Order Number: <b>${orderData.orderNumber || "-"}</b></p>
                    <p style="margin:6px 0;">Date: ${formatDateTime(orderDate)}</p>
                    <p style="margin:6px 0;">Delivery Date: <b>${formatDate(deliveryDate)}</b></p>
                  </div>
                </td>
              </tr>

              <!-- CUSTOMER DETAILS -->
              <tr>
                <td style="padding-top:18px;">
                  <div style="background:#ffffff;border:1px solid #eeeeee;padding:18px;border-radius:12px;font-size:13px;color:#333;">
                    <h3 style="margin:0 0 12px;color:#111;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                      Customer Details
                    </h3>

                    <p style="margin:6px 0;"><b>${orderData.name || "-"}</b></p>
                    <p style="margin:6px 0;">Phone: ${orderData.phone || "-"}</p>
                    <p style="margin:6px 0;">Email: ${orderData.email || "-"}</p>
                    <p style="margin:6px 0;line-height:1.6;">
                      Address:
                      ${[
                        orderData.address?.addressLine,
                        orderData.address?.city,
                        orderData.address?.state,
                        orderData.address?.pincode,
                      ]
                        .filter(Boolean)
                        .join(",")}
                    </p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="text-align:center;padding-top:40px;">
                  <div style="height:1px;background:#eee;width:60%;margin:0 auto 20px;"></div>
                  <p style="font-size:12px;color:#777;margin:0;">
                    New order notification from VARESSO.
                  </p>
                  <p style="font-size:12px;color:#999;margin-top:6px;">
                    © 2026 VARESSO — All Rights Reserved
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}


    // ✅ SEND EMAIL
    await transporter.sendMail({
      from: `"VARESSO" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    }); 

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);
  }
};

export default sendEmail;