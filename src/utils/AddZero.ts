export default function AddZero(number: number | string): string {
    let num = parseInt(number.toString(), 10);

    if (isNaN(num)) {
        throw new Error("Invalid input: not a number");
    }

    if (num <= 9) {
        return `0${num}`;
    } else {
        return num.toString();
    }
}
