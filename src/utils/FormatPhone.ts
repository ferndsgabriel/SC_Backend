export function FormatPhone(phoneNumber:string) {
    let numericOnly = phoneNumber.replace(/\D/g, '');
    // Verifica se o número possui pelo menos 10 dígitos
    if (numericOnly.length < 11) {
        throw new Error('Número inválido')
    }
    if (numericOnly.length > 11) {
        numericOnly = numericOnly.substring(numericOnly.length - 11);
    }
    // Formata o número no padrão desejado: (XX) XXXXX-XXXX
    // Formata o número no padrão desejado: (XX) XXXXX-XXXX
    const formattedNumber = `(${numericOnly.substring(0, 2)}) ${numericOnly.substring(2, 7)}-${numericOnly.substring(7)}`;

    return formattedNumber;
}
