import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const POSWrapper = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const InputWrapper = styled.div`
  display: flex;
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

const POS = () => {
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState(null);
  const [quantitySold, setQuantitySold] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleScan = () => {
    setError('');
    setSuccess('');
    try {
      axios.get(`http://localhost:5000/pos/${barcode}`)
        .then((response) => {
          setProduct(response.data);
          console.log(response.data);
        })
    } catch (error) {
      setError('Product not found. Please check the barcode.');
      setProduct(null);
    }

  };

  const handleSell = async () => {
    if (!product || quantitySold <= 0 || quantitySold > product.quantity) {
      setError('Invalid quantity or product not available.');
      return;
    }

    try {
      const newQuantity = product.quantity - quantitySold;
      const response = await axios.put(`http://localhost:5000/pos/${barcode}`, { quantity: newQuantity });
      setProduct(response.data);
      setSuccess('Product sold successfully!');
    } catch (error) {
      setError('Error updating product. Please try again.');
    }
  };

  return (
    <POSWrapper>
      <h1>POS System</h1>
      <InputWrapper>
        <Input
          type="text"
          placeholder="Scan Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        <Button onClick={handleScan}>Scan</Button>
      </InputWrapper>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {product && (
        <div>
          <h2>Product: {product.name}</h2>
          <h3>Price: ${product.price}</h3>
          <h3>Quantity: {product.quantity}</h3>
          <Input
            type="number"
            placeholder="Quantity Sold"
            value={quantitySold}
            min="1"
            max={product.quantity}
            onChange={(e) => setQuantitySold(Number(e.target.value))}
          />
          <Button onClick={handleSell}>Sell</Button>
        </div>
      )}
    </POSWrapper>
  );
};

export default POS;
