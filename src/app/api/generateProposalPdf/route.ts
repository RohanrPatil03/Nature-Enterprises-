'use server';

import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  try {
    const { name, systemSize, monthlyBill } = await request.json();

    if (!name || !systemSize || !monthlyBill) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const systemSizeNum = parseFloat(systemSize);
    const monthlyBillNum = parseFloat(monthlyBill);

    if (isNaN(systemSizeNum) || isNaN(monthlyBillNum) || systemSizeNum <= 0 || monthlyBillNum <= 0) {
        return NextResponse.json({ error: 'Invalid numeric values for system size or monthly bill.' }, { status: 400 });
    }

    const systemCost = systemSizeNum * 70000;
    const paybackPeriod = systemCost / (monthlyBillNum * 12);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solar Proposal for ${name}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
        <style>
          body { 
            font-family: 'Open Sans', sans-serif; 
            color: #333; 
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .container { max-width: 800px; margin: auto; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #ddd; padding-bottom: 20px; margin-bottom: 30px; }
          .logo-area .company-name { font-family: 'Montserrat', sans-serif; font-size: 24px; color: #166534; font-weight: 700; }
          .logo-area .tagline { font-size: 14px; color: #555; }
          .proposal-title { text-align: right; }
          .proposal-title h1 { font-family: 'Montserrat', sans-serif; color: #166534; margin: 0 0 5px 0; font-size: 28px;}
          .proposal-title p { margin: 0; font-size: 14px; color: #555; }
          h2 { font-family: 'Montserrat', sans-serif; font-size: 18px; margin-bottom: 10px; color: #16a34a; }
          .prepared-for p { font-size: 18px; margin: 0; }
          .section { margin-top: 30px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 20px; }
          .card { border: 1px solid #eee; border-radius: 8px; padding: 20px; text-align: center; background-color: #f9fafb; }
          .card-title { font-size: 14px; color: #555; margin: 0 0 10px 0; }
          .card-value { font-size: 28px; font-weight: 600; margin: 0; color: #166534; }
          .disclaimer { margin-top: 40px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="header">
            <div class="logo-area">
              <div class="company-name">Green Energy</div>
              <p class="tagline">Your Partner in Renewable Energy</p>
            </div>
            <div class="proposal-title">
              <h1>Solar Proposal</h1>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
          </header>
          
          <section class="prepared-for">
            <h2>Prepared For:</h2>
            <p>${name}</p>
          </section>

          <section class="section">
            <h2>System Overview & Financials</h2>
            <div class="grid">
              <div class="card">
                <p class="card-title">System Size</p>
                <p class="card-value">${systemSizeNum.toFixed(1)} kW</p>
              </div>
              <div class="card">
                <p class="card-title">Estimated Cost</p>
                <p class="card-value">₹${systemCost.toLocaleString('en-IN')}</p>
              </div>
              <div class="card">
                <p class="card-title">Payback Period</p>
                <p class="card-value">${paybackPeriod > 0 ? paybackPeriod.toFixed(1) : 'N/A'} years</p>
              </div>
            </div>
          </section>

          <p class="disclaimer">
            This is a preliminary proposal based on the information you provided. All figures are estimates. Actual system cost, energy production, and financial returns may vary based on a detailed site assessment, final system design, available incentives, and your electricity usage. This document is not a binding contract.
          </p>
        </div>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="proposal-for-${name.replace(/\s+/g, '-').toLowerCase()}.pdf"`
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF proposal.' }, { status: 500 });
  }
}
