import AddZero from "./AddZero";

export default function dateInInt(date:Date, dayMore:number){
    date.setDate(date.getDate() + dayMore);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateConcact = `${AddZero(year)}${AddZero(month)}${AddZero(day)}`;
    return parseInt(dateConcact);
}