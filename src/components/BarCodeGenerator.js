import React, { useState } from 'react';
import Barcode from 'react-barcode';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import jsPDF from 'jspdf';

const GeneratorWrapper = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: purple;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

export default function BarCodeGenerator() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [barcodeValue, setBarcodeValue] = useState('');

  const generateBarcode = async () => {
    // Generate a unique ID for the product
    const uniqueId = uuidv4();

    // Simulate saving the product to the database
    const product = { name, price, quantity, barcode: uniqueId };
    await fetch('http://localhost:5000/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    // Set the barcode to the unique product ID
    setBarcodeValue(uniqueId);

  };


  const printBarcodes = () => {
    const svg = document.querySelector('svg');

    if (!svg) {
      console.error('SVG not found');
      return;
    }

    // Convert the SVG to a data URL
    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // canvas.width = 189;
    // canvas.height = 94;

    const bbox = svg.getBBox(); // Gets the bounding box dimensions of the SVG
    canvas.width = bbox.width;
    canvas.height = bbox.height;

    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);

    img.onload = () => {
      const doc = new jsPDF();
      ctx.drawImage(img, 0, 0 );

      for (let i = 0; i < quantity; i++) {
        doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, (i % 10) * 25, 210, 25);
        // if ((i + 1) % 10 === 0) doc.addPage(); // New page every 10 barcodes
        if ((i + 1) % 10 === 0 && i + 1 < quantity) {
          doc.addPage(); // New page for every 10 barcodes
        }
      }
      doc.save('barcodes.pdf');
      // URL.revokeObjectURL(url); // Clean up
    };
    // img.src = url;
  };

  return (
    <GeneratorWrapper>
      <h1>Barcode Generator</h1>
      <InputWrapper>
        <Input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <Button onClick={generateBarcode}>Generate Barcode</Button>
      </InputWrapper>

      {/* {barcodeValue && (
        <div>
          <Barcode value={barcodeValue} />
        </div>
      )} */}

      {barcodeValue && (
        <>
          <div>
            <Barcode value={barcodeValue} />
          </div>
          <Button onClick={printBarcodes}>Print Barcodes</Button>
        </>
      )}
    </GeneratorWrapper>
  );
}
