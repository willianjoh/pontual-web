
export class CommonUtils {

    static formatCurrency(preco: number): string {
        return preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    }

    static formatData(data: string | undefined): string {
        if (data != null) {
            const today = new Date(data);
            var year = today.getFullYear();
            var month = today.getMonth() + 1;
            var day = today.getDate();

            var monthStr
            var dayStr

            if (month < 10) {
                monthStr = '0' + month;
            } else {
                monthStr = month
            }

            if (day < 10) {
                dayStr = '0' + day;
            } else {
                dayStr = day
            }

            return dayStr + '/' + monthStr + '/' + year;
        }
        return "";
    }

}