
export class CommonUtils {

    static formatCurrency(preco: number): string {
        return preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    }

    static formatData(data: string | undefined): string {
        if (data) {
            const [year, month, day] = data.split('-').map(Number);
    
            const today = new Date(year, month - 1, day);
    
            const formattedDay = String(today.getDate()).padStart(2, '0');
            const formattedMonth = String(today.getMonth() + 1).padStart(2, '0');
            const formattedYear = today.getFullYear();
    
            return `${formattedDay}/${formattedMonth}/${formattedYear}`;
        }
        return "";
    }

    static validarDatas(dataOrcamento: string | null, dataEntrega: string | null): boolean {
        if (!dataOrcamento || !dataEntrega) {
            return false;
        }

        try {
            const [diaOrc, mesOrc, anoOrc] = dataOrcamento.split('/').map(Number);
            const dataOrcamentoObj = new Date(anoOrc, mesOrc - 1, diaOrc);

            const [diaEnt, mesEnt, anoEnt] = dataEntrega.split('/').map(Number);
            const dataEntregaObj = new Date(anoEnt, mesEnt - 1, diaEnt);

            return dataEntregaObj >= dataOrcamentoObj;
        } catch (error) {
            return false;
        }
    }

}