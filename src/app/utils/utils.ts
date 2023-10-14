export class CommonUtils {
    
    static formatCurrency(preco: number): string  {
        return preco.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    }
}