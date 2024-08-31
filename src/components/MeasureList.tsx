import React, { useState, useEffect } from "react";
import axios from 'axios';
import { format } from 'date-fns';


interface Measure {
    id: string;
    measureType: string;
    measureValue: number;
    measureDatetime: Date;
}

interface MeasuresResponse {
    measures: Measure[];
}

const MeasureList: React.FC = () => {
    const [measures, setMeasures] = useState<Measure[]>([]);
    const [customerCode, setCustomerCode] = useState('');

    useEffect(() => {
        if (customerCode) {
          const fetchMeasures = async (): Promise<void> => {
            try {
                const response = await axios.get<MeasuresResponse>(`${process.env.REACT_APP_API_URL}/measures/${customerCode}/list`);
                setMeasures(response.data.measures);
            } catch (error) {
                console.log(error);
            }
          };
          fetchMeasures();
        }
    }, [customerCode]);

    return (
        <div className="search-section">
           <input type="text" value={customerCode} onChange={(e) => setCustomerCode(e.target.value)} placeholder="Código do cliente" />
           <button className="search-button"  onClick={() => setCustomerCode(customerCode)}>Buscar Medida</button>
           <ul>
             {measures.map(measure =>(
                <li key={measure.id}>
                  {measure.measureType} - {measure.measureValue} - {format(measure.measureDatetime, 'yyyy-MM-dd')}
                </li>
             ))}
           </ul>
        </div>
    );
};

export default MeasureList;
