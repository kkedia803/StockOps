import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const InventoryWrapper = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  padding: 10px;
  background-color: purple;
  color: white;
  text-align: left;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
`;

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/inventory')
      .then((response) => {
        setInventory(response.data);
      })
      .catch((error) => {
        console.error('Error fetching inventory:', error);
      });
  }, []);

  return (
    <InventoryWrapper>
      <h1>Inventory</h1>
      <Table>
        <thead>
          <tr>
            <Th>Product</Th>
            <Th>Price</Th>
            <Th>Quantity</Th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <Td>{item.name}</Td>
              <Td>${item.price}</Td>
              <Td>{item.quantity}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </InventoryWrapper>
  );
};

export default Inventory;
