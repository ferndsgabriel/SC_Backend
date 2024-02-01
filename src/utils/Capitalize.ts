export function Capitalize(e:string){
    const Upper = e[0].toUpperCase();
    const Split = e.substring(1).toLowerCase();
    const result = `${Upper}${Split}`;
    return result.trim();
}