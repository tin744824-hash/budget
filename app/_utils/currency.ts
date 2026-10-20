export const formatter = (num: number, curr: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currencyDisplay: 'code',
        currency: curr,
    });

    return formatter.format(num)
}
