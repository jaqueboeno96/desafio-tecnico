import axios from "axios";

interface MeasureResponse {
    measureValue: number;
}

export const getMeasureValueImage = async (imageBase64: string): Promise<number> => {
    console.log('GOOGLE_GEMINI_API_KEY:', process.env.GOOGLE_GEMINI_API_KEY); // Verifique a chave da API

    try {
        const response = await axios.post<MeasureResponse>('https://api.google.com/gemini/measure', {
            image: imageBase64
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GOOGLE_GEMINI_API_KEY}`
            }
        });

        return response.data.measureValue;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao buscar valor de medida da API do Google Gemini:', error.message);
        } else if (error && (error as any).response) {
            console.error('Erro ao buscar valor de medida da API do Google Gemini:', (error as any).response?.data || 'Erro desconhecido');
        } else {
            console.error('Erro inesperado ao buscar valor de medida da API do Google Gemini:', error);
        }
        throw new Error('Erro ao buscar valor de medida da API do Google Gemini: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
};
