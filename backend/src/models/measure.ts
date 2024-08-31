export interface Measure {
    id: string;
    customerCode: string;
    measureDatetime: Date;
    measureType: 'WATER' | 'GAS';
    imageUrl: string;
    measureValue: number;
    confirmed: boolean;
}