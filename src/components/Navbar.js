import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/product" className="active">Product</NavLink>
                </li>
                <li>
                    <NavLink to="/pos" className="active">POS</NavLink>
                </li>
                <li>
                    <NavLink to="/inventory" className="active">Inventory</NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
