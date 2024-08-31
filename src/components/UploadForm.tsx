import React, { useState } from "react";
import axios from 'axios';

const UploadForm: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [customerCode, setCustomerCode] = useState('');
    const [measureType, setMeasureType] = useState('WATER');
    const [measureDatetime, setMeasureDatetime] = useState('');

    const handleImageUpload  = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image ||  !customerCode || !measureDatetime) return;

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = async () => {
            try {
              const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, {
                image: reader.result?.toString().split(',')[1],
                customer_code: customerCode,
                measure_type: measureType,
                measure_datetime: measureDatetime,
              })
              console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        };
    };
    return (
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleImageUpload} required />
          <input type="text" value={customerCode} onChange={(e) => setCustomerCode(e.target.value)} placeholder="Código do cliente" required />
          <input type="datetime-local" value={measureDatetime} onChange={(e) => setMeasureDatetime(e.target.value)} required />
          <select value={measureType} onChange={(e) => setMeasureType(e.target.value)}>
            <option value="WATER">WATER</option>
            <option value="GAS">GAS</option>
          </select>
          <button type="submit">Carregar</button>
        </form>
    );
};

export default UploadForm;