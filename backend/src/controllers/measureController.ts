import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { getMeasureValueImage } from '../services/googleGeminiService';
import { Measure } from '../models/measure';
import { error } from "console";


//Variavel para armazenar as medições
const measures: Measure[] = []

export const uploadMeasure = async (req: Request, res: Response) => {
    console.log('Upload endpoint hit');
    const { customer_code, measure_datetime, measure_type, image } = req.body;

    if (!customer_code || !measure_datetime || !measure_type || !image) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Campos obrigatórios ausentes!'
        });
    }

    try {
        const existingMeasure = measures.find(measure =>
            measure.customerCode === customer_code &&
            new Date(measure.measureDatetime).getMonth() === new Date(measure_datetime).getMonth() &&
            measure.measureType === measure_type
        );

        if (existingMeasure) {
            return res.status(409).json({
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já foi realizada!'
            });
        }

        //Valor da medição - API Gemini
        const measureValue = await getMeasureValueImage(image);

        //Criar a nova medida
        const newMeasure: Measure = { 
            id: uuidv4(),
            customerCode: customer_code,
            measureDatetime: new Date(measure_datetime),
            measureType: measure_type,
            imageUrl: 'https://url.to/image.jpg',
            measureValue,
            confirmed: false
        };

        measures.push(newMeasure);

        return res.status(201).json({
            image_url: newMeasure.imageUrl,
            measure_value: newMeasure.measureValue,
            measure_uuid: newMeasure.id
        });
    } catch (error: any) {
        console.log('Erro interno no servidor', error)
        return res.status(500).json({
            error_code: 'ERRO_DE_PROCESSAMENTO',
            error_description: 'Falha ao processar a imagem',
            details: error.message
        });
    }
};

export const confirmMeasure = (req: Request, res: Response) => {
    const { measure_uuid, confirmed_value, } = req.body;

    if (!measure_uuid || confirmed_value == undefined) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Campos obrigatórios ausentes!'
        });
    }

    const measure = measures.find(m => m.id === measure_uuid);

    if (!measure) {
        return res.status(404).json({
          error_code: 'MEDIDA_NAO_ENCONTRADA',
          error_description: 'Medida não encontrada'
        });
    }

    if (measure.confirmed)  {
        return res.status(409).json({
          error_code: 'CONFIRMATION_DUPLICATE',
          error_description: 'Medida já foi confirmada'
        });
    }

    measure.measureValue = confirmed_value;
    measure.confirmed = true;

    return res.status(200).json({
      sucess: true
    });
}

export const listMeasures = (req: Request, res: Response) => {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    if (!customer_code) {
        return res.status(400).json({
            error_code: 'DATA_INVALIDA',
            error_description: 'O código do cliente é obrigatório'
        });
    }

    let filteredMeasures = measures.filter(m => m.customerCode === customer_code);

    if (measure_type) {
        filteredMeasures = filteredMeasures.filter(m =>
            m.measureType.toLowerCase() === (measure_type as string).toLowerCase()
        );
    }

    if (filteredMeasures.length === 0) {
        return res.status(404).json({
            error_code: 'MEDIDA_NAO_ENCONTRADA',
            error_description: 'Nenhuma medida encontrada para este cliente'
        });
    }
    
    return res.status(200).json({
        customer_code,
        measures: filteredMeasures
    });
}