export const fmtYMD = (y:number,m:number,d:number) =>
  `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

export const getDow = (y:number,m:number,d:number) => new Date(y, m-1, d).getDay();
export const isWeekend = (dow:number) => dow===0 || dow===6;
