
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

}