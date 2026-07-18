"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Plus, Upload, X, Package, DollarSign, Box } from "lucide-react";

export default function AdminAddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    brand: "", // Plant type/variant subgroup
    category: "plants", // Main department category selection
    price: "",
    originalPrice: "",
    discountBadge: "",
    description: "",
    stock: "0",
    featured: false,
    specs: [{ label: "", value: "" }]
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (imageFiles.length + files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSpecChange = (index: number, field: "label" | "value", value: string) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specs: newSpecs });
  };

  const addSpec = () => {
    setFormData({
      ...formData,
      specs: [...formData.specs, { label: "", value: "" }]
    });
  };

  const removeSpec = (index: number) => {
    const newSpecs = formData.specs.filter((_, i) => i !== index);
    setFormData({ ...formData, specs: newSpecs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
    
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== "specs") {
          formDataToSend.append(key, String(formData[key as keyof typeof formData]));
        }
      });

      formDataToSend.append("specs", JSON.stringify(formData.specs));

      imageFiles.forEach(file => {
        formDataToSend.append("images", file);
      });

      const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];

      const response = await fetch("http://localhost:5001/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Product created successfully!");
        router.push("/admin/products/list");
      } else {
        toast.error(data.message || "Failed to create product");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while creating the product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Product Variant</h2>
        <p className="text-sm text-gray-500 mt-1">Deploy new botanical varieties, bouquets, inventory stock levels, and imagery.</p>
      </div>

      {/* WHITE BACKGROUND CONTAINER */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2 border-b border-gray-100 pb-2">
            <Package className="w-4 h-4 text-green-600" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-green-600 focus:bg-white transition"
                placeholder="e.g., Crimson Elegance Bouquet"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Classification Sub-Type *
              </label>
              <select
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-green-600 focus:bg-white transition"
              >
                <option value="">Select Sub-Type</option>
                <option value="Indoor">Indoor Plants</option>
                <option value="Outdoor">Outdoor Plants</option>
                <option value="Succulents">Succulents & Cacti</option>
                <option value="Air Purifying">Air Purifying</option>
                <option value="Fresh Cut">Fresh Cut Arrangements</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Main Department Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-green-600 focus:bg-white transition"
              >
                <option value="plants">Plants Catalog</option>
                <option value="roses">Roses Collection</option>
                {/* ADDED BOUQUET DEPARTMENT HERE */}
                <option value="bouquets">Bouquet Department</option> 
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Display Promo Badge
              </label>
              <input
                type="text"
                value={formData.discountBadge}
                onChange={(e) => setFormData({ ...formData, discountBadge: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-green-600 focus:bg-white transition"
                placeholder="e.g., Anniversary Special, 10% OFF"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Product Description & Care Instructions
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-green-600 focus:bg-white transition"
              placeholder="Provide deep details about item description, layout setup, floral counts, or watering needs..."
            />
          </div>
        </div>

        {/* Pricing Layout */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2 border-b border-gray-100 pb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            Pricing Configuration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Selling Price (Rs) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-green-600 focus:bg-white transition"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Original Price / Compare At (Rs)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-green-600 focus:bg-white transition"
                placeholder="Leave empty if not discounted"
              />
            </div>
          </div>
        </div>

        {/* Inventory Management */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2 border-b border-gray-100 pb-2">
            <Box className="w-4 h-4 text-green-600" />
            Stock Operations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Initial Stock Unit Count *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-green-600 focus:bg-white transition"
                placeholder="0"
              />
              <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded mt-2 uppercase tracking-wider ${parseInt(formData.stock) > 0 ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"}`}>
                {parseInt(formData.stock) > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="flex items-center pt-2 md:pt-6">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 bg-gray-50 border-gray-300 rounded focus:ring-0 text-green-600 accent-green-600"
                />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Promote to Featured Carousel</span>
              </label>
            </div>
          </div>
        </div>

        {/* Media Management */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2 border-b border-gray-100 pb-2">
            <Upload className="w-4 h-4 text-green-600" />
            Media Upload (Up to 3 images)
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl p-6 transition hover:border-gray-400">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={imageFiles.length >= 3}
            />
            <label
              htmlFor="images"
              className={`flex flex-col items-center justify-center cursor-pointer ${imageFiles.length >= 3 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs font-bold text-gray-600 tracking-wide text-center">
                {imageFiles.length >= 3 
                  ? "Maximum limit reached" 
                  : "Upload Product Images (JPEG, PNG, WebP)"}
              </span>
              <span className="text-[10px] text-gray-400 mt-1">Max resolution weight: 5MB</span>
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative rounded-xl overflow-hidden border border-gray-200 aspect-square group bg-gray-100">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl p-1.5 transition shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Specifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-100 pb-2">
            Technical Attributes & Specifications
          </h3>
          
          <div className="space-y-3">
            {formData.specs.map((spec, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs focus:outline-none focus:border-green-600 focus:bg-white transition"
                  placeholder="Label (e.g., Stem Count)"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs focus:outline-none focus:border-green-600 focus:bg-white transition"
                  placeholder="Value (e.g., 24 Premium Roses)"
                />
                {formData.specs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addSpec}
            className="inline-block text-xs font-bold text-green-600 hover:text-green-700 pt-1 tracking-wide transition"
          >
            + Add Specification Attribute
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-transparent border border-gray-300 hover:bg-gray-50 text-xs font-bold tracking-wide uppercase text-gray-600 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-xs font-bold tracking-wide uppercase text-white rounded-xl transition flex items-center gap-2 shadow-sm shadow-green-600/10"
          >
            <Plus className="w-4 h-4" />
            {loading ? "Saving to Catalog..." : "Deploy Product"}
          </button>
        </div>
      </form>
    </div>
  );
}