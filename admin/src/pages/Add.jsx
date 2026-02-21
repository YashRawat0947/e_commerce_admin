import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Single axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await api.post("/api/product/add", formData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success(response.data.message);

        setName("");
        setDescription("");
        setPrice("");
        setSizes([]);
        setBestseller(false);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);

      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">

      <div className="grid grid-cols-2 gap-8">

        {[image1, image2, image3, image4].map((img, i) => (
          <label key={i}>
            <img
              className="w-20"
              src={!img ? assets.upload_area : URL.createObjectURL(img)}
              alt=""
            />
            <input
              type="file"
              hidden
              onChange={(e) => {
                const files = [setImage1, setImage2, setImage3, setImage4];
                files[i](e.target.files[0]);
              }}
            />
          </label>
        ))}

      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full max-w-[500px] px-3 py-2"
        placeholder="Product name"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full max-w-[500px] px-3 py-2"
        placeholder="Product description"
        required
      />

      <div className="flex gap-4">

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Men</option>
          <option>Women</option>
          <option>Kids</option>
        </select>

        <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
          <option>Topwear</option>
          <option>Bottomwear</option>
          <option>Winterwear</option>
        </select>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />
      </div>

      <div className="flex gap-3">
        {["S","M","L","XL","XXL"].map(size => (
          <p
            key={size}
            onClick={() =>
              setSizes(prev =>
                prev.includes(size)
                  ? prev.filter(s => s !== size)
                  : [...prev, size]
              )
            }
            className={`${sizes.includes(size) ? "bg-pink-200" : "bg-gray-200"} px-3 py-1 cursor-pointer`}
          >
            {size}
          </p>
        ))}
      </div>

      <label className="flex gap-2">
        <input
          type="checkbox"
          checked={bestseller}
          onChange={() => setBestseller(prev => !prev)}
        />
        Bestseller
      </label>

      <button className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>

    </form>
  );
};

export default Add;