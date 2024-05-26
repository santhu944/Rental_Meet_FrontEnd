"use client"
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialog from '@mui/material/Dialog'; // Import Dialog component from Material-UI
import "./styles.css"

const Navbar = ({ setUserType }) => {
  return (
    <nav className="navbar">
      <img src="../../responsive navbar.gif" width="50" alt="a logo" />
      <div>
        <ul className="menu_list">
          <Button variant="contained"  onClick={() => setUserType("buyer")}>Buyer</Button>
          <Button variant="contained"  onClick={() => setUserType("seller")}>Seller</Button>
          <li onClick={() => setUserType("seller")}>AboutUs</li>
          <li onClick={() => setUserType("seller")}>Contact</li>
        </ul>
      </div>
    </nav>
  );
};

const SellersList = ({ userType }) => {
  const [sellers, setSellers] = useState([]);
  const [formData, setFormData] = useState({
    Place: "",
    Area: "",
    No_Of_Bedrooms: "",
    No_Of_Bathrooms: "",
    No_Of_Hospital: "",
    No_Of_College: "",
    rent_img: ""
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await fetch('https://renting-meets-simplicity.onrender.com/api/sellers');
      const data = await response.json();
      setSellers(data.data);
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

  const handleCreateSeller = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://renting-meets-simplicity.onrender.com/api/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: formData })
      });
      const data = await response.json();
      console.log("New seller created:", data);
      toast.success("Seller created successfully!");
      setShowCreateModal(false);
      fetchSellers();
      setFormData({
        Place: "",
        Area: "",
        No_Of_Bedrooms: "",
        No_Of_Bathrooms: "",
        No_Of_Hospital: "",
        No_Of_College: "",
        rent_img: ""
      });
    } catch (error) {
      console.error('Error creating seller:', error);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className="main">
      <h1>Responsive Card Grid Layout</h1>
      {userType === "seller" && (
        <div className="operation-buttons">
          <Button variant="contained" onClick={() => setShowCreateModal(true)}>Create</Button>
        </div>
      )}
      <ul className="cards">
        {sellers.map((seller) => (
          <li key={seller.id} className="cards_item">
            <div className="card">
              <div className="card_image">
                <img src={seller.attributes.rent_img || 'https://res.cloudinary.com/duugxqvea/image/upload/v1716701044/no_image_fr61a7.png'} alt={seller.attributes.Place} height={300} width={300} />
              </div>
              <div className="card_content">
                <h2 className="card_title">{seller.attributes.Place}</h2>
                <p className="card_text">Area: {seller.attributes.Area}</p>
                <p className="card_text">Bedrooms: {seller.attributes.No_Of_Bedrooms}</p>
                <p className="card_text">Bathrooms: {seller.attributes.No_Of_Bathrooms}</p>
                <p className="card_text">Hospitals Nearby: {seller.attributes.No_Of_Hospital}</p>
                <p className="card_text">Colleges Nearby: {seller.attributes.No_Of_College}</p>
                <button className="btn card_btn">Read More</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <ToastContainer />
      {/* Dialog for create seller */}
      <Dialog
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        aria-labelledby="create-seller-dialog-title" sx={{display:"flex",flexDirection:"column"}}
      >
        <div className="modal">
          <form onSubmit={handleCreateSeller}>
            <label>
              Place:
              <input type="text" name="Place" value={formData.Place} onChange={handleChange} />
            </label>
            <label>
              Area:
              <input type="text" name="Area" value={formData.Area} onChange={handleChange} />
            </label>
            <label>
              Number of Bedrooms:
              <input type="text" name="No_Of_Bedrooms" value={formData.No_Of_Bedrooms} onChange={handleChange} />
            </label>
            <label>
              Number of Bathrooms:
              <input type="text" name="No_Of_Bathrooms" value={formData.No_Of_Bathrooms} onChange={handleChange} />
            </label>
            <label>
              Number of Hospitals Nearby:
              <input type="text" name="No_Of_Hospital" value={formData.No_Of_Hospital} onChange={handleChange} />
            </label>
            <label>
              Number of Colleges Nearby:
              <input type="text" name="No_Of_College" value={formData.No_Of_College} onChange={handleChange} />
            </label>
            <label>
              Rent Image:
              <input type="text" name="rent_img" value={formData.rent_img} onChange={handleChange} />
            </label>
            <button type="submit">Create Seller</button>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

const App = () => {
  const [userType, setUserType] = useState("buyer");

  return (
    <div>
      <Navbar setUserType={setUserType} />
      <SellersList userType={userType} />
    </div>
  );
};

export default App;
