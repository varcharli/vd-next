export function formatDate(isoString: string):string | null {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      // 如果日期无效，返回一个错误消息或默认值
      return null;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

export function formateNow():string{
    return formatDate(new Date().toISOString());
}